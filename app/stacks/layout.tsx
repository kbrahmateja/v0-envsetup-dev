import type { Metadata } from "next"
import type { ReactNode } from "react"

// app/stacks/page.tsx is a client component ("use client"), and Next.js
// doesn't allow a client component to export `metadata` directly - without
// this layout, the page silently inherited the root layout's generic
// homepage title/description instead of anything about browsing stacks.
export const metadata: Metadata = {
  title: "Browse Supported Stacks",
  description:
    "Search and browse every language, framework, and stack EnvSetup.dev supports today, with what's ready to generate right now.",
}

export default function StacksLayout({ children }: { children: ReactNode }) {
  return children
}
