"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Code, Terminal } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  const navigation = [
    { name: "Generator", href: "/generator" },
    { name: "AI Assistant", href: "/ai-assistant" },
    { name: "Templates", href: "/templates" },
    { name: "Stacks", href: "/stacks" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6" />
            <span className="font-bold text-xl">EnvSetup.dev</span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 border border-violet-200">Beta</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" size="sm" className="hidden md:flex items-center gap-1">
              <Link href="https://www.npmjs.com/package/@envsetup/cli" target="_blank">
                <Terminal className="h-3.5 w-3.5" />
                npx @envsetup/cli
              </Link>
            </Button>
            <ModeToggle />
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="https://www.npmjs.com/package/@envsetup/cli"
                target="_blank"
                className="text-sm font-medium flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Terminal className="h-3.5 w-3.5" />
                CLI (npm)
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
