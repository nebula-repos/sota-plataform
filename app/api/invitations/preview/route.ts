import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const organizationId = searchParams.get("org")

    if (!email || !organizationId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { data: invitation, error: invitationError } = await supabase
      .from("user_invitations")
      .select("id")
      .eq("email", email)
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .maybeSingle()

    if (invitationError || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle()

    if (orgError || !organization?.name) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json({ name: organization.name })
  } catch (error) {
    console.error("[invite-preview] failed", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
