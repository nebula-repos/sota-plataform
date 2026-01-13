import { getAdminClient } from "@/lib/supabase/admin"
import { LeadsBoard } from "./leads-board"

type LeadRow = {
  id: string
  name: string
  email: string
  company: string | null
  status: string
  created_at: string
  phone: string | null
  industry: string | null
  help: string | null
  message: string
}

async function fetchLeads() {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from("contact_leads")
    .select("id, name, email, company, status, created_at, phone, industry, help, message")
    .order("created_at", { ascending: false })
    .limit(300)

  return (data as LeadRow[]) ?? []
}

export default async function SuperAdminLeads() {
  const leads = await fetchLeads()
  return <LeadsBoard leads={leads} />
}
