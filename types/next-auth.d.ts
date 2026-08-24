import "next-auth"

// Adds the GitHub login (username) onto the session's user object so
// components/header.tsx and app/history/page.tsx can read session.user.login
// without casting. See lib/auth.ts's session() callback for where it's set.
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      login?: string
    }
  }
}
