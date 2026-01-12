"use client"

import { useEffect, useState } from "react"
import { Pencil } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type AdminUserRow = {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  organizations?: { name: string } | { name: string }[] | null
}

const roleOptions = ["user", "admin", "super_admin"] as const

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  const [items, setItems] = useState<AdminUserRow[]>(users)
  const [selected, setSelected] = useState<AdminUserRow | null>(null)
  const [role, setRole] = useState<string>("user")

  useEffect(() => {
    setItems(users)
  }, [users])

  const openEdit = (user: AdminUserRow) => {
    setSelected(user)
    setRole(user.role)
  }

  const handleSave = async () => {
    if (!selected) return
    const response = await fetch(`/api/users/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })

    if (!response.ok) {
      toast.error("No pudimos actualizar el rol.")
      return
    }

    setItems((prev) => prev.map((user) => (user.id === selected.id ? { ...user, role } : user)))
    toast.success("Rol actualizado.")
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Directory</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Users</h2>
        <p className="mt-2 text-sm text-slate-500">Most recent 100 users across all organizations.</p>
      </header>

      <div className="overflow-hidden border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((user) => {
              const organization = Array.isArray(user.organizations)
                ? user.organizations[0]?.name
                : user.organizations?.name

              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.full_name || "Unnamed"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.role}</td>
                  <td className="px-4 py-3 text-slate-600">{organization ?? "Unknown"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={() => openEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="border-t border-slate-200 px-4 py-6 text-sm text-slate-500">No users found.</div>
        )}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
        {selected && (
          <DialogContent className="max-w-lg bg-white text-slate-900 rounded-none sm:rounded-none">
            <DialogHeader>
              <DialogTitle>Editar usuario</DialogTitle>
              <DialogDescription>Actualiza el rol del usuario seleccionado.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Nombre</p>
                <p className="mt-1 text-sm text-slate-700">{selected.full_name || "Unnamed"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                <p className="mt-1 text-sm text-slate-700">{selected.email}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400" htmlFor="user-role">
                  Rol
                </label>
                <select
                  id="user-role"
                  className="mt-2 h-10 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-200 rounded-none"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" className="rounded-none" onClick={() => setSelected(null)}>
                Cancelar
              </Button>
              <Button className="rounded-none bg-amber-600 hover:bg-amber-700" onClick={handleSave}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
