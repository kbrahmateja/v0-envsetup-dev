const encoder = new TextEncoder()
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function timingSafeEqual(a: string, b: string): boolean {
  // Compare full length regardless of match position to avoid leaking length via timing.
  const maxLen = Math.max(a.length, b.length)
  let result = a.length === b.length ? 0 : 1
  for (let i = 0; i < maxLen; i++) {
    const charA = a.charCodeAt(i) || 0
    const charB = b.charCodeAt(i) || 0
    result |= charA ^ charB
  }
  return result === 0
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ])
}

function getSessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
}

export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set")
    return false
  }

  const usernameOk = timingSafeEqual(username, adminUsername)
  const passwordOk = timingSafeEqual(password, adminPassword)
  return usernameOk && passwordOk
}

/**
 * Creates a signed, expiring session token: `${username}.${expiresAt}.${hmacSignatureHex}`.
 * Signed with HMAC-SHA256 so the middleware can verify it wasn't forged, instead of
 * just checking that a cookie with this name exists.
 */
export async function createSessionToken(username: string): Promise<string> {
  const secret = getSessionSecret()
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) environment variable is not set")
  }

  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = `${username}.${expiresAt}`
  const key = await getSigningKey(secret)
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))

  return `${payload}.${toHex(signature)}`
}

/**
 * Verifies a session token's signature and expiry. Runs in both the Node.js API routes
 * and the Edge middleware, so it only relies on the Web Crypto API (available in both).
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false

  const secret = getSessionSecret()
  if (!secret) return false

  const parts = token.split(".")
  if (parts.length !== 3) return false

  const [username, expiresAtStr, signatureHex] = parts
  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  const payload = `${username}.${expiresAtStr}`
  const key = await getSigningKey(secret)
  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  const expectedHex = toHex(expectedSignature)

  return timingSafeEqual(signatureHex, expectedHex)
}
