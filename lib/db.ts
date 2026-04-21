import { neon } from "@neondatabase/serverless"

/**
 * A lazily-initialized database client that prevents build-time errors
 * when DATABASE_URL is missing in the environment.
 */
function createDbClient() {
  const url = process.env.DATABASE_URL

  // If we're in the build phase and DB URL is missing, return a dummy function
  // that logs a warning instead of crashing.
  if (!url) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
      console.warn("DATABASE_URL is missing during build/production. SQL queries will fail.")
    }

    // Return a dummy tag function during build
    return (strings: TemplateStringsArray, ...values: any[]) => {
      console.error("Attempted to execute SQL query without DATABASE_URL")
      throw new Error("DATABASE_URL is not configured.")
    }
  }

  // Regular Neon client
  return neon(url)
}

// Export a proxy or a function to get the client
// Using a proxy allows us to keep the `sql` tag syntax
export const sql = new Proxy(() => {}, {
  apply(target, thisArg, argumentsList) {
    const client = createDbClient()
    return (client as any)(...argumentsList)
  },
  get(target, prop, receiver) {
    const client = createDbClient()
    return Reflect.get(client, prop, receiver)
  },
}) as ReturnType<typeof neon>
