import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function VerifyEmailPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "auth.verify")

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 selection:bg-amber-500/30">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-900/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl overflow-hidden">
          <CardHeader className="items-center text-center pb-6 pt-10">
            <div className="inline-flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 p-3 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)] mb-6">
              <Sparkles className="h-6 w-6 text-blue-400" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-bold text-white">{copy.title}</CardTitle>
            <CardDescription className="text-slate-400 max-w-[80%] mx-auto leading-relaxed">{copy.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 px-8 text-center">
            <p className="text-sm text-slate-300 bg-slate-900/40 rounded-lg p-4 border border-white/5">{copy.body}</p>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">{copy.note}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
