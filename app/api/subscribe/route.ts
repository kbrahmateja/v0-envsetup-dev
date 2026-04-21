import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    let isNewSubscriber = false

    try {
      const existingSubscriber = await sql`
        SELECT email FROM subscribers WHERE email = ${email}
      `

      if (existingSubscriber.length === 0) {
        await sql`
          INSERT INTO subscribers (email, subscribed_at, status)
          VALUES (${email}, NOW(), 'active')
        `
        isNewSubscriber = true
      }
    } catch (dbError: any) {
      console.error("Database error details:", {
        message: dbError?.message,
        cause: dbError?.cause,
        stack: dbError?.stack,
      })
      return NextResponse.json({ error: "Failed to store subscription" }, { status: 500 })
    }

    const timestamp = new Date().toISOString()
    const brevoApiKey = process.env.BREVO_API_KEY

    if (brevoApiKey) {
      try {
        // Send admin notification only for new subscribers
        if (isNewSubscriber) {
          const adminResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              accept: "application/json",
              "api-key": brevoApiKey,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sender: {
                name: "EnvSetup Team",
                email: "info@envsetup.dev",
              },
              to: [
                {
                  email: "kbrahmateja@gmail.com",
                  name: "Admin",
                },
              ],
              subject: "🎉 New Subscription - EnvSetup.dev",
              htmlContent: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">EnvSetup.dev</h1>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">New Subscriber Alert</p>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px;">🎉 New Subscription!</h2>
                    <p style="margin: 0; opacity: 0.9;">Someone wants to be part of the revolution</p>
                  </div>

                  <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin: 25px 0;">
                    <p style="margin: 0 0 15px 0; color: #374151; font-weight: 600;">Subscriber Details:</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0;"><strong style="color: #6b7280;">Email:</strong> <span style="color: #1f2937;">${email}</span></p>
                      <p style="margin: 0;"><strong style="color: #6b7280;">Timestamp:</strong> <span style="color: #1f2937;">${timestamp}</span></p>
                    </div>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">This notification was sent from envsetup.dev</p>
                  </div>
                </div>
              `,
            }),
          })

          if (adminResponse.ok) {
            const adminData = await adminResponse.json()
            console.log("Admin notification sent successfully:", adminData.messageId)
          } else {
            const adminError = await adminResponse.text()
            console.error("Admin notification failed:", adminResponse.status, adminError)
          }
        }

        console.log("Sending confirmation email to subscriber:", email)

        const emailSubject = isNewSubscriber
          ? "Welcome to EnvSetup.dev - Get Ready for the Revolution! 🚀"
          : "Thank You for Your Patience - EnvSetup.dev is Almost Here! 🎯"

        const emailContent = isNewSubscriber
          ? `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; margin: 0;">EnvSetup.dev</h1>
                  <p style="color: #6b7280; font-size: 16px; margin: 10px 0;">The Future of Environment Setup</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 30px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 28px;">Welcome Aboard! 🎉</h2>
                  <p style="margin: 0; font-size: 16px; opacity: 0.95; line-height: 1.6;">
                    Thank you for joining the revolution in development environment setup. You're now part of an exclusive community that will shape the future of DevOps automation.
                  </p>
                </div>

                <div style="margin: 30px 0;">
                  <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">What You'll Receive:</h3>
                  
                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">📅 Monthly Updates</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Stay informed with our monthly newsletter featuring development progress, sneak peeks, and exclusive insights into our AI-powered platform.</span>
                    </p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">🚀 Launch Notifications</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Be the first to know when we go live, with priority access to early bird features and special launch offers.</span>
                    </p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #ec4899;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">🎁 Exclusive Benefits</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Early subscribers get lifetime access to premium features, beta testing opportunities, and special pricing plans.</span>
                    </p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">💡 Feature Updates</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Get detailed information about new features, improvements, and integrations as we build the most powerful environment setup platform.</span>
                    </p>
                  </div>
                </div>

                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 25px; border-radius: 12px; margin: 30px 0;">
                  <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0;">🤖 What is EnvSetup.dev?</h3>
                  <p style="color: #1e3a8a; font-size: 14px; line-height: 1.6; margin: 0;">
                    EnvSetup.dev is revolutionizing how developers configure and deploy environments. Our AI-powered assistant helps you find the perfect software stack, automatically generates production-ready configurations, and deploys to any cloud or server with one click. Say goodbye to configuration hell!
                  </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">Stay tuned for exciting updates!</p>
                  <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                    <p style="color: white; margin: 0; font-size: 14px; font-weight: 600;">🎯 Launching Soon</p>
                  </div>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                    Follow us for updates and behind-the-scenes content
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2025 EnvSetup.dev - All rights reserved
                  </p>
                  <p style="color: #d1d5db; font-size: 11px; margin: 10px 0 0 0;">
                    If you don't see this email in your inbox, please check your spam/junk folder.
                  </p>
                </div>
              </div>
            `
          : `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; margin: 0;">EnvSetup.dev</h1>
                  <p style="color: #6b7280; font-size: 16px; margin: 10px 0;">Thank You for Your Patience</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 30px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 28px;">We Haven't Forgotten You! 🙏</h2>
                  <p style="margin: 0; font-size: 16px; opacity: 0.95; line-height: 1.6;">
                    Thank you for checking in and for your incredible patience. We're working tirelessly to bring you something truly revolutionary, and we appreciate your continued interest in EnvSetup.dev!
                  </p>
                </div>

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 25px; border-radius: 8px; margin: 30px 0;">
                  <h3 style="color: #92400e; font-size: 18px; margin: 0 0 15px 0;">🔨 We're Almost Ready!</h3>
                  <p style="color: #78350f; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                    Our team is in the final stages of development, fine-tuning every detail to ensure EnvSetup.dev exceeds your expectations. We're not just building another tool—we're creating a platform that will transform how you work with development environments.
                  </p>
                  <p style="color: #78350f; font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong>Your patience means everything to us.</strong> As one of our early supporters, you'll be among the first to experience the power of AI-driven environment configuration and automated deployment.
                  </p>
                </div>

                <div style="margin: 30px 0;">
                  <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">What's Coming Soon:</h3>
                  
                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">🤖 AI-Powered Assistant</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Our intelligent chatbot will help you find the perfect software stack and versions for your specific needs in seconds.</span>
                    </p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">⚡ One-Click Deployment</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Deploy complete environments to any cloud provider or dedicated server automatically—no manual configuration required.</span>
                    </p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151;">
                      <strong style="color: #1f2937;">📦 Smart Configuration</strong><br/>
                      <span style="font-size: 14px; color: #6b7280;">Generate production-ready Docker Compose files, Kubernetes configs, and deployment scripts tailored to your project.</span>
                    </p>
                  </div>
                </div>

                <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                  <h3 style="color: #1e40af; font-size: 20px; margin: 0 0 15px 0;">📅 Expected Launch</h3>
                  <p style="color: #1e3a8a; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; font-weight: 600;">
                    We're targeting a release in the coming weeks!
                  </p>
                  <p style="color: #1e3a8a; font-size: 14px; line-height: 1.6; margin: 0;">
                    You'll receive an exclusive early access notification the moment we go live, along with special launch pricing available only to our patient early subscribers.
                  </p>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 30px 0;">
                  <h3 style="color: #065f46; font-size: 18px; margin: 0 0 15px 0;">🎁 Special Thank You</h3>
                  <p style="color: #047857; font-size: 14px; line-height: 1.6; margin: 0;">
                    As a token of our appreciation for your patience, you'll receive:<br/><br/>
                    ✨ <strong>Lifetime Pro Access</strong> to premium features<br/>
                    ✨ <strong>Priority Support</strong> when we launch<br/>
                    ✨ <strong>Exclusive Beta Access</strong> to new features<br/>
                    ✨ <strong>Special Launch Pricing</strong> locked in forever
                  </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">We can't wait to share what we've built!</p>
                  <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                    <p style="color: white; margin: 0; font-size: 14px; font-weight: 600;">🚀 Coming Very Soon</p>
                  </div>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                    Thank you for believing in us and for your incredible patience
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2025 EnvSetup.dev - All rights reserved
                  </p>
                  <p style="color: #d1d5db; font-size: 11px; margin: 10px 0 0 0;">
                    If you don't see this email in your inbox, please check your spam/junk folder.
                  </p>
                </div>
              </div>
            `

        const confirmResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "EnvSetup Team",
              email: "info@envsetup.dev",
            },
            to: [
              {
                email: email,
              },
            ],
            subject: emailSubject,
            htmlContent: emailContent,
          }),
        })

        if (confirmResponse.ok) {
          const confirmData = await confirmResponse.json()
          console.log("Confirmation email sent successfully to", email, "- Message ID:", confirmData.messageId)
        } else {
          const confirmError = await confirmResponse.text()
          console.error("Confirmation email failed:", confirmResponse.status, confirmError)
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: isNewSubscriber
        ? "Thank you for subscribing! Check your inbox for a confirmation email."
        : "Thank you for your patience! Check your inbox for an update from our team.",
    })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Failed to process subscription" }, { status: 500 })
  }
}
