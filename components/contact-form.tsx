"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type ContactFormCopy = {
  title: string
  description: string
  fields: Record<string, string>
  consent: string
  submit: string
  success: string
  error: string
}

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setFeedback("")

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to submit contact form")
      }

      setStatus("success")
      setFeedback(copy.success)
      event.currentTarget.reset()
    } catch (error) {
      console.error(error)
      setStatus("error")
      setFeedback(copy.error)
    }
  }

  const isSubmitting = status === "submitting"
  const inputClass = "bg-slate-900/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
  const labelClass = "text-slate-300 font-medium ml-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-bold text-white">{copy.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{copy.description}</p>
      </div>
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name" className={labelClass}>{copy.fields.name}</Label>
          <Input id="name" name="name" type="text" autoComplete="name" required disabled={isSubmitting} className={inputClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className={labelClass}>{copy.fields.email}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required disabled={isSubmitting} className={inputClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company" className={labelClass}>{copy.fields.company}</Label>
          <Input id="company" name="company" type="text" autoComplete="organization" disabled={isSubmitting} className={inputClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role" className={labelClass}>{copy.fields.role}</Label>
          <Input id="role" name="role" type="text" autoComplete="organization-title" disabled={isSubmitting} className={inputClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="topic" className={labelClass}>{copy.fields.topic}</Label>
          <Input id="topic" name="topic" type="text" disabled={isSubmitting} className={inputClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message" className={labelClass}>{copy.fields.message}</Label>
          <Textarea id="message" name="message" required disabled={isSubmitting} className={`${inputClass} min-h-[120px] resize-y`} />
        </div>
      </div>
      <p className="text-xs text-slate-500 px-1">{copy.consent}</p>
      <div className="space-y-4 pt-2">
        <Button
          type="submit"
          className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] transition-all duration-300 border border-transparent hover:border-amber-500/30"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : copy.submit}
        </Button>
        {feedback && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${status === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
            {feedback}
          </div>
        )}
      </div>
    </form>
  )
}
