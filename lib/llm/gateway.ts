import { AnthropicProvider } from './anthropic';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import type { ChatTurn, LLMProvider, ProviderId, ToolExecutor, ToolSpec } from './types';

// Unified LLM gateway: resolves the provider chain from env, applies a
// per-attempt timeout, and fails over to the next configured provider.

const registry: Record<ProviderId, LLMProvider> = {
  anthropic: new AnthropicProvider(),
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
};

const isProviderId = (v: string): v is ProviderId => v in registry;

export function providerChain(): LLMProvider[] {
  const primary = (process.env.DEFAULT_LLM_PROVIDER || 'anthropic').trim().toLowerCase();
  const fallbacks = (process.env.LLM_FALLBACK_ORDER || 'openai,gemini,anthropic')
    .split(',')
    .map((s) => s.trim().toLowerCase());
  const order = [primary, ...fallbacks].filter(isProviderId);
  return [...new Set(order)].map((id) => registry[id]).filter((p) => p.isConfigured());
}

export type GatewayResult =
  | { ok: true; text: string; provider: ProviderId; model: string; toolsUsed: string[]; attempts: string[] }
  | { ok: false; attempts: string[] };

export async function generate(opts: {
  system: string;
  history: ChatTurn[];
  tools: ToolSpec[];
  execute: ToolExecutor;
}): Promise<GatewayResult> {
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS || 20_000);
  const attempts: string[] = [];

  // Memoize tool side effects across failover attempts so a lead is never
  // created twice if provider A fails after executing a tool.
  const cache = new Map<string, Promise<unknown>>();
  const execute: ToolExecutor = (name, args) => {
    const key = `${name}:${JSON.stringify(args)}`;
    if (!cache.has(key)) cache.set(key, opts.execute(name, args));
    return cache.get(key)!;
  };

  for (const provider of providerChain()) {
    const started = Date.now();
    try {
      const result = await provider.run({
        system: opts.system,
        history: opts.history,
        tools: opts.tools,
        execute,
        signal: AbortSignal.timeout(timeoutMs),
        maxSteps: 4,
      });
      if (!result.text) throw new Error('Empty response');
      attempts.push(`${provider.id}:ok:${Date.now() - started}ms`);
      return { ok: true, text: result.text, provider: provider.id, model: provider.model, toolsUsed: result.toolsUsed, attempts };
    } catch (err) {
      attempts.push(`${provider.id}:fail:${Date.now() - started}ms`);
      console.warn('[llm-gateway] provider failed, failing over', provider.id, (err as Error).message);
    }
  }
  return { ok: false, attempts };
}
