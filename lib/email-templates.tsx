export type EmailTemplate = {
  id: string
  name: string
  description: string
  preview: string
  category: "announcement" | "update" | "promotional" | "minimal"
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "modern-announcement",
    name: "Modern Announcement",
    description: "Clean and modern design for important announcements",
    preview: "📢 Perfect for product launches and major updates",
    category: "announcement",
  },
  {
    id: "simple-update",
    name: "Simple Update",
    description: "Minimalist template for regular updates",
    preview: "📝 Great for weekly newsletters and status updates",
    category: "update",
  },
  {
    id: "promotional",
    name: "Promotional",
    description: "Eye-catching design for special offers",
    preview: "✨ Ideal for promotions and special events",
    category: "promotional",
  },
  {
    id: "minimal-text",
    name: "Minimal Text",
    description: "Text-focused template with no distractions",
    preview: "📄 Simple and elegant for text-heavy content",
    category: "minimal",
  },
]

export function generateEmailHTML(template: string, subject: string, content: string, preheader?: string): string {
  const currentYear = new Date().getFullYear()
  const baseStyles = `
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; }
    .content { padding: 40px 30px; }
    .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #666; background: #f8f9fa; }
    a { color: #0066cc; text-decoration: none; }
  `

  const templates: Record<string, string> = {
    "modern-announcement": `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>${baseStyles}
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 20px; }
          .content { line-height: 1.6; color: #333; }
          .cta-button { display: inline-block; background: #667eea; color: white !important; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="badge">📢 ANNOUNCEMENT</div>
            <h1>${subject}</h1>
          </div>
          <div class="content">
            ${content
              .split("\n")
              .map((p) => (p.trim() ? `<p>${p}</p>` : ""))
              .join("")}
          </div>
          <div class="footer">
            <p><strong>envsetup.dev</strong> - Simplify Your Development Environment</p>
            <p>© ${currentYear} envsetup.dev. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,

    "simple-update": `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>${baseStyles}
          .header { padding: 30px; border-bottom: 2px solid #e5e7eb; }
          .header h1 { margin: 0; font-size: 24px; color: #1f2937; }
          .content { line-height: 1.8; color: #4b5563; }
          .content h2 { color: #1f2937; font-size: 20px; margin-top: 30px; }
          .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📝 ${subject}</h1>
          </div>
          <div class="content">
            ${content
              .split("\n")
              .map((p) => (p.trim() ? `<p>${p}</p>` : ""))
              .join("")}
            <div class="divider"></div>
            <p style="color: #6b7280; font-size: 14px;">Stay tuned for more updates from envsetup.dev</p>
          </div>
          <div class="footer">
            <p><strong>envsetup.dev</strong></p>
            <p>© ${currentYear} envsetup.dev. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,

    promotional: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>${baseStyles}
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 60px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 36px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
          .promo-badge { background: #fbbf24; color: #78350f; padding: 10px 20px; border-radius: 25px; font-weight: 700; display: inline-block; margin-bottom: 20px; }
          .content { line-height: 1.6; color: #333; text-align: center; }
          .big-cta { display: inline-block; background: #f5576c; color: white !important; padding: 18px 48px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; margin: 30px 0; box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4); }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="promo-badge">✨ SPECIAL OFFER</div>
            <h1>${subject}</h1>
          </div>
          <div class="content">
            ${content
              .split("\n")
              .map((p) => (p.trim() ? `<p style="font-size: 16px;">${p}</p>` : ""))
              .join("")}
            <a href="https://envsetup.dev" class="big-cta">Get Started Now →</a>
          </div>
          <div class="footer">
            <p><strong>envsetup.dev</strong></p>
            <p>© ${currentYear} envsetup.dev. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,

    "minimal-text": `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background: #ffffff; }
          .email-container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
          .content { line-height: 1.8; color: #1a1a1a; font-size: 16px; }
          .content p { margin: 0 0 20px 0; }
          .header { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 400; color: #1a1a1a; }
          .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            ${content
              .split("\n")
              .map((p) => (p.trim() ? `<p>${p}</p>` : ""))
              .join("")}
          </div>
          <div class="signature">
            <p>Best regards,<br><strong>The envsetup.dev Team</strong></p>
            <p style="font-size: 12px; color: #999;">
              © ${currentYear} envsetup.dev | <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return templates[template] || templates["simple-update"]
}
