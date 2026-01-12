import { NextResponse } from "next/server"

import { getAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

type RouteContext = {
  params: {
    id: string
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = context.params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
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
    const { error } = await supabaseAdmin.from("contact_leads").update({ status }).eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Unable to update lead" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[leads] update failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = context.params
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
    const { error } = await supabaseAdmin.from("contact_leads").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Unable to delete lead" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[leads] delete failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
