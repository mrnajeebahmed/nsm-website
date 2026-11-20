// Provider-neutral contracts for the LLM gateway.
// Each adapter runs its own tool loop in its native message format
// (so provider-specific blocks such as Claude thinking/fallback blocks are
// replayed unchanged) and returns plain text to the gateway.

export type ProviderId = 'openai' | 'anthropic' | 'gemini';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type JsonSchema = {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

export type ToolSpec = { name: string; description: string; parameters: JsonSchema };

export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<unknown>;

export type RunRequest = {
  system: string;
  history: ChatTurn[];
  tools: ToolSpec[];
  execute: ToolExecutor;
  signal: AbortSignal;
  maxSteps: number;
};

export type RunResult = { text: string; toolsUsed: string[] };

export interface LLMProvider {
  readonly id: ProviderId;
  readonly model: string;
  isConfigured(): boolean;
  run(req: RunRequest): Promise<RunResult>;
}

export class ProviderError extends Error {
  constructor(public provider: ProviderId, message: string, public cause?: unknown) {
    super(`[${provider}] ${message}`);
  }
}
