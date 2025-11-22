import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = {
  title: "Privacy Policy - EnvSetup.dev",
  description: "Privacy Policy for EnvSetup.dev - Learn how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-balance">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to EnvSetup.dev ("Company," "we," "our," "us"). We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website envsetup.dev and use our services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By using EnvSetup.dev, you agree to the collection and use of information in accordance with this
                policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect personal information that you voluntarily provide to us when you register on the website,
                express an interest in obtaining information about us or our products and services, or otherwise contact
                us. The personal information we collect may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Name and contact data (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Profile information (organization, job title, preferences)</li>
                <li>Communication data (messages, feedback, support requests)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you visit our website, we automatically collect certain information about your device and usage
                patterns, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>IP address, browser type, and operating system</li>
                <li>Pages viewed, time spent on pages, and navigation paths</li>
                <li>Device identifiers and technical specifications</li>
                <li>Cookies and similar tracking technologies data</li>
                <li>Usage analytics and performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Generated Content and Configurations</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect and store the development environment configurations you create, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Project templates and customizations</li>
                <li>Technology stack selections</li>
                <li>Generated configuration files</li>
                <li>Saved environment setups</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect or receive for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>
                  <strong>Service Delivery:</strong> To provide, maintain, and improve our development environment
                  generation services
                </li>
                <li>
                  <strong>Account Management:</strong> To manage your account, authenticate users, and provide customer
                  support
                </li>
                <li>
                  <strong>Communication:</strong> To send administrative information, updates, security alerts, and
                  marketing communications (with your consent)
                </li>
                <li>
                  <strong>Personalization:</strong> To customize your experience and provide personalized
                  recommendations
                </li>
                <li>
                  <strong>Analytics:</strong> To analyze usage patterns, optimize performance, and develop new features
                </li>
                <li>
                  <strong>Security:</strong> To protect against unauthorized access, fraud, and other malicious
                  activities
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service
                </li>
                <li>
                  <strong>Business Operations:</strong> To process payments, maintain records, and conduct business
                  operations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information in the following situations:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Service Providers</h3>
              <p className="text-muted-foreground leading-relaxed">
                We share data with third-party vendors and service providers who perform services on our behalf,
                including hosting, analytics, payment processing, customer service, and email delivery. These providers
                are contractually obligated to protect your information.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Business Transfers</h3>
              <p className="text-muted-foreground leading-relaxed">
                If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets,
                your information may be transferred as part of that transaction.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information if required to do so by law or in response to valid requests by public
                authorities (e.g., court orders, subpoenas, or government agencies).
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Protection of Rights</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose information when we believe it is necessary to protect our rights, your safety or the
                safety of others, investigate fraud, or respond to government requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest using industry-standard protocols (SSL/TLS)</li>
                <li>Secure authentication and access control mechanisms</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Employee training on data protection and security best practices</li>
                <li>Incident response procedures and breach notification protocols</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                strive to use commercially acceptable means to protect your information, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in
                this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer
                need your information, we will securely delete or anonymize it.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Retention periods vary based on the type of information and purpose of processing, typically ranging
                from the duration of your account activity plus 90 days to 7 years for financial records as required by
                law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request access to the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a machine-readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of processing of your information
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your information for certain purposes
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent
                </li>
                <li>
                  <strong>Opt-out:</strong> Opt-out of marketing communications at any time
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@envsetup.dev. We will respond to your request
                within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to collect and track information about your activity on
                our website. You can control cookies through your browser settings. However, disabling cookies may
                affect the functionality of our services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">We use the following types of cookies:</p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for the website to function properly
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Track your browsing habits to show relevant advertisements
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links and Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites, applications, and services. We are not
                responsible for the privacy practices of these third parties. We encourage you to review their privacy
                policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of 13 (or 16 in the European Economic Area).
                We do not knowingly collect personal information from children. If you become aware that a child has
                provided us with personal information, please contact us immediately, and we will take steps to delete
                such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence.
                These countries may have data protection laws that differ from your jurisdiction. We ensure appropriate
                safeguards are in place to protect your information in accordance with this Privacy Policy and
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                operational, or regulatory reasons. We will notify you of material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. Your continued use of our services after such
                modifications constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please
                contact us at:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-lg">
                <p className="font-semibold mb-2">EnvSetup.dev</p>
                <p className="text-muted-foreground">Email: privacy@envsetup.dev</p>
                <p className="text-muted-foreground">Support: support@envsetup.dev</p>
                <p className="text-muted-foreground mt-4">
                  For data protection inquiries specific to GDPR, you may contact our Data Protection Officer at:
                  dpo@envsetup.dev
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
