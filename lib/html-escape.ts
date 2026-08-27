// Escapes a string for safe interpolation into HTML built via raw template
// literals (email bodies, mainly) - anywhere that isn't JSX, which already
// escapes automatically. Several email-sending routes (subscribe,
// suggestions) build htmlContent by interpolating attacker-controlled input
// (email address, free-text message, page URL) directly into a template
// literal with no escaping at all, or with only a partial `<` -> `&lt;`
// replacement. That lets a crafted value like `"><img src=x onerror=...>`
// inject arbitrary markup into an email the site admin opens - most mail
// clients strip live <script>, but injected links/images/layout still get
// through, which is enough for phishing the admin or breaking the email.
//
// Order matters: `&` must be escaped first, or escaping `<` to `&lt;` and
// then escaping `&` again would double-encode it into `&amp;lt;`.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
