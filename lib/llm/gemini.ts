import type { LLMProvider, RunRequest, RunResult } from './types';
import { ProviderError } from './types';

// Gemini adapter over the REST generateContent endpoint (function calling).
type Part = { text?: string; functionCall?: { name: string; args?: Record<string, unknown> }; functionResponse?: unknown };
type Content = { role: 'user' | 'model'; parts: Part[] };

export class GeminiProvider implements LLMProvider {
  readonly id = 'gemini' as const;
  readonly model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async run({ system, history, tools, execute, signal, maxSteps }: RunRequest): Promise<RunResult> {
    const toolsUsed: string[] = [];
    const contents: Content[] = history.map((t) => ({
      role: t.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: t.content }],
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`;

    for (let step = 0; step < maxSteps; step++) {
      const res = await fetch(url, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY! },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          tools: [{ functionDeclarations: tools.map((t) => ({ name: t.name, description: t.description, parameters: stripUnsupported(t.parameters) })) }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
        }),
      }).catch((e) => {
        throw new ProviderError(this.id, (e as Error).message, e);
      });
      if (!res.ok) throw new ProviderError(this.id, `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);

      const data = (await res.json()) as { candidates?: { content?: Content }[] };
      const parts = data.candidates?.[0]?.content?.parts ?? [];
      const calls = parts.filter((p) => p.functionCall);
      if (calls.length === 0) {
        return { text: parts.map((p) => p.text ?? '').join('').trim(), toolsUsed };
      }

      contents.push({ role: 'model', parts });
      const responses = await Promise.all(
        calls.map(async (p) => {
          const { name, args } = p.functionCall!;
          toolsUsed.push(name);
          let response: unknown;
          try {
            response = { result: await execute(name, args ?? {}) };
          } catch (e) {
            response = { error: (e as Error).message };
          }
          return { functionResponse: { name, response } };
        }),
      );
      contents.push({ role: 'user', parts: responses });
    }
    throw new ProviderError(this.id, 'Tool loop exceeded max steps');
  }
}

// Gemini's schema dialect rejects `additionalProperties`.
function stripUnsupported(schema: object): object {
  const { additionalProperties: _omit, ...rest } = schema as Record<string, unknown>;
  return rest;
}
