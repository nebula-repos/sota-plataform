import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { Users, Activity, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getLocale } from "@/lib/i18n/server"
import { MouseGlowCard } from "@/components/mouse-glow-card"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function AdminPage() {
  const locale = await getLocale()
  const adminCopy = await getDictionary(locale, "admin")
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

  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })
  const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true })

  const displayName = userProfile.full_name || userProfile.email || adminCopy.hero.fallbackName

  const statsCards = [
    {
      label: adminCopy.stats.users,
      value: totalUsers || 0,
      icon: Users,
    },
    {
      label: adminCopy.stats.events,
      value: totalEvents || 0,
      icon: Activity,
    },
  ]

  const managementSections = [
    {
      icon: Users,
      title: adminCopy.sections.users.title,
      description: adminCopy.sections.users.description,
      cta: adminCopy.sections.users.cta,
      href: "/admin/users",
    },
    {
      icon: Activity,
      title: adminCopy.sections.audit.title,
      description: adminCopy.sections.audit.description,
      cta: adminCopy.sections.audit.cta,
      href: "/admin/audit-logs",
    },
    {
      icon: Sparkles,
      title: adminCopy.sections.metrics.title,
      description: adminCopy.sections.metrics.description,
      cta: adminCopy.sections.metrics.cta,
      href: "/admin/metrics",
    },
  ]

  const managementEyebrow = adminCopy.hero.badge

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
                  <span>{adminCopy.hero.badge}</span>
                </div>
                <h1 className="mt-8 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {displayName}, <span className="text-slate-400">{adminCopy.hero.titleSuffix}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl">
                  {adminCopy.hero.description}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {statsCards.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <MouseGlowCard
                      key={stat.label}
                      className="h-full border border-white/10 bg-slate-900/40 backdrop-blur-xl"
                    >
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-semibold text-white mt-1">{stat.value}</p>
                    </MouseGlowCard>
                  )
                })}
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {managementSections.map((section) => {
                const Icon = section.icon
                return (
                  <Card
                    key={section.title}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 opacity-60 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="relative space-y-4">
                      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/5 bg-slate-800/50 text-blue-400 group-hover:text-blue-300 transition-colors">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          {managementEyebrow}
                        </span>
                      </div>
                      <CardTitle className="text-2xl text-white group-hover:text-blue-200 transition-colors">{section.title}</CardTitle>
                      <CardDescription className="text-pretty text-slate-400">{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Link href={section.href}>
                        <Button
                          variant="outline"
                          className="group/btn w-full rounded-full border-slate-700 bg-transparent text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                        >
                          {section.cta}
                          <ArrowRight
                            className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                            aria-hidden
                          />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
