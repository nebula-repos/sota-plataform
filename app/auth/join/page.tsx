import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getAdminClient } from "@/lib/supabase/admin"
import { JoinClient } from "./join-client"

type JoinPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

function getParam(params: JoinPageProps["searchParams"], key: string) {
  const value = params?.[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

async function resolveOrganizationName(email?: string, organizationId?: string) {
  if (!email || !organizationId) {
    return null
  }

  try {
    const supabase = getAdminClient()
    const { data: invitation } = await supabase
      .from("user_invitations")
      .select("id")
      .eq("email", email)
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .maybeSingle()

    if (!invitation) {
      return null
    }

    const { data: organization } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle()

    return organization?.name ?? null
  } catch (error) {
    console.error("[join] failed to resolve organization name", error)
    return null
  }
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "auth.join")
  const email = getParam(searchParams, "email")
  const organizationId = getParam(searchParams, "org")
  const organizationName = await resolveOrganizationName(email, organizationId)

  return <JoinClient copy={copy} organizationName={organizationName ?? undefined} />
}
