"use client"

import { DragEvent, useEffect, useMemo, useState } from "react"
import { Calendar, Mail, Building2, Phone, Tag, MessageSquareText, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "./confirm-dialog"

type Lead = {
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

const columns = [
  { key: "to_contact", label: "Por contactar", tone: "bg-amber-50 border-amber-200", status: "received" },
  { key: "follow_up", label: "En seguimiento", tone: "bg-orange-50 border-orange-200", status: "in_progress" },
  { key: "qualified", label: "Calificados", tone: "bg-emerald-50 border-emerald-200", status: "qualified" },
  { key: "closed", label: "Cerrados", tone: "bg-slate-50 border-slate-200", status: "closed" },
  { key: "error", label: "Error", tone: "bg-rose-50 border-rose-200", status: "error" },
] as const

const statusMap: Record<string, typeof columns[number]["key"]> = {
  received: "to_contact",
  pending: "to_contact",
  triaged: "follow_up",
  in_progress: "follow_up",
  contacted: "follow_up",
  qualified: "qualified",
  won: "closed",
  closed: "closed",
  lost: "closed",
  error: "error",
}

const statusBadge: Record<typeof columns[number]["key"], string> = {
  to_contact: "Pendiente",
  follow_up: "Seguimiento",
  qualified: "Calificado",
  closed: "Cerrado",
  error: "Error",
}

const statusBadgeTone: Record<typeof columns[number]["key"], string> = {
  to_contact: "bg-amber-100 text-amber-700",
  follow_up: "bg-orange-100 text-orange-700",
  qualified: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-700",
  error: "bg-rose-100 text-rose-700",
}

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadItems, setLeadItems] = useState<Lead[]>(leads)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [confirmLead, setConfirmLead] = useState<Lead | null>(null)

  useEffect(() => {
    setLeadItems(leads)
  }, [leads])

  const grouped = useMemo(() => {
    return leadItems.reduce<Record<string, Lead[]>>((acc, lead) => {
      const key = statusMap[lead.status] ?? "to_contact"
      acc[key] = acc[key] ? [...acc[key], lead] : [lead]
      return acc
    }, {})
  }, [leadItems])

  const handleDrop = async (event: DragEvent<HTMLDivElement>, columnKey: typeof columns[number]["key"]) => {
    event.preventDefault()
    const droppedId = draggedId ?? event.dataTransfer.getData("text/plain")
    if (!droppedId) return
    const column = columns.find((item) => item.key === columnKey)
    if (!column) return

    const previous = [...leadItems]
    setLeadItems((prev) =>
      prev.map((lead) => (lead.id === droppedId ? { ...lead, status: column.status } : lead))
    )
    setDraggedId(null)
    setDropTarget(null)

    const response = await fetch(`/api/leads/${droppedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: column.status }),
    })

    if (!response.ok) {
      setLeadItems(previous)
      toast.error("No pudimos actualizar el estado del lead.")
    }
  }

  const handleDelete = async (lead: Lead) => {
    try {
      const response = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Delete failed")
      }
      setLeadItems((prev) => prev.filter((item) => item.id !== lead.id))
      if (selectedLead?.id === lead.id) {
        setSelectedLead(null)
      }
      toast.success("Lead eliminado.")
    } catch (error) {
      console.error(error)
      toast.error("No pudimos eliminar el lead.")
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Contactos</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Leads y submissions</h2>
          <p className="mt-2 text-sm text-slate-500">
            Revisa los mensajes enviados desde el formulario de contacto.
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Tablero de leads</h3>
                <p className="text-sm text-slate-500">Vista rapida por estado.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-5">
            {columns.map((column) => {
              const items = grouped[column.key] ?? []
              return (
                <div
                  key={column.key}
                  className={`border ${column.tone} flex flex-col ${dropTarget === column.key ? "ring-2 ring-amber-300" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDropTarget(column.key)
                  }}
                  onDragLeave={() => setDropTarget(null)}
                  onDrop={(event) => handleDrop(event, column.key)}
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{column.label}</p>
                    <span className="flex h-6 w-6 items-center justify-center border border-white bg-white text-xs font-semibold text-slate-600">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    {items.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        className="w-full min-w-0 overflow-hidden border border-slate-200 bg-white p-4 text-left transition hover:border-amber-200 hover:shadow-sm cursor-grab active:cursor-grabbing"
                        onClick={() => setSelectedLead(lead)}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move"
                          event.dataTransfer.setData("text/plain", lead.id)
                          setDraggedId(lead.id)
                        }}
                        onDragEnd={() => {
                          setDraggedId(null)
                          setDropTarget(null)
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                            <p className="text-xs text-slate-500 truncate">{lead.email}</p>
                          </div>
                          <span className={`px-2 py-1 text-[11px] font-semibold ${statusBadgeTone[column.key]}`}>
                            {statusBadge[column.key]}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span className="min-w-0 flex-1 truncate">{lead.company ?? "Sin empresa"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span className="min-w-0 flex-1 truncate">{lead.phone ?? "Sin telefono"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-slate-400" />
                            <span className="min-w-0 flex-1 truncate">{lead.industry ?? "Sin industria"}</span>
                          </div>
                        </div>
                        <div className="mt-3 border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Asunto</p>
                          <p className="mt-1 break-words line-clamp-2">{lead.help ?? "Sin asunto"}</p>
                        </div>
                      </button>
                    ))}
                    {items.length === 0 && (
                      <div className="border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-400">
                        Sin leads en este estado.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => (!open ? setSelectedLead(null) : null)}>
        {selectedLead && (
          <DialogContent className="max-w-2xl bg-white text-slate-900 rounded-none sm:rounded-none">
            <DialogHeader>
              <DialogTitle>Detalle del lead</DialogTitle>
              <DialogDescription>Informacion completa del contacto.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contacto</p>
                <p className="text-lg font-semibold text-slate-900">{selectedLead.name}</p>
                <p className="text-sm text-slate-600">{selectedLead.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estado</p>
                <span className="inline-flex w-fit px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 bg-amber-100">
                  {selectedLead.status}
                </span>
                <p className="text-xs text-slate-500">
                  Creado el {new Date(selectedLead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Organizacion</p>
                <p className="text-sm text-slate-700">{selectedLead.company ?? "Sin empresa"}</p>
                <p className="text-xs text-slate-500">{selectedLead.industry ?? "Sin industria"}</p>
              </div>
              <div className="space-y-3 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contacto directo</p>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate">{selectedLead.phone ?? "Sin telefono"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="min-w-0 flex-1 break-words">{selectedLead.email}</span>
                  </div>
                </div>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 hover:text-amber-800"
                >
                  Enviar correo
                </a>
              </div>
            </div>

            <div className="mt-4 border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Mensaje</p>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{selectedLead.message}</p>
            </div>

            <div className="mt-4 border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Asunto</p>
              <p className="mt-2 text-sm text-slate-700">{selectedLead.help ?? "Sin asunto"}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => setConfirmLead(selectedLead)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar lead
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmLead)}
        title="Eliminar lead"
        description="Esta accion elimina el lead de forma permanente. No se puede deshacer."
        confirmLabel="Eliminar"
        onOpenChange={(open) => (!open ? setConfirmLead(null) : null)}
        onConfirm={() => {
          if (confirmLead) {
            handleDelete(confirmLead)
          }
          setConfirmLead(null)
        }}
      />
    </>
  )
}
