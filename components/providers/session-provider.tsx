"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

// Thin client wrapper — next-auth's SessionProvider uses React context and
// can't be imported directly into the (server) root layout.
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
