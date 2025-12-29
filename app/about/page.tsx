import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Lightbulb, ShieldCheck } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

const principleIcons = {
  target: Target,
  users: Users,
  lightbulb: Lightbulb,
  shield: ShieldCheck,
} as const

export default async function AboutPage() {
  const locale = await getLocale()
  const about = await getDictionary(locale, "about")

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[oklch(20.8%_0.042_265.755)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-blue-500/30 blur-[120px] rounded-full opacity-70 mix-blend-screen" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full opacity-60 mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/20 blur-[140px] rounded-full opacity-50 mix-blend-screen" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)] backdrop-blur-md">
              {about.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight text-white md:text-6xl drop-shadow-sm">
              {about.hero.title}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-slate-400 md:text-xl leading-relaxed">
              {about.hero.description}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/research-lines">
                <Button
                  size="lg"
                  className="group relative h-12 gap-2 overflow-hidden rounded-full border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                    {about.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/research-lines#releases">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
                >
                  {about.hero.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="relative overflow-hidden py-24 bg-[oklch(12.9%_0.042_264.695)] border-t border-white/5">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[130px] rounded-full opacity-40" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full opacity-30" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">{about.hero.eyebrow}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {about.principles.map((principle, index) => {
                const Icon = principleIcons[principle.icon as keyof typeof principleIcons] ?? Target
                return (
                  <MouseGlowCard
                    key={`${principle.title}-${index}`}
                    className="h-full rounded-3xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group"
                  >
                    <div className="flex h-full flex-col gap-6 text-left relative z-10">
                      <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] group-hover:border-amber-500/20 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300">
                        <Icon className="h-7 w-7" aria-hidden />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">{principle.title}</h3>
                        <p className="text-base text-slate-400 leading-relaxed">{principle.description}</p>
                      </div>
                      {principle.body && <p className="text-sm text-slate-400/80">{principle.body}</p>}
                      {Array.isArray(principle.bullets) && (
                        <ul className="space-y-2 text-sm text-slate-300">
                          {principle.bullets.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1.5 size-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </MouseGlowCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="relative overflow-hidden border-t border-white/5 bg-[oklch(20.8%_0.042_265.755)] py-24">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute left-[-10%] top-0 w-[500px] h-[500px] bg-blue-500/30 blur-[100px] rounded-full opacity-50" />
            <div className="absolute right-[-10%] bottom-0 w-[500px] h-[500px] bg-amber-500/20 blur-[100px] rounded-full opacity-40" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30 p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-amber-400 opacity-60" />
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-2">{about.hero.eyebrow}</p>
                    <h2 className="text-3xl font-bold text-white group-hover:text-amber-100 transition-colors">{about.how.title}</h2>
                  </div>
                  <p className="text-lg text-slate-300 font-medium leading-relaxed">{about.how.intro}</p>
                  <div className="text-slate-400 text-pretty leading-relaxed space-y-4">
                    <p>{about.how.body}</p>
                  </div>
                </div>
              </div>

              {/* Side Cards */}
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-amber-500/20">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                  <h3 className="text-lg font-bold text-white mb-4">{about.how.pillars.title}</h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {about.how.pillars.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                          <span className="size-1.5 rounded-full bg-current" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-amber-500/20">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent" />
                  <h3 className="text-lg font-bold text-white mb-4">{about.how.collaboration.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {about.how.collaboration.description}{" "}
                    <a className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 underline-offset-4 transition-colors font-semibold" href="mailto:hola@sotar.ai">
                      hola@sotar.ai
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden border-t border-white/5 bg-[oklch(12.9%_0.042_264.695)] py-24">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">{about.cta.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group relative h-12 gap-2 overflow-hidden rounded-full border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                    {about.cta.primary}
                    <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/research-lines">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
                >
                  {about.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

