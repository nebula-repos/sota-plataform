import { getAdminClient } from "@/lib/supabase/admin"

type OrgRow = {
  id: string
  name: string
  plan_id: string
  created_at: string
  pricing_plans?: { name: string } | null
}

async function fetchOrganizations() {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from("organizations")
    .select("id, name, plan_id, created_at, pricing_plans(name)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (data as OrgRow[]) ?? []
}

export default async function SuperAdminOrganizations() {
  const organizations = await fetchOrganizations()

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Accounts</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Organizations</h2>
        <p className="mt-2 text-sm text-slate-500">Most recent 100 organizations.</p>
      </header>

      <div className="overflow-hidden border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Plan ID</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{org.name}</td>
                <td className="px-4 py-3 text-slate-600">{org.pricing_plans?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{org.plan_id}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {organizations.length === 0 && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-slate-500">
            No organizations found.
          </div>
        )}
      </div>
    </div>
  )
}
