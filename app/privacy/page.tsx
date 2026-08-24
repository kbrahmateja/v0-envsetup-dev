import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EnvSetup.dev collects, uses, and protects your information.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: August 24, 2026</p>

      <p className="mt-6 text-muted-foreground leading-relaxed">
        EnvSetup.dev (&ldquo;EnvSetup,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) builds tools that generate development
        environment configuration files &mdash; Dockerfiles, docker-compose files, .env templates, and
        related setup scripts &mdash; through envsetup.dev and the <code>@envsetup/cli</code> command-line
        tool. This policy explains what information we collect, how we use it, and the choices you
        have.
      </p>

      <Section title="1. Information we collect">
        <p><strong className="text-foreground">Information you provide directly:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your email address, if you join our waitlist, subscribe to updates, or contact us.</li>
          <li>Messages you send to our AI Assistant chat.</li>
          <li>Feedback you submit through the feedback widget.</li>
          <li>Project details you enter into the generator (e.g. project name, description), used only to produce your files.</li>
        </ul>
        <p className="pt-2"><strong className="text-foreground">Information collected automatically:</strong> when you visit envsetup.dev we
        automatically collect your IP address (and an approximate country/region/city derived from
        it), your browser&rsquo;s user agent, the page you visited, the site that referred you, and basic
        usage analytics via Google Analytics and Vercel Analytics. We use this to understand how the
        site is used and to improve it &mdash; not to identify you personally.</p>
      </Section>

      <Section title="2. Cookies">
        <p>We use a small number of cookies:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>admin_session</code> &mdash; used only for our internal admin login; not set for regular visitors.</li>
          <li><code>ai_uid</code> &mdash; a long-lived, anonymous identifier used to apply fair-use limits to the free AI Assistant, so one visitor can&rsquo;t send unlimited requests.</li>
          <li>Cookies set by Google Analytics, used for traffic analytics.</li>
        </ul>
        <p>Vercel Analytics is cookieless. You can control or block cookies in your browser settings &mdash; the core generator and CLI work without them.</p>
      </Section>

      <Section title="3. How we use information">
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide, maintain, and improve EnvSetup.dev and the CLI.</li>
          <li>To respond to your questions and feedback.</li>
          <li>To send product updates, if you&rsquo;ve asked to receive them &mdash; you can unsubscribe at any time.</li>
          <li>To detect and prevent abuse of free features, like the AI Assistant.</li>
          <li>To understand aggregate traffic patterns: pages visited, referral sources, device types.</li>
        </ul>
      </Section>

      <Section title="4. AI Assistant">
        <p>
          If you use the AI Assistant, your messages are sent to a third-party AI provider (Groq or
          OpenAI, depending on configuration) to generate a response. We don&rsquo;t use your conversations
          to train our own models. Please avoid sharing sensitive personal information in the chat.
        </p>
      </Section>

      <Section title="5. Third parties we share data with">
        <p>We don&rsquo;t sell your personal information. We use the following service providers to operate EnvSetup.dev, each under their own privacy policy:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-foreground">Neon</strong> &mdash; our database, which stores visitor analytics, waitlist/newsletter emails, and feedback.</li>
          <li><strong className="text-foreground">Google Analytics</strong> and <strong className="text-foreground">Vercel Analytics</strong> &mdash; website analytics.</li>
          <li><strong className="text-foreground">Brevo</strong> &mdash; sending newsletter and product emails.</li>
          <li><strong className="text-foreground">Groq</strong> / <strong className="text-foreground">OpenAI</strong> &mdash; powering the AI Assistant.</li>
          <li><strong className="text-foreground">ip-api.com</strong> &mdash; approximate geolocation from IP address.</li>
          <li><strong className="text-foreground">Vercel</strong> &mdash; hosting.</li>
          <li><strong className="text-foreground">GitHub</strong> &mdash; our CLI and source are public on GitHub; anything you post there is public.</li>
        </ul>
      </Section>

      <Section title="6. Data retention">
        <p>
          We retain visitor analytics and feedback for as long as it&rsquo;s reasonably useful for improving
          the product. You can ask us to delete your email address or feedback at any time &mdash; see
          Contact, below.
        </p>
      </Section>

      <Section title="7. Your choices">
        <ul className="list-disc pl-6 space-y-1">
          <li>Unsubscribe from any email using the link in the email, or by contacting us.</li>
          <li>Ask what data we hold about you, or ask us to delete it, by emailing us.</li>
          <li>Block cookies and analytics scripts in your browser &mdash; the generator and CLI still work.</li>
        </ul>
      </Section>

      <Section title="8. Children's privacy">
        <p>EnvSetup.dev is not directed at children under 13, and we do not knowingly collect information from children under 13.</p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>We may update this policy as the product changes. We&rsquo;ll update the &ldquo;Last updated&rdquo; date above whenever we do.</p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about this policy? Email{" "}
          <Link href="mailto:hello@envsetup.dev" className="text-primary hover:underline">
            hello@envsetup.dev
          </Link>.
        </p>
      </Section>
    </div>
  )
}
