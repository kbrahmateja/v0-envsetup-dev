"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },
    // { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between pl-1 sm:pl-1 lg:pl-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">EnvSetup.dev(Alpha)</span>
          </Link>

          {!isMobile && (
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile ? (
            <>
              <ModeToggle />
              {/* <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button> */}
              <Button asChild>
                <Link href="/generator">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="container py-4 pb-6 border-t">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80 p-2",
                  pathname === item.href ? "text-foreground bg-accent rounded-md" : "text-foreground/60",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {/* <Button asChild variant="outline" className="w-full">
                <Link href="/login">Login</Link>
              </Button> */}
              <Button asChild className="w-full">
                <Link href="/generator">Get Started1</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
