import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { FadeIn, StaggerContainer } from "@/components/ui/animation-wrappers"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection, SectionHeader } from "@/components/common/page-section"
import { PricingCard } from "@/components/pricing/pricing-card"

import { PricingPlan } from "@/types/pricing.interface"

export default async function PricingPage() {
  const locale = await getLocale()
  const pricingCopy = await getDictionary(locale, "pricing")
  const plans = pricingCopy.plans as PricingPlan[]

  return (
    <PageShell>
      <HeroSection
        eyebrow={pricingCopy.hero.eyebrow}
        title={pricingCopy.hero.title}
        subtitle={pricingCopy.hero.description}
        primaryCta={
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="group relative h-12 gap-2 overflow-hidden rounded-xl border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                {pricingCopy.hero.primaryCta}
                <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
          </Link>
        }
        secondaryCta={
          <a href={`mailto:${pricingCopy.contact.email}`}>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
            >
              {pricingCopy.hero.secondaryCta}
            </Button>
          </a>
        }
      >
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
          {pricingCopy.overview.note}
        </p>
      </HeroSection>

      <PageSection variant="alternate" blobs>
        <SectionHeader
          eyebrow={pricingCopy.overview.eyebrow}
          title={pricingCopy.overview.title}
          subtitle={pricingCopy.overview.description}
        />
        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </StaggerContainer>
      </PageSection>

      <PageSection variant="glow" blobs>
        <div className="grid gap-8 lg:grid-cols-2">
          <FadeIn className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/50 hover:border-amber-500/20 group">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white group-hover:text-amber-100 transition-colors">{pricingCopy.included.title}</h3>
              <div className="mt-4 h-0.5 w-16 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {pricingCopy.included.items.map((item: string) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                    <Check className="h-3 w-3" aria-hidden />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.2} className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/50 hover:border-amber-500/20 group text-center flex flex-col items-center justify-center">
            <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="h-6 w-6" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{pricingCopy.contact.title}</h3>
            <p className="text-slate-400 mb-8 max-w-sm">{pricingCopy.contact.description}</p>

            <a href={`mailto:${pricingCopy.contact.email}`} className="inline-flex flex-col items-center gap-4">
              <Button className="h-12 rounded-xl px-8 bg-white text-slate-900 hover:bg-amber-50 hover:text-amber-900 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
                {pricingCopy.contact.cta}
              </Button>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 hover:text-amber-500 transition-colors">
                {pricingCopy.contact.email}
              </p>
            </a>
          </FadeIn>
        </div>
      </PageSection>
    </PageShell>
  )
}

