import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { User, Crown, Calendar, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function DashboardPage() {
  const locale = await getLocale()
  const dashboard = await getDictionary(locale, "dashboard")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)
  // Get user's recent activity
  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const dateLocale = locale === "es" ? esLocale : enUS
  const displayName = userProfile?.full_name || userProfile?.email || dashboard.hero.fallbackName
  const membershipLabel =
    userProfile?.membership_tier === "member" ? dashboard.membership.premiumLabel : dashboard.membership.freeLabel
  const membershipDescription =
    userProfile?.membership_tier === "member"
      ? dashboard.membership.premiumDescription
      : dashboard.membership.freeDescription

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
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {dashboard.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  {dashboard.hero.greeting} <span className="text-blue-400">{displayName}</span>.
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl">
                  {dashboard.hero.description}
                </p>
                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <Link href="/research-lines" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative w-full gap-2 overflow-hidden rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-[1.02] px-8"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {dashboard.hero.primaryCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 sm:w-auto"
                    >
                      {dashboard.hero.secondaryCta}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <Card className="group relative overflow-hidden border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30">
                <div className="pointer-events-none absolute inset-0 bg-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="space-y-4 pt-8">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                    <Crown className="h-4 w-4" aria-hidden />
                    {dashboard.membership.title}
                  </CardTitle>
                  <div>
                    <Badge variant={userProfile?.membership_tier === "member" ? "default" : "secondary"} className="mb-2 bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20">
                      {membershipLabel}
                    </Badge>
                    <p className="text-sm text-slate-400">{membershipDescription}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-8">
                  <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-sm text-slate-400">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {dashboard.membership.memberSince}
                    </p>
                    <p className="mt-2 text-base text-white">
                      {userProfile?.created_at
                        ? format(new Date(userProfile.created_at), "MMMM d, yyyy", { locale: dateLocale })
                        : dashboard.membership.unknown}
                    </p>
                  </div>
                  {userProfile?.membership_tier === "free" && (
                    <Button className="w-full gap-2 rounded-xl bg-amber-600 text-white shadow-lg hover:bg-amber-500 border border-amber-500/20">
                      {dashboard.membership.upgradeCta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/5 py-24 bg-slate-950/50">
          {/* Section Background Glow */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-30" />
          </div>

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* Profile Card */}
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30">
                <CardHeader className="pt-8">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <User className="h-5 w-5 text-blue-400" aria-hidden />
                    {dashboard.profileCard.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-slate-400">
                    {dashboard.profileCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/50">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                        {dashboard.profileCard.fields.fullName}
                      </p>
                      <p className="mt-2 text-sm text-slate-200">
                        {userProfile?.full_name || dashboard.profileCard.fields.missing}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/50">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                        {dashboard.profileCard.fields.email}
                      </p>
                      <p className="mt-2 text-sm text-slate-200">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition-colors hover:bg-slate-800/50">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {dashboard.profileCard.fields.lastUpdated}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {userProfile?.updated_at
                        ? format(new Date(userProfile.updated_at), "MMMM d, yyyy", { locale: dateLocale })
                        : dashboard.profileCard.fields.notAvailable}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="gap-2 rounded-full border-slate-700 bg-transparent text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300">
                      {dashboard.profileCard.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Activity Card */}
              <Card className="group relative overflow-hidden border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-xl h-fit">
                <CardHeader className="pt-8 pl-6">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Calendar className="h-5 w-5 text-amber-400" aria-hidden />
                    {dashboard.activityCard.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-slate-400">
                    {dashboard.activityCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-6">
                  {recentEvents && recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-white/5 bg-slate-900/50 p-4 text-sm text-slate-400 transition-colors hover:bg-slate-800/50 hover:border-white/10"
                        >
                          <p className="text-sm font-semibold text-slate-200">{event.event_type}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                            {format(new Date(event.created_at), "MMMM d, yyyy '·' HH:mm", { locale: dateLocale })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-800 rounded-xl">{dashboard.activityCard.empty}</p>
                  )}
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
