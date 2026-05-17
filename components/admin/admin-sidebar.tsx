"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Mail, BarChart3, Settings, FileText } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Subscribers", href: "/admin/subscribers", icon: Users },
  { name: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { name: "Visitors", href: "/admin/visitors", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <FileText className="h-8 w-8" />
          <span className="text-xl font-bold">EnvSetup Admin</span>
        </Link>
      </div>

      <nav className="space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
