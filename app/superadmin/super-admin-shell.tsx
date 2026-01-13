"use client"

import type { ReactNode } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Building2, Inbox, LayoutDashboard, PanelLeft, Users } from "lucide-react"

import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/superadmin", icon: LayoutDashboard },
  { label: "Leads", href: "/superadmin/leads", icon: Inbox },
  { label: "Users", href: "/superadmin/users", icon: Users },
  { label: "Organizations", href: "/superadmin/organizations", icon: Building2 },
]

export function SuperAdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "flex flex-col border-r border-slate-200 bg-white transition-all",
            isCollapsed ? "w-20" : "w-80"
          )}
        >
          <div className="border-b border-slate-200 px-5 py-5">
            <div className={cn("flex items-center justify-between", isCollapsed && "flex-col gap-3")}>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <span className="text-lg font-bold">S</span>
                </div>
                {!isCollapsed && <span className="text-lg font-semibold text-slate-900">SotA</span>}
              </Link>
                <button
                  type="button"
                  className="border border-slate-200 p-2 text-slate-600 transition hover:border-amber-200 hover:text-amber-700"
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  aria-label="Toggle sidebar"
                >
                  <PanelLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                </button>
            </div>
            {!isCollapsed && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Super Admin</p>
                <p className="mt-2 text-xs text-slate-500">{email}</p>
              </div>
            )}
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2 px-3 text-sm">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/superadmin" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border border-transparent px-3 py-2 font-semibold text-slate-600 transition",
                    isActive
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 px-4 py-5">
            <Link
              href="/dashboard"
              className={cn(
                "inline-flex items-center gap-2 border border-amber-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 transition hover:bg-amber-50",
                isCollapsed && "justify-center px-2"
              )}
            >
              {!isCollapsed && "Back to dashboard"}
              {isCollapsed && "Back"}
            </Link>
          </div>
        </aside>

        <main className="flex-1 bg-white px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
