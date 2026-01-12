import { getAdminClient } from "@/lib/supabase/admin"
import { UsersTable } from "./users-table"

type AdminUserRow = {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  organizations?: { name: string } | { name: string }[] | null
}

async function fetchUsers() {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from("users")
    .select("id, email, full_name, role, created_at, organizations(name)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (data as AdminUserRow[]) ?? []
}

export default async function SuperAdminUsers() {
  const users = await fetchUsers()

  return <UsersTable users={users} />
}
