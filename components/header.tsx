"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Code, Terminal, Github, History, LogOut } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()
  const { data: session, status } = useSession()

  const navigation = [
    { name: "Generator", href: "/generator" },
    { name: "AI Assistant", href: "/ai-assistant" },
    { name: "Templates", href: "/templates" },
    { name: "Stacks", href: "/stacks" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
  ]

  const AccountControl = () => {
    if (status === "loading") {
      return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" aria-hidden="true" />
    }

    if (!session) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-1.5"
          onClick={() => signIn("github")}
        >
          <Github className="h-3.5 w-3.5" />
          Sign in
        </Button>
      )
    }

    const initials = (session.user?.name ?? session.user?.login ?? "?").slice(0, 2).toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Account menu">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? "Your avatar"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none">{session.user?.name ?? session.user?.login}</p>
              {session.user?.login && <p className="text-xs leading-none text-muted-foreground">@{session.user.login}</p>}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/history" className="cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              Your generations
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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
            <AccountControl />
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
                href="/history"
                className="text-sm font-medium flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <History className="h-3.5 w-3.5" />
                Your generations
              </Link>
              {!session ? (
                <button
                  className="text-sm font-medium flex items-center gap-1"
                  onClick={() => {
                    setIsMenuOpen(false)
                    signIn("github")
                  }}
                >
                  <Github className="h-3.5 w-3.5" />
                  Sign in with GitHub
                </button>
              ) : (
                <button
                  className="text-sm font-medium flex items-center gap-1"
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut()
                  }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              )}
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
