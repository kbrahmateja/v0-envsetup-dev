import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = {
  title: "Terms & Conditions - EnvSetup.dev",
  description: "Terms and Conditions for using EnvSetup.dev services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-balance">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User," "you,"
                or "your") and EnvSetup.dev ("Company," "we," "us," or "our") governing your access to and use of the
                envsetup.dev website and all associated services, features, content, and applications (collectively, the
                "Services").
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                BY ACCESSING OR USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE
                BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE OUR SERVICES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property Rights</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Our Intellectual Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Services, including but not limited to text, graphics,
                logos, icons, images, audio clips, video clips, data compilations, software code, algorithms, templates,
                and the compilation thereof (collectively, "Content"), are the exclusive property of EnvSetup.dev and
                are protected by United States and international copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The EnvSetup.dev name, logo, and all related names, logos, product and service names, designs, and
                slogans are trademarks of EnvSetup.dev or its affiliates. You may not use these marks without our prior
                written permission.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Generated Content Ownership</h3>
              <p className="text-muted-foreground leading-relaxed">
                Subject to your compliance with these Terms and payment of applicable fees, you retain ownership of the
                development environment configurations, code, and files that you generate using our Services ("Generated
                Content"). However, by using our Services, you grant us a worldwide, non-exclusive, royalty-free license
                to use, reproduce, and analyze such Generated Content solely for the purposes of:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Providing, maintaining, and improving the Services</li>
                <li>Developing new features and functionality</li>
                <li>Training and improving our algorithms and AI models</li>
                <li>Aggregated analytics and research (in anonymized form)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 User Content License</h3>
              <p className="text-muted-foreground leading-relaxed">
                By uploading, submitting, or otherwise making available any content through the Services, you grant
                EnvSetup.dev a perpetual, irrevocable, worldwide, royalty-free, and non-exclusive license to use,
                reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and
                display such content in connection with operating and providing the Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use the Services for any unlawful purpose or in any way that violates these Terms.
                Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Violating any applicable local, state, national, or international law or regulation</li>
                <li>Infringing upon the intellectual property rights of EnvSetup.dev or any third party</li>
                <li>Transmitting any harmful, threatening, abusive, harassing, defamatory, or obscene material</li>
                <li>Attempting to gain unauthorized access to the Services, accounts, or computer systems</li>
                <li>Interfering with or disrupting the Services or servers or networks connected to the Services</li>
                <li>Using the Services to distribute malware, viruses, or other malicious code</li>
                <li>Engaging in any form of automated data collection, scraping, or crawling without authorization</li>
                <li>Impersonating any person or entity or falsely stating or misrepresenting your affiliation</li>
                <li>Using the Services to compete with EnvSetup.dev or develop competing products</li>
                <li>Reverse engineering, decompiling, or disassembling any aspect of the Services</li>
                <li>Reselling, sublicensing, or distributing the Services without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Account Registration and Security</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Account Creation</h3>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features of the Services, you must register for an account. You agree to provide
                accurate, current, and complete information during registration and to update such information to keep
                it accurate, current, and complete. You are responsible for safeguarding your account credentials and
                for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Account Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                You must immediately notify us of any unauthorized use of your account or any other breach of security.
                We are not liable for any loss or damage arising from your failure to comply with these security
                obligations.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time, with or without notice, for any
                reason, including if we believe you have violated these Terms. Upon termination, your right to use the
                Services will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Subscription and Payment Terms</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Subscription Plans</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer various subscription plans with different features and pricing. By subscribing to a paid plan,
                you agree to pay the fees associated with that plan. All fees are non-refundable except as expressly
                provided in our Refund Policy.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Billing and Automatic Renewal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Subscription fees are billed in advance on a recurring basis (monthly or annually, as selected). Your
                subscription will automatically renew at the end of each billing period unless you cancel before the
                renewal date. You authorize us to charge your payment method for the renewal fees.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Price Changes</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to change our pricing at any time. If we change the price of your subscription, we
                will provide you with at least 30 days' notice before the change takes effect. Your continued use of the
                Services after the price change constitutes acceptance of the new price.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.4 Taxes</h3>
              <p className="text-muted-foreground leading-relaxed">
                All fees are exclusive of applicable taxes (including sales, use, and value-added taxes), unless
                otherwise stated. You are responsible for paying all applicable taxes associated with your purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Service Availability and Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide reliable and uninterrupted Services, but we do not guarantee that the Services will
                be available at all times or error-free. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Modify, suspend, or discontinue any aspect of the Services at any time</li>
                <li>Impose limits on certain features or restrict access to parts of the Services</li>
                <li>Perform scheduled or emergency maintenance</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We will make reasonable efforts to notify you of any significant changes or planned downtime, but we are
                not liable for any service interruptions or modifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">ENVSETUP.DEV DOES NOT WARRANT THAT:</p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>The Services will meet your requirements or expectations</li>
                <li>The Services will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using the Services will be accurate or reliable</li>
                <li>Any errors in the Services will be corrected</li>
                <li>Generated Content will be suitable for your intended purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ENVSETUP.DEV, ITS AFFILIATES, OFFICERS,
                DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL,
                OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF THE SERVICES, EVEN IF
                WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES
                SHALL NOT EXCEED THE AMOUNT YOU PAID TO ENVSETUP.DEV IN THE TWELVE (12) MONTHS PRECEDING THE EVENT
                GIVING RISE TO THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless EnvSetup.dev and its affiliates, officers, directors,
                employees, agents, and licensors from and against any and all claims, liabilities, damages, losses,
                costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Your use or misuse of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your User Content or Generated Content</li>
                <li>Any third-party claims related to your use of the Services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Data Protection and Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms
                by reference. Please review our Privacy Policy to understand our data collection, use, and protection
                practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Third-Party Services and Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Services may contain links to third-party websites, applications, or services that are not owned or
                controlled by EnvSetup.dev. We are not responsible for the content, privacy policies, or practices of
                any third-party sites or services. You acknowledge and agree that EnvSetup.dev shall not be liable for
                any damage or loss caused by your use of any third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution and Arbitration</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">12.1 Informal Resolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Before filing a formal dispute, you agree to contact us at legal@envsetup.dev and attempt to resolve the
                dispute informally for at least 30 days.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Binding Arbitration</h3>
              <p className="text-muted-foreground leading-relaxed">
                If we cannot resolve the dispute informally, any dispute, claim, or controversy arising out of or
                relating to these Terms or the Services shall be settled by binding arbitration administered by the
                American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The
                arbitration shall be conducted in English, and the arbitrator's decision shall be final and binding.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">12.3 Class Action Waiver</h3>
              <p className="text-muted-foreground leading-relaxed">
                YOU AND ENVSETUP.DEV AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
                CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States and the
                State of Delaware, without regard to its conflict of law provisions. Any legal action or proceeding
                relating to your access to or use of the Services shall be instituted in a state or federal court in
                Delaware, and you consent to the exclusive jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Export Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to comply with all applicable export and re-export control laws and regulations, including the
                Export Administration Regulations maintained by the U.S. Department of Commerce. You represent that you
                are not located in, under the control of, or a national or resident of any country to which the United
                States has embargoed goods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining
                provisions shall continue in full force and effect. The invalid provision shall be modified to the
                minimum extent necessary to make it valid and enforceable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between
                you and EnvSetup.dev regarding the Services and supersede all prior agreements, communications, and
                understandings, whether oral or written.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by
                posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the
                Services after such changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">18. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-lg">
                <p className="font-semibold mb-2">EnvSetup.dev</p>
                <p className="text-muted-foreground">Email: legal@envsetup.dev</p>
                <p className="text-muted-foreground">Support: support@envsetup.dev</p>
                <p className="text-muted-foreground">General Inquiries: hello@envsetup.dev</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
