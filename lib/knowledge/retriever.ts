import { promises as fs } from 'node:fs';
import path from 'node:path';

// Knowledge grounding. The `Retriever` interface lets you swap this
// in-process BM25 index for pgvector / Pinecone without touching callers.

export type KnowledgeChunk = { id: string; source: string; title: string; text: string };

export interface Retriever {
  search(query: string, k?: number): Promise<KnowledgeChunk[]>;
}

const STOP = new Set('a an and are as at be by can do does for from has have how i in is it its of on or our the this to we what when where which who why with you your'.split(' '));
const tokenize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

class Bm25Retriever implements Retriever {
  private chunks: (KnowledgeChunk & { tokens: string[] })[] = [];
  private df = new Map<string, number>();
  private avgLen = 0;

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks.map((c) => ({ ...c, tokens: tokenize(`${c.title} ${c.title} ${c.text}`) }));
    for (const c of this.chunks) for (const t of new Set(c.tokens)) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    this.avgLen = this.chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(1, this.chunks.length);
  }

  async search(query: string, k = 4): Promise<KnowledgeChunk[]> {
    const q = tokenize(query);
    if (q.length === 0) return [];
    const N = this.chunks.length, k1 = 1.4, b = 0.75;
    const scored = this.chunks.map((c) => {
      let score = 0;
      for (const term of q) {
        const tf = c.tokens.filter((t) => t === term || (term.length > 4 && t.startsWith(term.slice(0, -1)))).length;
        if (!tf) continue;
        const df = this.df.get(term) ?? 1;
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * c.tokens.length) / this.avgLen)));
      }
      return { c, score };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ c: { tokens: _t, ...chunk } }) => chunk);
  }
}

async function loadChunks(): Promise<KnowledgeChunk[]> {
  const dir = path.join(process.cwd(), 'knowledge');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  const chunks: KnowledgeChunk[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    // Chunk on H2 headings; each section is one retrievable unit.
    for (const [i, section] of raw.split(/^## /m).slice(1).entries()) {
      const [title, ...body] = section.split('\n');
      chunks.push({ id: `${file}#${i}`, source: file, title: title.trim(), text: body.join(' ').replace(/\s+/g, ' ').trim() });
    }
  }
  return chunks;
}

let instance: Promise<Retriever> | null = null;
export function getRetriever(): Promise<Retriever> {
  instance ??= loadChunks().then((c) => new Bm25Retriever(c));
  return instance;
}
