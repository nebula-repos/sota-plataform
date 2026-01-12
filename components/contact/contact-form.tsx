"use client"

import { useEffect, useRef, useState } from "react"
import { Briefcase, Building2, Check, Mail, MessageCircle, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { ContactFormCopy } from "@/types/form.interface"

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setFeedback("")

    const form = event.currentTarget
    const formData = new FormData(form)
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
      form.reset()
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle")
        setFeedback("")
      }, 5000)
    } catch (error) {
      console.error(error)
      setStatus("error")
      setFeedback(copy.error)
    }
  }

  const isSubmitting = status === "submitting"
  const isSuccess = status === "success"
  const inputClass = "h-12 rounded-none border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900/10 focus-visible:border-slate-300 shadow-none"
  const textareaClass = "rounded-none border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900/10 focus-visible:border-slate-300 shadow-none min-h-[140px] resize-y"
  const labelClass = "text-slate-700 text-sm font-semibold"
  const iconClass = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
  const buttonLabel = isSubmitting ? `${copy.submit}...` : copy.submit

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {isSuccess ? (
        <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 bg-blue-950/5 px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-blue-900 text-blue-50">
            <Check className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-2xl font-semibold text-slate-900 md:text-3xl">{copy.success}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 text-center">
            {copy.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {copy.eyebrow}
              </p>
            )}
            <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{copy.description}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className={labelClass}>{copy.fields.name}</Label>
              <div className="relative">
                <User className={iconClass} aria-hidden />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={copy.placeholders.name}
                  required
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company" className={labelClass}>{copy.fields.company}</Label>
              <div className="relative">
                <Building2 className={iconClass} aria-hidden />
                <Input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder={copy.placeholders.company}
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className={labelClass}>{copy.fields.email}</Label>
              <div className="relative">
                <Mail className={iconClass} aria-hidden />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={copy.placeholders.email}
                  required
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className={labelClass}>{copy.fields.phone}</Label>
              <div className="relative">
                <Phone className={iconClass} aria-hidden />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={copy.placeholders.phone}
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry" className={labelClass}>{copy.fields.industry}</Label>
              <div className="relative">
                <Briefcase className={iconClass} aria-hidden />
                <Input
                  id="industry"
                  name="industry"
                  type="text"
                  placeholder={copy.placeholders.industry}
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="help" className={labelClass}>{copy.fields.help}</Label>
              <div className="relative">
                <MessageCircle className={iconClass} aria-hidden />
                <Input
                  id="help"
                  name="help"
                  type="text"
                  placeholder={copy.placeholders.help}
                  disabled={isSubmitting}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="message" className={labelClass}>{copy.fields.message}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={copy.placeholders.message}
                required
                disabled={isSubmitting}
                className={textareaClass}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">{copy.consent}</p>
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full rounded-none bg-black text-white font-semibold py-6 shadow-[0_20px_35px_-25px_rgba(15,23,42,0.6)] transition-all duration-300 hover:bg-slate-900"
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2">
                {buttonLabel}
                <svg aria-hidden className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.4 3.4a1 1 0 0 1 1.04-.2l11.8 4.3a1 1 0 0 1 0 1.86l-11.8 4.3A1 1 0 0 1 3 12.75V10l7-1-7-1V3.4Z" />
                </svg>
              </span>
            </Button>
            {status === "error" && feedback && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {feedback}
              </div>
            )}
          </div>
        </>
      )}
    </form>
  )
}
