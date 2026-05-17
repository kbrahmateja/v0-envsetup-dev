import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value
  const isAuthenticated = !!sessionToken

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
