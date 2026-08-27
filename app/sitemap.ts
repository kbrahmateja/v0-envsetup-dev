import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://envsetup.dev"
  const now = new Date()

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/generator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ai-assistant`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // /docs and /stacks are real, linked, content-rich pages (supported
    // languages/frameworks tables) that were missing here entirely - Google
    // can still find pages through internal links, but leaving them out of
    // the sitemap is a signal against, not for, getting them indexed and
    // ranked for their own search terms.
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/stacks`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]
}
