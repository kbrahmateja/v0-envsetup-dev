"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
          <span className="text-xl font-bold">Envsetup.dev</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#tech-stacks" className="transition-colors hover:text-primary">
            Tech Stacks
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="/generator" className="transition-colors hover:text-primary">
            Generator
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/generator">Try Free</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/generator">Get Started</Link>
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#tech-stacks" className="text-sm font-medium transition-colors hover:text-primary">
              Tech Stacks
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/generator" className="text-sm font-medium transition-colors hover:text-primary">
              Generator
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
