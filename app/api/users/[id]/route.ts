import { NextResponse } from "next/server"

import { getAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

type RouteContext = {
  params: {
    id: string
  }
}

const allowedRoles = ["user", "admin", "super_admin"] as const

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = context.params
    const { role } = await request.json()

    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const supabaseServer = await createClient()
    const {
      data: { user },
    } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabaseServer.from("users").select("role").eq("id", user.id).maybeSingle()

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const supabaseAdmin = getAdminClient()
    const { error } = await supabaseAdmin.from("users").update({ role }).eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Unable to update user" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[users] update failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
