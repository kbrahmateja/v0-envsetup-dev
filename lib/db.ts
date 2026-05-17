import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

function createDbClient(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL

  if (!url) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
      console.warn("DATABASE_URL is missing. SQL queries will fail.")
    }
    return ((..._args: unknown[]) => {
      throw new Error("DATABASE_URL is not configured.")
    }) as unknown as NeonQueryFunction<false, false>
  }

  return neon(url)
}

export const sql = createDbClient()
