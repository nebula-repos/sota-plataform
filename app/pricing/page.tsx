import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, AnimatedBackgroundBlob } from "@/components/ui/animation-wrappers"

export default async function PricingPage() {
  const locale = await getLocale()
  const pricingCopy = await getDictionary(locale, "pricing")
  const plans = pricingCopy.plans as Array<{
    id: string
    tag?: string | null
    name: string
    price: string
    implementationFee?: string | null
    originalPrice?: string | null
    highlightLabel?: string | null
    description: string
    features: string[]
    cta: string
  }>

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30">
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
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)] backdrop-blur-md">
              <span>{pricingCopy.hero.eyebrow}</span>
            </div>

            <FadeIn>
              <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight text-white md:text-6xl drop-shadow-sm">
                <span className="bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {pricingCopy.hero.title}
                </span>
              </h1>
            </FadeIn>

            <SlideUp delay={0.2}>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-slate-400 md:text-xl leading-relaxed">
                {pricingCopy.hero.description}
              </p>
            </SlideUp>

            <SlideUp delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group relative h-12 gap-2 overflow-hidden rounded-full border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                    {pricingCopy.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <a href={`mailto:${pricingCopy.contact.email}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
                >
                  {pricingCopy.hero.secondaryCta}
                </Button>
              </a>
            </SlideUp>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              {pricingCopy.overview.note}
            </p>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="relative overflow-hidden py-32 bg-[oklch(12.9%_0.042_264.695)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/30 blur-[130px] rounded-full opacity-50" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/20 blur-[130px] rounded-full opacity-40" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">
                {pricingCopy.overview.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {pricingCopy.overview.title}
              </h2>
              <p className="mt-4 text-lg text-slate-400">{pricingCopy.overview.description}</p>
            </div>

            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <StaggerItem
                  key={plan.id}
                  className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/60 ${plan.highlightLabel ? "ring-1 ring-amber-500/50 shadow-[0_0_50px_-20px_rgba(245,158,11,0.15)]" : "hover:border-amber-500/20"
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
                          <div className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]">
                            <Check className="h-2.5 w-2.5" aria-hidden />
                          </div>
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
          </div>
        </section>

        {/* Included & Contact Sections */}
        <section className="relative overflow-hidden py-24 bg-[oklch(20.8%_0.042_265.755)] border-t border-white/5">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
          </div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Features Grid */}
              <FadeIn className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/50 hover:border-amber-500/20 group">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-100 transition-colors">{pricingCopy.included.title}</h3>
                  <div className="mt-4 h-0.5 w-16 bg-gradient-to-r from-blue-500 to-transparent" />
                </div>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {pricingCopy.included.items.map((item: string) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                        <Check className="h-3 w-3" aria-hidden />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Contact Card */}
              <FadeIn delay={0.2} className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/50 hover:border-amber-500/20 group text-center flex flex-col items-center justify-center">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-6 w-6" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{pricingCopy.contact.title}</h3>
                <p className="text-slate-400 mb-8 max-w-sm">{pricingCopy.contact.description}</p>

                <a href={`mailto:${pricingCopy.contact.email}`} className="inline-flex flex-col items-center gap-4">
                  <Button className="h-12 rounded-full px-8 bg-white text-slate-900 hover:bg-amber-50 hover:text-amber-900 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
                    {pricingCopy.contact.cta}
                  </Button>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 hover:text-amber-500 transition-colors">
                    {pricingCopy.contact.email}
                  </p>
                </a>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

