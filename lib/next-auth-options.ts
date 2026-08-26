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
      // Default scope for the general "Sign in with GitHub" flow - profile
      // only, enough for the /history perk and a higher rate limit. This
      // used to also request `repo` for everyone, so every sign-in (even
      // someone who never touches Push to GitHub) got asked to grant full
      // read/write access to all their repos, public and private - more
      // than the site needed from most people, and a scarier consent screen
      // than a profile-only login deserves.
      //
      // Push to GitHub asks for `repo` separately, only from people who
      // actually click that button, by passing a wider `scope` straight to
      // signIn() at that call site (see components/github-push-dialog.tsx).
      // GitHub's OAuth re-authorization merges newly granted scopes into the
      // user's existing grant for this app rather than replacing it, so this
      // works as true incremental consent - re-running the jwt() callback
      // below with a fresh account.access_token that now includes `repo`.
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // `account`/`profile` are only present on the initial sign-in request;
      // persist the bits we need onto the token so they survive subsequent
      // calls. `accessToken` is intentionally never copied into the
      // `session` callback below - it stays server-side inside the encrypted
      // JWT and is only read back via next-auth/jwt's getToken() in API
      // routes (see app/api/github/create-repo/route.ts), so it's never
      // shipped to the client bundle or exposed to useSession().
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
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
