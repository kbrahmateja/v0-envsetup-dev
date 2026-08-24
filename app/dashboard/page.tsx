import { redirect } from "next/navigation"

// This page used to render a fully public, unauthenticated "Analytics
// Dashboard" filled with mock/random data (see git history). It's been
// replaced by a real, admin-gated version at /admin/analytics — this route
// just forwards any old links/bookmarks there (middleware.ts enforces the
// admin login for that path).
export default function DashboardRedirectPage() {
  redirect("/admin/analytics")
}
