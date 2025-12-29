import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { format } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import { UserActions } from "@/components/admin/user-actions"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

export default async function AdminUsersPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.users")
  const dateLocale = locale === "es" ? esLocale : enUS
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

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  const totalUsers = users?.length ?? 0
  const adminCount = users?.filter((u) => u.role === "admin").length ?? 0
  const memberCount = users?.filter((u) => u.membership_tier === "member").length ?? 0

  const statCards = [
    { label: copy.stats.total, value: totalUsers },
    { label: copy.stats.admins, value: adminCount },
    { label: copy.stats.members, value: memberCount },
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
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {copy.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl">
                  {copy.hero.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-full border-slate-700 bg-transparent text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      {copy.hero.back}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((stat, index) => (
                  <MouseGlowCard
                    key={`${stat.label}-${index}`}
                    className="h-full rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-slate-500">
                      {stat.label}
                    </p>
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
            <Card className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 opacity-60" />
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                  {copy.hero.badge}
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{copy.list.title}</CardTitle>
                  <CardDescription className="text-pretty text-slate-400">{copy.list.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map((u) => {
                      const roleLabel = u.role === "admin" ? copy.list.role.admin : copy.list.role.member
                      const tierLabel = u.membership_tier === "member" ? copy.list.tier.premium : copy.list.tier.free
                      return (
                        <div
                          key={u.id}
                          className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-800/20 p-6 transition-all duration-300 hover:bg-slate-800/40 hover:border-blue-500/20"
                        >
                          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-white">
                                  {u.full_name || copy.list.noName}
                                </p>
                                <Badge
                                  variant={u.role === "admin" ? "default" : "secondary"}
                                  className="rounded-full uppercase tracking-wide bg-blue-600 hover:bg-blue-500 text-white border-blue-400/20"
                                >
                                  {roleLabel}
                                </Badge>
                                <Badge
                                  variant={u.membership_tier === "member" ? "default" : "outline"}
                                  className="rounded-full uppercase tracking-wide bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                                >
                                  {tierLabel}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-400">{u.email}</p>
                              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                                {copy.list.registered}{" "}
                                {format(new Date(u.created_at), "MMMM d, yyyy", { locale: dateLocale })}
                              </p>
                            </div>
                            <UserActions
                              userId={u.id}
                              currentRole={u.role}
                              currentTier={u.membership_tier}
                              copy={copy.actions}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-6">{copy.list.empty}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
