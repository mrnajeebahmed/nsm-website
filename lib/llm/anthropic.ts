import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider, RunRequest, RunResult } from './types';
import { ProviderError } from './types';

// Claude adapter (official SDK). Uses the beta Messages endpoint so the
// server-side refusal fallback can be enabled; replays `response.content`
// unchanged inside the tool loop so thinking/fallback blocks stay valid.
export class AnthropicProvider implements LLMProvider {
  readonly id = 'anthropic' as const;
  readonly model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
  private client: Anthropic | null = null;

  isConfigured() {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }

  private getClient() {
    // maxRetries kept low: the gateway handles failover to other providers.
    this.client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1 });
    return this.client;
  }

  async run({ system, history, tools, execute, signal, maxSteps }: RunRequest): Promise<RunResult> {
    const client = this.getClient();
    const toolsUsed: string[] = [];
    const messages: Anthropic.Beta.BetaMessageParam[] = history.map((t) => ({ role: t.role, content: t.content }));
    const toolDefs: Anthropic.Beta.BetaTool[] = tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    }));
    const useServerFallback = process.env.ANTHROPIC_SERVER_FALLBACK !== 'false';

    for (let step = 0; step < maxSteps; step++) {
      let res: Anthropic.Beta.BetaMessage;
      try {
        res = await client.beta.messages.create(
          {
            model: this.model,
            max_tokens: 8000,
            system,
            messages,
            tools: toolDefs,
            // Chat is latency-sensitive; low effort keeps replies fast and concise.
            output_config: { effort: 'low' },
            ...(useServerFallback
              ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const }
              : {}),
          },
          { signal },
        );
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          throw new ProviderError(this.id, `API error ${err.status ?? ''}: ${err.message}`, err);
        }
        throw new ProviderError(this.id, (err as Error).message, err);
      }

      if (res.stop_reason === 'refusal') {
        return {
          text: 'I can’t help with that request, but I’m happy to discuss how AI and automation could help your business operations.',
          toolsUsed,
        };
      }

      const toolUses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use');
      if (res.stop_reason !== 'tool_use' || toolUses.length === 0) {
        const text = res.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('\n')
          .trim();
        return { text, toolsUsed };
      }

      // Echo the full assistant content back, then return ALL tool results in one user turn.
      messages.push({ role: 'assistant', content: res.content });
      const results = await Promise.all(
        toolUses.map(async (tu): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
          toolsUsed.push(tu.name);
          try {
            const out = await execute(tu.name, (tu.input ?? {}) as Record<string, unknown>);
            return { type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(out) };
          } catch (e) {
            return { type: 'tool_result', tool_use_id: tu.id, content: (e as Error).message, is_error: true };
          }
        }),
      );
      messages.push({ role: 'user', content: results });
    }
    throw new ProviderError(this.id, 'Tool loop exceeded max steps');
  }
}
