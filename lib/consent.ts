// Lightweight, dependency-free cookie/tracking consent store.
// Persisted in localStorage; a custom window event lets already-mounted
// components (analytics script loader, visitor tracker, GA page tracker)
// react immediately when the visitor makes a choice, without a reload.

export type ConsentValue = "accepted" | "declined"
export type ConsentState = ConsentValue | null

const STORAGE_KEY = "envsetup_cookie_consent"
const EVENT_NAME = "envsetup-consent-changed"

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === "accepted" || value === "declined" ? value : null
  } catch {
    // localStorage can throw in some privacy modes - fail closed (no tracking).
    return null
  }
}

export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore storage failures - the in-memory event still fires below
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(EVENT_NAME, { detail: value }))
}

export function onConsentChange(callback: (value: ConsentValue) => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = (e: Event) => callback((e as CustomEvent<ConsentValue>).detail)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}
