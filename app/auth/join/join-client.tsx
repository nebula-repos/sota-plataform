"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackEventClient } from "@/lib/analytics-client"
import { JoinClientProps } from "@/types/auth.interface"

function getInitials(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return "ORG"
  const parts = trimmed.split(/\s+/).slice(0, 2)
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "ORG"
}

export function JoinClient({ copy, organizationName }: JoinClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inviteEmail = searchParams.get("email") ?? ""
  const [email, setEmail] = useState(inviteEmail)
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resolvedOrg = organizationName || copy.orgPlaceholder
  const orgInitials = useMemo(() => getInitials(resolvedOrg), [resolvedOrg])

  useEffect(() => {
    if (inviteEmail) {
      setEmail(inviteEmail)
    }
  }, [inviteEmail])

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError(copy.passwordMismatch)
      setIsLoading(false)
      return
    }

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (signupError) throw signupError

      await trackEventClient("signup", { email, full_name: fullName })
      router.push("/auth/verify-email")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : copy.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "bg-slate-900/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all duration-300 backdrop-blur-sm h-12"
  const labelClass = "text-slate-300 font-medium ml-1"
  const isEmailLocked = Boolean(inviteEmail)

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 selection:bg-amber-500/30">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[10%] w-[900px] h-[700px] bg-blue-500/20 blur-[130px] rounded-full opacity-50 mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full opacity-40 mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
            <span className="relative flex h-6 w-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex h-6 w-6 rounded-full bg-blue-600"></span>
            </span>
            <span className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">SotA</span>
          </Link>
        </div>

        <Card className="border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl overflow-hidden rounded-3xl">
          <CardHeader className="space-y-1 text-center pb-8 pt-8">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300 font-semibold">{copy.badge}</p>
            <CardTitle className="text-2xl font-bold text-white">{copy.cardTitle}</CardTitle>
            <CardDescription className="text-slate-400">{copy.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-200 text-sm font-semibold">
                  {orgInitials}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{copy.orgLabel}</p>
                  <p className="text-sm font-semibold text-white">{resolvedOrg}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleJoin} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={labelClass}>{copy.fullNameLabel}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={copy.fullNamePlaceholder}
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className={labelClass}>{copy.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={copy.emailPlaceholder}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  disabled={isEmailLocked}
                />
                {isEmailLocked && (
                  <p className="text-xs text-slate-500">{copy.emailLockedHint}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={labelClass}>{copy.passwordLabel}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repeat-password" className={labelClass}>{copy.confirmPasswordLabel}</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="col-span-1 md:col-span-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="col-span-1 md:col-span-2 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-[1.02] mt-2"
                disabled={isLoading}
              >
                {isLoading ? copy.submitLoading : copy.submit}
              </Button>
            </form>
            <div className="text-center text-sm text-slate-400">
              {copy.loginPrompt}{" "}
              <Link href="/auth/login" className="font-medium text-blue-400 hover:text-amber-400 underline decoration-blue-500/30 underline-offset-4 transition-colors">
                {copy.loginCta}
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
          {copy.badgeFooter}
        </p>
      </div>
    </div>
  )
}
