import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of EnvSetup.dev and the @envsetup/cli tool.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: August 24, 2026</p>

      <p className="mt-6 text-muted-foreground leading-relaxed">
        Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using envsetup.dev or the{" "}
        <code>@envsetup/cli</code> command-line tool (together, the &ldquo;Service&rdquo;), operated by
        EnvSetup.dev (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using the Service, you agree to these Terms &mdash; if you
        don&rsquo;t agree, please don&rsquo;t use the Service.
      </p>

      <Section title="1. What EnvSetup.dev does">
        <p>
          EnvSetup.dev generates development environment configuration files &mdash; Dockerfiles,
          docker-compose.yml files, .env templates, CI configs, and related boilerplate &mdash; based on the
          language, framework, and tools you select, through the web generator, the AI Assistant, or
          the CLI.
        </p>
      </Section>

      <Section title="2. Using the Service">
        <ul className="list-disc pl-6 space-y-1">
          <li>The Service is currently free to use, on a fair-use basis. If we introduce paid plans in the future, these Terms will be updated and any new pricing or limits will be clearly presented before you&rsquo;re charged for anything.</li>
          <li>You agree not to abuse the Service &mdash; for example, by scripting excessive automated requests against the generator or AI Assistant beyond normal individual use.</li>
          <li>You&rsquo;re responsible for reviewing any generated files before using them &mdash; see &ldquo;No Warranty,&rdquo; below.</li>
        </ul>
      </Section>

      <Section title="3. Your content and generated files">
        <p>
          Any project name, description, or configuration choices you provide belong to you. The
          files EnvSetup.dev generates for you are yours to use, modify, and distribute freely,
          including in commercial projects, with no attribution required.
        </p>
      </Section>

      <Section title="4. AI Assistant">
        <p>
          The AI Assistant provides suggestions based on a knowledge base and, where configured, a
          third-party AI model. Its responses &mdash; including version numbers, compatibility claims, and
          configuration advice &mdash; may occasionally be incomplete or incorrect. Always verify
          AI-generated suggestions before relying on them in production.
        </p>
      </Section>

      <Section title="5. No warranty">
        <p>
          The Service, including all generated files and AI Assistant output, is provided &ldquo;as is,&rdquo;
          without warranties of any kind, express or implied. We don&rsquo;t guarantee that generated
          configurations are secure, bug-free, or suitable for your specific use case &mdash; you&rsquo;re
          responsible for testing and reviewing anything before deploying it.
        </p>
      </Section>

      <Section title="6. Limitation of liability">
        <p>
          To the fullest extent permitted by law, EnvSetup.dev is not liable for any indirect,
          incidental, or consequential damages arising from your use of the Service, including issues
          caused by generated files or AI Assistant suggestions.
        </p>
      </Section>

      <Section title="7. Open source components">
        <p>
          Our CLI tool (<code>@envsetup/cli</code>) is published on npm and GitHub under its own
          license &mdash; see the repository for details.
        </p>
      </Section>

      <Section title="8. Changes to the Service or these Terms">
        <p>
          We may change, suspend, or discontinue features of the Service at any time. We&rsquo;ll update the
          &ldquo;Last updated&rdquo; date above whenever we materially change these Terms.
        </p>
      </Section>

      <Section title="9. Termination">
        <p>
          We may restrict or terminate access to the Service for anyone who abuses it &mdash; for example,
          excessive automated use that degrades the Service for others.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms? Email{" "}
          <Link href="mailto:hello@envsetup.dev" className="text-primary hover:underline">
            hello@envsetup.dev
          </Link>.
        </p>
      </Section>
    </div>
  )
}
