export function TrustedBySection() {
  const companies = ["Developers", "Startups", "Enterprises", "DevOps Teams", "System Architects", "Bootstrappers"]

  return (
    <section className="border-y border-border/50 bg-muted/30 py-12">
      <div className="container">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by developers, loved by teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((company, i) => (
            <div
              key={i}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
