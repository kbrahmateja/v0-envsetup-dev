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
      // Default GitHub scope is read:user + user:email, which is enough for
      // sign-in but NOT enough to create a repo - the "Push to GitHub"
      // button (app/api/github/create-repo/route.ts) needs the `repo` scope
      // to call POST /user/repos and PUT .../contents on the user's behalf.
      // This does mean everyone who signs in - even people who just want
      // the /history perk - sees GitHub's consent screen ask for repo
      // access, not just profile access. That trade-off was a deliberate
      // call, not an oversight: NextAuth has no clean way to step up an
      // existing session to a wider scope later, so requesting it once at
      // sign-in is what makes "Push to GitHub" actually work without a
      // second consent flow bolted on.
      authorization: { params: { scope: "read:user user:email repo" } },
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
