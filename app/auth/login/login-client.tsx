"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackEventClient } from "@/lib/analytics-client"
interface LoginCopy {
  badge: string
  headline: string
  subhead: string
  badgeFooter: string
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  submitLoading: string
  submit: string
  signupPrompt: string
  signupCta: string
  genericError: string
}

interface LoginClientProps {
  copy: LoginCopy
}

export function LoginClient({ copy }: LoginClientProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      await trackEventClient("login", { email })

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : copy.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "bg-slate-900/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all duration-300 backdrop-blur-sm h-12"
  const labelClass = "text-slate-300 font-medium ml-1"

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 selection:bg-amber-500/30">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full opacity-60 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full opacity-40 mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
            <span className="relative flex h-6 w-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex h-6 w-6 rounded-full bg-blue-600"></span>
            </span>
            <span className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">SotA</span>
          </Link>
        </div>

        <Card className="border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold text-white">{copy.cardTitle}</CardTitle>
            <CardDescription className="text-slate-400">{copy.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelClass}>{copy.emailLabel}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={labelClass}>{copy.passwordLabel}</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? copy.submitLoading : copy.submit}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              {copy.signupPrompt}{" "}
              <Link href="/auth/signup" className="font-medium text-blue-400 hover:text-amber-400 underline decoration-blue-500/30 underline-offset-4 transition-colors">
                {copy.signupCta}
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
