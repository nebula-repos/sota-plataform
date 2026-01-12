import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { Toaster } from "sonner"

import { createClient } from "@/lib/supabase/server"
import { SuperAdminShell } from "./super-admin-shell"

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role, email").eq("id", user.id).maybeSingle()

  if (!profile || profile.role !== "super_admin") {
    redirect("/dashboard")
  }

  return (
    <>
      <SuperAdminShell email={profile.email}>{children}</SuperAdminShell>
      <Toaster position="top-center" richColors />
    </>
  )
}
