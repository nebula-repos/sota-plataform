import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Check, Cpu, Gauge, Radar, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { MouseGlowCard } from "@/components/mouse-glow-card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, AnimatedBackgroundBlob, ScaleIn } from "@/components/ui/animation-wrappers"


export const revalidate = 3600

const iconMap = {
  sparkles: Sparkles,
  radar: Radar,
  gauge: Gauge,
  cpu: Cpu,
  workflow: Workflow,
  shield: ShieldCheck,
} as const

export default async function HomePage() {
  const locale = await getLocale()
  const home = await getDictionary(locale, "home")
  const pricingCopy = await getDictionary(locale, "pricing")
  const pricingPlans = pricingCopy.plans as Array<{
    id: string
    tag?: string | null
    name: string
    price: string
    originalPrice?: string | null
    highlightLabel?: string | null
    description: string
    features: string[]
    cta: string
    implementationFee?: string | null
  }>

  // Fetch latest research lines

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 selection:bg-amber-500/30">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[oklch(20.8%_0.042_265.755)]">
          {/* Background Effects */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <AnimatedBackgroundBlob
              className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-blue-500/30 blur-[120px] rounded-full opacity-70 mix-blend-screen"
              delay={0}
            />
            <AnimatedBackgroundBlob
              className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full opacity-60 mix-blend-screen"
              delay={2}
            />
            <AnimatedBackgroundBlob
              className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/20 blur-[140px] rounded-full opacity-50 mix-blend-screen"
              delay={4}
            />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">


            <FadeIn>
              <h1 className="mx-auto max-w-5xl text-balance text-4xl font-bold tracking-tight text-white md:text-7xl drop-shadow-sm">
                <span className="bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {home.hero.title}
                </span>
              </h1>
            </FadeIn>

            <SlideUp delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-slate-300 md:text-xl leading-relaxed">
                {home.hero.subtitle}
              </p>
            </SlideUp>

            <SlideUp delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/about">
                <Button
                  size="lg"
                  className="group relative h-12 gap-2 overflow-hidden rounded-full border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                    {home.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
                >
                  {home.hero.secondaryCta}
                </Button>
              </Link>
            </SlideUp>

            <StaggerContainer className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {home.highlights.map((highlight, index) => {
                const Icon = iconMap[highlight.icon as keyof typeof iconMap] ?? Sparkles
                return (
                  <StaggerItem key={`${highlight.label}-${index}`}>
                    <MouseGlowCard
                      className={`relative overflow-hidden border border-white/5 bg-slate-900/30 p-8 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:bg-slate-900/50 group ${highlight.className ?? ""}`}
                    >
                      <div className="mb-6 inline-flex items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] group-hover:border-amber-500/20 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-amber-500/80 transition-colors">{highlight.label}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-white">{highlight.value}</p>
                      <p className="mt-2 text-sm text-slate-400">{highlight.description}</p>
                    </MouseGlowCard>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        <section className="relative overflow-hidden py-32 bg-[oklch(12.9%_0.042_264.695)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/30 blur-[120px] rounded-full opacity-50" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full opacity-50" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{home.features.title}</h2>
              <p className="mt-6 text-lg text-slate-400">{home.features.subtitle}</p>
            </div>
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              {home.features.cards.map((pillar, index) => {
                const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Sparkles
                return (
                  <StaggerItem
                    key={`${pillar.title}-${index}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-amber-500/40 hover:from-white/[0.08] hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.1)]"
                  >
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 text-amber-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-200 transition-colors">{pillar.title}</h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{pillar.description}</p>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent scale-x-0 transition-transform duration-500 group-hover:scale-x-100 opacity-70" />
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Signals Examples Section */}
        <section className="relative overflow-hidden border-y border-white/5 bg-[oklch(20.8%_0.042_265.755)] py-32 backdrop-blur-3xl">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full opacity-50" />
            <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full opacity-30" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500 mb-3">{home.signals.title}</p>
              <h2 className="text-4xl font-bold tracking-tight text-white">{home.signals.subtitle}</h2>
            </div>
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {home.signals.examples.map((signal, index) => {
                const Icon = iconMap[signal.icon as keyof typeof iconMap] ?? Sparkles
                return (
                  <StaggerItem key={`${signal.title}-${index}`}>
                    <MouseGlowCard
                      className="flex h-full flex-col border border-white/5 bg-slate-900/30 p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-slate-900/50 group backdrop-blur-xl"
                    >
                      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 group-hover:text-amber-400 group-hover:border-amber-500/20 group-hover:bg-amber-500/10 transition-colors">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-100 group-hover:text-white">{signal.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">{signal.description}</p>
                    </MouseGlowCard>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative overflow-hidden py-32 bg-[oklch(12.9%_0.042_264.695)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/30 blur-[130px] rounded-full opacity-50" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/20 blur-[130px] rounded-full opacity-40" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">{pricingCopy.overview.eyebrow}</p>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl mb-6">
                {pricingCopy.overview.title}
              </h2>
              <p className="text-lg text-slate-400 text-pretty">{pricingCopy.overview.description}</p>
              <div className="mt-8">
                <Link href="/pricing">
                  <Button variant="ghost" className="group text-blue-400 hover:text-amber-400 hover:bg-white/5">
                    <span className="flex items-center gap-2">
                      {pricingCopy.overview.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <StaggerItem
                  key={plan.id}
                  className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/60 ${plan.highlightLabel ? "ring-1 ring-amber-500/50 shadow-[0_0_50px_-20px_rgba(245,158,11,0.15)]" : "hover:border-amber-500/20"
                    }`}
                >
                  {plan.tag && (
                    <span className="absolute left-8 top-8 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-amber-300">
                      {plan.tag}
                    </span>
                  )}
                  {plan.highlightLabel && (
                    <span className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-br from-amber-500 to-amber-700 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-white shadow-lg">
                      {plan.highlightLabel}
                    </span>
                  )}

                  <div className="mt-12 mb-8">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-amber-100 transition-colors">{plan.name}</h3>
                    <div className="mt-4 flex flex-wrap items-baseline gap-2">
                      <p className="text-4xl font-bold text-white tracking-tight">{plan.price}</p>
                      {plan.originalPrice && (
                        <span className="text-sm font-semibold text-slate-500 line-through decoration-slate-600">{plan.originalPrice}</span>
                      )}
                    </div>
                    {plan.implementationFee && (
                      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        {plan.implementationFee}
                      </p>
                    )}
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed min-h-[40px]">{plan.description}</p>
                  </div>

                  <div className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                          <Check className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.id === "tier-custom" ? "/contact" : "/auth/signup"} className="block">
                      <Button className={`w-full h-12 rounded-full font-semibold tracking-wide transition-all duration-300 ${plan.highlightLabel
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-900/20"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/5 hover:border-amber-500/30"
                        }`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <p className="mt-12 text-center text-sm text-slate-500">{pricingCopy.overview.note}</p>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="relative overflow-hidden py-32 border-t border-white/5 bg-[oklch(20.8%_0.042_265.755)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[130px] rounded-full opacity-40" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full opacity-30" />
          </div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white mb-6">{home.workflow.title}</h2>
                <p className="text-lg text-slate-400 leading-relaxed text-pretty">{home.workflow.description}</p>
              </div>
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/30 p-10 shadow-[0_0_100px_-30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent blur opacity-40" />
                <StaggerContainer className="relative space-y-8">
                  {home.workflow.steps.map((step, index) => (
                    <StaggerItem key={step.title} className="group flex gap-6">
                      <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/50 text-xl font-bold text-blue-400 shadow-inner group-hover:border-amber-500/40 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all duration-300">
                        <span>{index + 1}</span>
                        {index !== home.workflow.steps.length - 1 && (
                          <div className="absolute bottom-[-34px] left-1/2 w-px h-8 bg-white/5 group-hover:bg-amber-500/30 transition-colors" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="text-lg font-semibold text-white group-hover:text-amber-100 transition-colors">{step.title}</p>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.description}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Preview Section */}
        <section className="relative overflow-hidden border-y border-white/5 bg-[oklch(12.9%_0.042_264.695)] py-24">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute left-[-10%] top-0 w-[500px] h-[500px] bg-blue-500/30 blur-[100px] rounded-full opacity-50" />
            <div className="absolute right-[-10%] bottom-0 w-[500px] h-[500px] bg-amber-500/20 blur-[100px] rounded-full opacity-40" />
          </div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">{home.contactPreview.eyebrow}</p>
                <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                  {home.contactPreview.title}
                </h2>
                <p className="text-lg text-slate-400 text-pretty mb-8">{home.contactPreview.description}</p>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Link href="/contact">
                    <Button className="h-12 rounded-full px-8 bg-white text-slate-900 hover:bg-amber-50 hover:text-amber-900 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
                      <span className="flex items-center gap-2">
                        {home.contactPreview.cta}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </Button>
                  </Link>
                  <a
                    href={`mailto:${home.contactPreview.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {home.contactPreview.emailCta}
                    <span className="text-slate-500">{home.contactPreview.email}</span>
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 lg:p-12">
                <ul className="space-y-6">
                  {home.contactPreview.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-4">
                      <div className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </div>
                      <p className="text-lg text-slate-200">{highlight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-40">
          <div className="absolute inset-0 bg-blue-900/5" />
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px] rounded-full opacity-60 mix-blend-screen" />
            <div className="absolute bottom-0 w-[100%] h-[300px] bg-amber-500/10 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <ScaleIn className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/10 bg-slate-900/80 px-8 py-20 shadow-2xl backdrop-blur-xl transition-all hover:border-amber-500/20">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{home.cta.title}</h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-400 leading-relaxed">{home.cta.description}</p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-blue-600 px-10 text-lg font-semibold text-white shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] border border-blue-400/20"
                  >
                    {home.cta.primary}
                    <ArrowRight className="ml-2 h-5 w-5 text-amber-200" aria-hidden />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-14 rounded-full text-lg text-slate-300 hover:bg-white/5 hover:text-amber-200"
                  >
                    {home.cta.secondary}
                  </Button>
                </Link>
              </div>
            </ScaleIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
