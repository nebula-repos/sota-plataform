import { getAdminClient } from "@/lib/supabase/admin"

async function fetchCounts() {
  const supabase = getAdminClient()

  const [{ count: userCount }, { count: orgCount }, { count: leadCount }] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("contact_leads").select("id", { count: "exact", head: true }),
  ])

  return {
    users: userCount ?? 0,
    organizations: orgCount ?? 0,
    leads: leadCount ?? 0,
  }
}

export default async function SuperAdminOverview() {
  const counts = await fetchCounts()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Dashboard</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 text-sm text-slate-500">
          High-level visibility across users, organizations, and inbound leads.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total users", value: counts.users },
          { label: "Organizations", value: counts.organizations },
          { label: "Leads received", value: counts.leads },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-slate-200 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-amber-600">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-amber-200 bg-amber-50 p-6">
        <h3 className="text-lg font-semibold text-amber-900">Next actions</h3>
        <p className="mt-2 text-sm text-slate-500">
          Use the tabs above to review recent leads, manage organizations, or update user roles.
        </p>
      </div>
    </div>
  )
}
