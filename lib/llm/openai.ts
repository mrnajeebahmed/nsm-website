import OpenAI from 'openai';
import type { LLMProvider, RunRequest, RunResult } from './types';
import { ProviderError } from './types';

// OpenAI adapter (official SDK, Chat Completions + function tools).
export class OpenAIProvider implements LLMProvider {
  readonly id = 'openai' as const;
  readonly model = process.env.OPENAI_MODEL || 'gpt-4o';
  private client: OpenAI | null = null;

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  private getClient() {
    this.client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 1 });
    return this.client;
  }

  async run({ system, history, tools, execute, signal, maxSteps }: RunRequest): Promise<RunResult> {
    const client = this.getClient();
    const toolsUsed: string[] = [];
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
      ...history.map((t) => ({ role: t.role, content: t.content }) as OpenAI.Chat.ChatCompletionMessageParam),
    ];
    const toolDefs: OpenAI.Chat.ChatCompletionTool[] = tools.map((t) => ({
      type: 'function',
      function: { name: t.name, description: t.description, parameters: t.parameters },
    }));

    for (let step = 0; step < maxSteps; step++) {
      let completion: OpenAI.Chat.ChatCompletion;
      try {
        completion = await client.chat.completions.create(
          { model: this.model, messages, tools: toolDefs, temperature: 0.4 },
          { signal },
        );
      } catch (err) {
        if (err instanceof OpenAI.APIError) {
          throw new ProviderError(this.id, `API error ${err.status ?? ''}: ${err.message}`, err);
        }
        throw new ProviderError(this.id, (err as Error).message, err);
      }

      const msg = completion.choices[0]?.message;
      if (!msg) throw new ProviderError(this.id, 'Empty completion');
      const calls = (msg.tool_calls ?? []).filter(
        (c): c is OpenAI.Chat.ChatCompletionMessageFunctionToolCall => c.type === 'function',
      );
      if (calls.length === 0) return { text: (msg.content ?? '').trim(), toolsUsed };

      messages.push(msg);
      const results = await Promise.all(
        calls.map(async (call) => {
          toolsUsed.push(call.function.name);
          let content: string;
          try {
            const args = JSON.parse(call.function.arguments || '{}');
            content = JSON.stringify(await execute(call.function.name, args));
          } catch (e) {
            content = JSON.stringify({ error: (e as Error).message });
          }
          return { role: 'tool' as const, tool_call_id: call.id, content };
        }),
      );
      messages.push(...results);
    }
    throw new ProviderError(this.id, 'Tool loop exceeded max steps');
  }
}
