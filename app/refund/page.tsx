import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = {
  title: "Refund Policy - EnvSetup.dev",
  description: "Refund Policy for EnvSetup.dev subscriptions and services.",
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-balance">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                At EnvSetup.dev, we are committed to providing high-quality services and ensuring customer satisfaction.
                This Refund Policy outlines the terms and conditions under which refunds may be issued for our services.
                By purchasing a subscription or service from EnvSetup.dev, you agree to the terms of this Refund Policy.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We encourage you to review our features, pricing, and trial options carefully before making a purchase.
                If you have any questions about our services, please contact our support team at support@envsetup.dev
                before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Subscription Refund Policy</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 14-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 14-day money-back guarantee for new subscribers on monthly and annual plans. If you are not
                satisfied with our services for any reason within the first 14 days of your initial subscription
                purchase, you may request a full refund.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To qualify for the 14-day money-back guarantee:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>The refund request must be made within 14 calendar days of the initial purchase date</li>
                <li>This applies only to first-time subscribers to a paid plan</li>
                <li>The refund request must be submitted through our official support channels</li>
                <li>Account must not have been suspended or terminated for Terms of Service violations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Subscription Renewals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Subscription renewals (monthly or annual) are generally non-refundable. However, we may consider refund
                requests for renewals on a case-by-case basis if:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>The refund request is made within 48 hours of the renewal charge</li>
                <li>You have not used the Services since the renewal date</li>
                <li>There were technical issues preventing you from canceling before renewal</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To avoid unwanted renewal charges, please cancel your subscription at least 24 hours before the next
                billing date. Cancellation instructions are available in your account settings or by contacting
                support@envsetup.dev.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Pro-Rated Refunds</h3>
              <p className="text-muted-foreground leading-relaxed">
                We do not offer pro-rated refunds for partial subscription periods. If you cancel your subscription
                before the end of the billing period, you will retain access to paid features until the end of that
                billing period, but no refund will be issued for the unused portion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Exceptional Circumstances</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may consider refund requests outside the standard policy under exceptional circumstances, including
                but not limited to:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Service Outages</h3>
              <p className="text-muted-foreground leading-relaxed">
                If our Services experience significant downtime or outages that prevent you from using core
                functionality for an extended period (more than 48 consecutive hours), you may be eligible for a partial
                refund or service credit proportional to the downtime experienced.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Billing Errors</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you were charged incorrectly due to a billing system error (e.g., duplicate charges, incorrect
                amount), we will issue a full refund for the erroneous charge immediately upon verification.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Unauthorized Charges</h3>
              <p className="text-muted-foreground leading-relaxed">
                If your account was accessed without authorization and charges were incurred, please contact us
                immediately at support@envsetup.dev. We will investigate the claim and issue a refund if we determine
                the charges were unauthorized. You may also need to report the incident to your financial institution.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Medical or Family Emergencies</h3>
              <p className="text-muted-foreground leading-relaxed">
                In cases of documented medical or family emergencies that prevent you from using or canceling the
                service, we will review refund requests on a compassionate, case-by-case basis. Supporting documentation
                may be required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Non-Refundable Items and Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                The following are non-refundable under all circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>
                  <strong>Add-on Services:</strong> One-time purchases of add-on features or services
                </li>
                <li>
                  <strong>Consumed Resources:</strong> Usage-based charges for API calls, storage, or bandwidth that
                  have already been consumed
                </li>
                <li>
                  <strong>Third-Party Services:</strong> Fees for third-party integrations or services accessed through
                  our platform
                </li>
                <li>
                  <strong>Custom Development:</strong> Custom development work or consultation services that have been
                  performed
                </li>
                <li>
                  <strong>Violation Terminations:</strong> Subscriptions terminated due to Terms of Service violations
                </li>
                <li>
                  <strong>Gift Subscriptions:</strong> Gift subscriptions purchased for others (recipient may request
                  refund under standard policy)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
              <p className="text-muted-foreground leading-relaxed">To request a refund, please follow these steps:</p>
              <ol className="list-decimal list-inside text-muted-foreground leading-relaxed mt-4 space-y-4 ml-4">
                <li>
                  <strong>Contact Support:</strong> Email our support team at support@envsetup.dev or
                  refunds@envsetup.dev with the subject line "Refund Request"
                </li>
                <li>
                  <strong>Provide Information:</strong> Include the following details in your request:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Your full name and email address associated with the account</li>
                    <li>Order or transaction ID</li>
                    <li>Date of purchase</li>
                    <li>Reason for refund request</li>
                    <li>Any supporting documentation (if applicable)</li>
                  </ul>
                </li>
                <li>
                  <strong>Review Process:</strong> Our support team will review your request within 3-5 business days
                  and respond with a decision
                </li>
                <li>
                  <strong>Refund Processing:</strong> If approved, refunds will be processed to the original payment
                  method within 7-10 business days
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Refund Processing Time</h2>
              <p className="text-muted-foreground leading-relaxed">Once a refund is approved:</p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>
                  <strong>Credit/Debit Cards:</strong> 5-10 business days for the refund to appear on your statement
                </li>
                <li>
                  <strong>PayPal:</strong> 3-5 business days for the refund to appear in your PayPal account
                </li>
                <li>
                  <strong>Bank Transfers:</strong> 7-14 business days depending on your financial institution
                </li>
                <li>
                  <strong>Other Payment Methods:</strong> Processing time varies by provider; we will inform you of the
                  expected timeframe
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that EnvSetup.dev processes refunds immediately upon approval, but the time it takes for the
                funds to appear in your account depends on your financial institution's processing times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Chargebacks and Disputes</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strongly encourage you to contact us directly to resolve any billing concerns before initiating a
                chargeback with your financial institution. Chargebacks can result in:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Immediate suspension or termination of your account and access to Services</li>
                <li>Loss of all data and Generated Content associated with your account</li>
                <li>Potential legal action to recover chargeback fees and damages</li>
                <li>Permanent ban from using EnvSetup.dev services</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you initiate a chargeback, we reserve the right to dispute it with evidence of service delivery and
                Terms acceptance. Fraudulent chargebacks may be reported to relevant authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Subscription Cancellation</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may cancel your subscription at any time through your account settings or by contacting
                support@envsetup.dev. Upon cancellation:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will not be charged for subsequent billing periods</li>
                <li>You will retain access to paid features until the end of the paid period</li>
                <li>After the paid period ends, your account will be downgraded to the free tier (if available)</li>
                <li>No refund will be issued for the remaining time in the current billing period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Downgrades and Plan Changes</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you downgrade to a lower-priced plan during your billing period:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>The downgrade will take effect at the start of the next billing period</li>
                <li>No refund or credit will be issued for the difference in plan price</li>
                <li>You will retain access to your current plan features until the end of the billing period</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">If you upgrade to a higher-priced plan:</p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>You will be charged a pro-rated amount for the remainder of the current billing period</li>
                <li>The new plan price will apply starting from the next full billing period</li>
                <li>Upgrade charges are non-refundable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Free Trials</h2>
              <p className="text-muted-foreground leading-relaxed">If we offer a free trial period:</p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-4 space-y-2 ml-4">
                <li>You will not be charged during the trial period</li>
                <li>You may cancel at any time during the trial without charge</li>
                <li>
                  If you do not cancel before the trial ends, you will be automatically charged for the subscription
                </li>
                <li>
                  The 14-day money-back guarantee begins from the first paid charge date, not the trial start date
                </li>
                <li>Only one free trial per user; additional trials may not be eligible for refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately
                upon posting to our website. Your continued use of our Services after changes are posted constitutes
                acceptance of the modified policy. Material changes that reduce your rights will only apply to purchases
                made after the change.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Questions and Support</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our Refund Policy or need assistance with a refund request, please
                contact us:
              </p>
              <div className="mt-4 p-6 bg-muted rounded-lg">
                <p className="font-semibold mb-2">EnvSetup.dev Support</p>
                <p className="text-muted-foreground">Email: support@envsetup.dev</p>
                <p className="text-muted-foreground">Refunds: refunds@envsetup.dev</p>
                <p className="text-muted-foreground">Billing: billing@envsetup.dev</p>
                <p className="text-muted-foreground mt-4">
                  Our support team is available Monday through Friday, 9:00 AM - 6:00 PM EST. We strive to respond to
                  all inquiries within 24-48 hours.
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
