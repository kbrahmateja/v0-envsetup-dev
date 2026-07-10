import { sql } from "./db"

export interface KnowledgeChunk {
  title: string
  content: string
  category: string
  tags: string[]
  rank: number
}

/**
 * Turn a free-text query into an OR'd tsquery ("spring | react | mysql") instead of
 * plainto_tsquery's implicit AND. Compound multi-technology questions ("spring react
 * mysql latest") need OR semantics — requiring every term in one row means most
 * real questions match nothing, leaving the LLM with no grounding at all.
 */
export function toOrTsQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" | ")
}

/**
 * Search knowledge base using PostgreSQL full-text search
 * Returns top-k most relevant chunks for the query
 */
export async function searchKnowledge(query: string, limit = 6): Promise<KnowledgeChunk[]> {
  if (!query?.trim()) return []

  const orQuery = toOrTsQuery(query)
  if (!orQuery) return []

  try {
    const results = await sql`
      SELECT
        title,
        content,
        category,
        tags,
        ts_rank(
          to_tsvector('english', title || ' ' || content),
          to_tsquery('english', ${orQuery})
        ) AS rank
      FROM knowledge_base
      WHERE to_tsvector('english', title || ' ' || content)
            @@ to_tsquery('english', ${orQuery})
      ORDER BY rank DESC
      LIMIT ${limit}
    ` as KnowledgeChunk[]

    // If FTS finds nothing, fall back to substring matching against tags
    // (tags are stored as multi-word phrases like "spring boot", so a plain
    // array-overlap check against single query words would never match).
    if (!results.length) {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean)
      const fallback = await sql`
        SELECT title, content, category, tags, 0.1 as rank
        FROM knowledge_base
        WHERE EXISTS (
          SELECT 1 FROM unnest(tags) AS tag, unnest(${words}::text[]) AS word
          WHERE tag ILIKE '%' || word || '%'
        )
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
