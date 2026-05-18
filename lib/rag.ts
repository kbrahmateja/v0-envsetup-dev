import { sql } from "./db"

export interface KnowledgeChunk {
  title: string
  content: string
  category: string
  tags: string[]
  rank: number
}

/**
 * Search knowledge base using PostgreSQL full-text search
 * Returns top-k most relevant chunks for the query
 */
export async function searchKnowledge(query: string, limit = 4): Promise<KnowledgeChunk[]> {
  if (!query?.trim()) return []

  try {
    const results = await sql`
      SELECT
        title,
        content,
        category,
        tags,
        ts_rank(search_vector, plainto_tsquery('english', ${query})) AS rank
      FROM knowledge_base
      WHERE search_vector @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    ` as KnowledgeChunk[]

    // If FTS finds nothing, fall back to tag/category matching
    if (!results.length) {
      const words = query.toLowerCase().split(/\s+/)
      const fallback = await sql`
        SELECT title, content, category, tags, 0.1 as rank
        FROM knowledge_base
        WHERE tags && ${words}
        LIMIT ${limit}
      ` as KnowledgeChunk[]
      return fallback
    }

    return results
  } catch (err) {
    console.error("RAG search error:", err)
    return []
  }
}

/**
 * Build context string from retrieved chunks to inject into LLM prompt
 */
export function buildContext(chunks: KnowledgeChunk[]): string {
  if (!chunks.length) return ""

  return `RELEVANT KNOWLEDGE:
${chunks.map(c => `[${c.category.toUpperCase()}] ${c.title}
${c.content}`).join("\n\n")}
---`
}

/**
 * Extract search query from conversation messages
 */
export function extractQuery(messages: { role: string; content: string }[]): string {
  // Take last 2 user messages for context
  const userMsgs = messages
    .filter(m => m.role === "user")
    .slice(-2)
    .map(m => m.content)
    .join(" ")
  return userMsgs
}
