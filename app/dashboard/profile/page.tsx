import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ProfileForm } from "@/components/profile-form"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function ProfilePage() {
  const supabase = await createClient()
  const locale = await getLocale()
  const profileCopy = await getDictionary(locale, "dashboard.profile")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 selection:bg-amber-500/30">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5 py-24">
          {/* Background Glows */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-500/20 blur-[120px] rounded-full opacity-60 mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full opacity-40 mix-blend-screen" />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {profileCopy.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {profileCopy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl">
                  {profileCopy.hero.description}
                </p>
              </div>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-slate-700 bg-transparent text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {profileCopy.hero.backCta}
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-5 text-sm text-slate-200 shadow-inner shadow-white/5 backdrop-blur transition-colors hover:bg-slate-800/50">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                  {profileCopy.details.currentName}
                </p>
                <p className="mt-2 text-base font-medium">
                  {userProfile.full_name || profileCopy.details.missing}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-5 text-sm text-slate-200 shadow-inner shadow-white/5 backdrop-blur transition-colors hover:bg-slate-800/50">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                  {profileCopy.details.email}
                </p>
                <p className="mt-2 text-base font-medium">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/5 bg-slate-950/50 py-20">
          {/* Section Background Glow */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-30" />
          </div>

          <div className="container mx-auto max-w-2xl px-4 relative z-10">
            <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 opacity-60 transition-opacity group-hover:opacity-100" />
              <CardHeader className="space-y-4 pt-8">
                <CardTitle className="text-xl text-white">{profileCopy.form.cardTitle}</CardTitle>
                <CardDescription className="text-slate-400">{profileCopy.form.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={userProfile} copy={profileCopy.form} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
