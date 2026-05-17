export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set")
    return false
  }

  return username === adminUsername && password === adminPassword
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
