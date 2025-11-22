import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ContactForm } from "@/components/contact-form"
import { Mail, MessageSquare, HelpCircle, Building2 } from "lucide-react"

export const metadata = {
  title: "Contact Us - EnvSetup.dev",
  description: "Get in touch with the EnvSetup.dev team for support, sales, partnerships, or general inquiries.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container py-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Have a question or need help? We're here to assist you. Choose the best way to reach us below.
            </p>
          </div>

          {/* Contact Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Technical issues and account help</p>
              <a href="mailto:support@envsetup.dev" className="text-sm text-primary hover:underline">
                support@envsetup.dev
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sales</h3>
              <p className="text-sm text-muted-foreground mb-4">Pricing and enterprise inquiries</p>
              <a href="mailto:sales@envsetup.dev" className="text-sm text-primary hover:underline">
                sales@envsetup.dev
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Partnerships</h3>
              <p className="text-sm text-muted-foreground mb-4">Collaboration and integration opportunities</p>
              <a href="mailto:partners@envsetup.dev" className="text-sm text-primary hover:underline">
                partners@envsetup.dev
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">General</h3>
              <p className="text-sm text-muted-foreground mb-4">Other questions and feedback</p>
              <a href="mailto:hello@envsetup.dev" className="text-sm text-primary hover:underline">
                hello@envsetup.dev
              </a>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you as soon as possible, typically within 24-48 hours.
              </p>
              <ContactForm />
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is EnvSetup.dev?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      EnvSetup.dev is an AI-powered platform that generates customized development environments for any
                      programming language or framework, helping developers set up projects faster and more efficiently.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">How quickly will I receive a response?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We aim to respond to all inquiries within 24-48 hours during business days (Monday-Friday, 9 AM -
                      6 PM EST). Urgent support requests are prioritized.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Yes! Contact our sales team at sales@envsetup.dev to discuss custom enterprise plans, dedicated
                      support, and tailored solutions for your organization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-muted">
                <h3 className="font-semibold mb-3">Other Ways to Reach Us</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Legal & Privacy:</strong>
                    <br />
                    <a href="mailto:legal@envsetup.dev" className="text-primary hover:underline">
                      legal@envsetup.dev
                    </a>
                    {" / "}
                    <a href="mailto:privacy@envsetup.dev" className="text-primary hover:underline">
                      privacy@envsetup.dev
                    </a>
                  </div>
                  <div>
                    <strong className="text-foreground">Billing & Refunds:</strong>
                    <br />
                    <a href="mailto:billing@envsetup.dev" className="text-primary hover:underline">
                      billing@envsetup.dev
                    </a>
                    {" / "}
                    <a href="mailto:refunds@envsetup.dev" className="text-primary hover:underline">
                      refunds@envsetup.dev
                    </a>
                  </div>
                  <div>
                    <strong className="text-foreground">Press & Media:</strong>
                    <br />
                    <a href="mailto:press@envsetup.dev" className="text-primary hover:underline">
                      press@envsetup.dev
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
