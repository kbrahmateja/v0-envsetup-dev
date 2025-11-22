import Link from "next/link"

export function LandingFooter() {
  const sections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Tech Stacks", href: "#tech-stacks" },
        { label: "Pricing", href: "#pricing" },
        { label: "Generator", href: "/generator" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Templates", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold">Envsetup.dev</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered development environment automation. Ship faster. Configure nothing.
            </p>
          </div>

          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Envsetup.dev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
