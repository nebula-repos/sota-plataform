import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { BarChart3, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

type EventCount = {
  event_type: string
  count: number
}

export default async function AdminMetricsPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.metrics")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)

  if (userProfile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get event type counts
  const { data: eventCounts } = await supabase.rpc<EventCount>("get_event_counts").limit(10)

  // Get user growth
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: freeUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "free")

  const { count: memberUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "member")

  const eventTypeCount = eventCounts?.length ?? 0

  const stats = [
    { label: copy.stats.totalUsers, value: totalUsers || 0 },
    { label: copy.stats.freeUsers, value: freeUsers || 0 },
    { label: copy.stats.members, value: memberUsers || 0 },
    { label: copy.stats.eventTypes, value: eventTypeCount },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 selection:bg-amber-500/30">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5 py-28">
          {/* Background Glows */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-500/20 blur-[120px] rounded-full opacity-60 mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full opacity-40 mix-blend-screen" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>{copy.hero.eyebrow}</span>
                </div>
                <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl">{copy.hero.subtitle}</p>
                <div className="mt-10">
                  <Link href="/admin">
                    <Button
                      size="lg"
                      variant="outline"
                      className="group gap-2 rounded-full border-slate-700 bg-transparent text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                    >
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                      {copy.hero.back}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <MouseGlowCard
                    key={stat.label}
                    className="h-full border border-white/10 bg-slate-900/40 backdrop-blur-xl"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.45em] text-slate-500">{stat.label}</p>
                    <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
                  </MouseGlowCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/5 bg-slate-950/50 py-24">
          {/* Section Background Glow */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-30" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid gap-8 md:grid-cols-2">
              {/* User Statistics */}
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 opacity-60 transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-4 pt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{copy.hero.eyebrow}</p>
                  <CardTitle className="text-2xl text-white">{copy.distribution.title}</CardTitle>
                  <CardDescription className="text-pretty text-slate-400">{copy.distribution.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-5">
                  <div className="rounded-2xl border border-white/5 bg-slate-800/20 p-4 text-sm shadow-inner shadow-white/5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{copy.distribution.total}</span>
                      <span className="text-2xl font-semibold text-white">{totalUsers || 0}</span>
                    </div>
                    <div className="mt-4 h-px bg-white/5" />
                    <div className="mt-4 flex flex-col gap-3 text-slate-400">
                      <div className="flex items-center justify-between text-sm">
                        <span>{copy.distribution.free}</span>
                        <span className="font-medium text-slate-200">{freeUsers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{copy.distribution.members}</span>
                        <span className="font-medium text-slate-200">{memberUsers || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Activity */}
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 opacity-60 transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-4 pt-10">
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/5 bg-slate-800/50 text-blue-400">
                      <BarChart3 className="h-5 w-5" aria-hidden />
                    </span>
                    {copy.activity.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-slate-400">{copy.activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3">
                    {eventCounts && eventCounts.length > 0 ? (
                      eventCounts.map((event) => (
                        <div
                          key={event.event_type}
                          className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-800/20 px-4 py-3 text-sm text-slate-400 shadow-inner shadow-white/5 backdrop-blur hover:bg-slate-800/40 transition-colors"
                        >
                          <span className="uppercase tracking-[0.2em]">{event.event_type}</span>
                          <span className="text-base font-semibold text-white">{event.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic text-center py-4">{copy.activity.empty}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
