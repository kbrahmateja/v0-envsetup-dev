import Link from "next/link"
import { Code, Github, Terminal } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <h3 className="text-lg font-semibold">EnvSetup.dev</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate customized development environments for any programming language or framework.
            </p>
            <div className="flex items-center space-x-3">
              <Link href="https://github.com/kbrahmateja/v0-envsetup-dev" target="_blank"
                className="text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="https://www.npmjs.com/package/@envsetup/cli" target="_blank"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
                <Terminal className="h-3.5 w-3.5" />
                npm
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/generator" className="text-muted-foreground hover:text-foreground">Generator</Link></li>
              <li><Link href="/ai-assistant" className="text-muted-foreground hover:text-foreground">AI Assistant</Link></li>
              <li><Link href="/templates" className="text-muted-foreground hover:text-foreground">Templates</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">CLI</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://www.npmjs.com/package/@envsetup/cli" target="_blank" className="text-muted-foreground hover:text-foreground">@envsetup/cli</Link></li>
              <li><Link href="https://github.com/kbrahmateja/v0-envsetup-dev" target="_blank" className="text-muted-foreground hover:text-foreground">GitHub</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EnvSetup.dev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
