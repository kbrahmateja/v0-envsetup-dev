export const ADMIN_CREDENTIALS = {
  username: "kbrahmateja",
  // Hash of 'Smruthi@786' using a simple hash for demo
  // In production, use bcrypt or similar
  passwordHash: "Smruthi@786", // We'll compare directly for simplicity
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.passwordHash
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
