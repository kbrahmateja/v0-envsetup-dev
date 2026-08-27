// Config for the "Deploy This Environment" links shown after a user
// generates a Dockerfile/compose setup, plus the README's "Deploy This
// Project" section.
//
// `referralUrl` stays `null` for every entry until we're actually accepted
// into that platform's real affiliate/referral program - we never want a
// link that LOOKS like it's earning us anything when it isn't yet. Once a
// real program is joined, paste the real referral URL in below and both the
// results-page card and the generated README pick it up automatically,
// with zero other code changes.
export interface AffiliateLink {
  id: string
  name: string
  category: "hosting" | "database"
  blurb: string
  officialUrl: string
  referralUrl: string | null
}

export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: "railway",
    name: "Railway",
    category: "hosting",
    blurb: "Point it at your Dockerfile and it deploys - no extra config.",
    officialUrl: "https://railway.app",
    referralUrl: null,
  },
  {
    id: "render",
    name: "Render",
    category: "hosting",
    blurb: "Free-tier friendly Docker hosting with automatic HTTPS.",
    officialUrl: "https://render.com",
    referralUrl: null,
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "hosting",
    blurb: "Best fit if your stack is Next.js or another frontend framework.",
    officialUrl: "https://vercel.com",
    referralUrl: null,
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    category: "hosting",
    blurb: "Simple VPS and App Platform hosting with predictable pricing.",
    officialUrl: "https://www.digitalocean.com",
    referralUrl: null,
  },
  {
    id: "flyio",
    name: "Fly.io",
    category: "hosting",
    blurb: "Runs your container on servers close to your users, globally.",
    officialUrl: "https://fly.io",
    referralUrl: null,
  },
  {
    id: "neon",
    name: "Neon",
    category: "database",
    blurb: "Serverless Postgres with a generous free tier, if you need a DB.",
    officialUrl: "https://neon.tech",
    referralUrl: null,
  },
]

export function getAffiliateLink(id: string): AffiliateLink | undefined {
  return AFFILIATE_LINKS.find((link) => link.id === id)
}

// Always resolves to a working URL - a real referral link once we have one,
// the platform's plain official site until then.
export function getAffiliateUrl(link: AffiliateLink): string {
  return link.referralUrl ?? link.officialUrl
}
