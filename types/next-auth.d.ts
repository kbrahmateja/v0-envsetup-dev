import "next-auth"
import "next-auth/jwt"

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

// accessToken/githubLogin are stashed on the JWT in
// lib/next-auth-options.ts's jwt() callback. accessToken deliberately never
// reaches the Session type above - it's read server-side only, via
// next-auth/jwt's getToken(), by API routes that need to call GitHub's API
// on the user's behalf (see app/api/github/create-repo/route.ts).
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    githubLogin?: string
  }
}
