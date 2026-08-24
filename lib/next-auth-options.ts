import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

// Optional sign-in, not required to use the Wizard/AI Assistant/CLI.
// Perks only: save/see past generations (/history) and a higher rate
// limit on the generate-deployment endpoint. JWT session strategy is used
// (no database adapter) so this doesn't require its own schema — we just
// stash the GitHub login/email on the token and read it back in API routes
// via getServerSession when we want to tag a generation with an identity.
//
// Named separately from lib/auth.ts, which is the *admin dashboard's*
// unrelated HMAC-session login (verifyCredentials/createSessionToken/
// verifySessionToken) — keeping these in different files avoids the two
// auth systems colliding.
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      // `profile` is only present on the initial sign-in request; persist
      // the bits we need onto the token so they survive subsequent calls.
      if (profile) {
        const githubProfile = profile as { login?: string; email?: string | null }
        token.githubLogin = githubProfile.login
        if (githubProfile.email) token.email = githubProfile.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.login = token.githubLogin as string | undefined
      }
      return session
    },
  },
  pages: {
    // Skip the default NextAuth sign-in page and go straight to GitHub —
    // there's only one provider, no reason to make people click through
    // an extra screen.
    signIn: "/api/auth/signin",
  },
}
