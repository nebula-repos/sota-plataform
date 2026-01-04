import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Cpu, Gauge, Radar, ShieldCheck, Sparkles, Workflow } from "lucide-react"

import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { StaggerContainer, StaggerItem } from "@/components/ui/animation-wrappers"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection, SectionHeader } from "@/components/common/page-section"
import { PricingCard } from "@/components/pricing/pricing-card"
import { FeatureCard } from "@/components/common/feature-card"
import { CTASection } from "@/components/common/cta-section"
import { WorkflowStep } from "@/components/common/workflow-step"
import { PricingPlan } from "@/types/pricing.interface"

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
  const pricingPlans = pricingCopy.plans as PricingPlan[]

  return (
    <PageShell>
      {/* Hero Section */}
      <HeroSection
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        primaryCta={
          <Link href="/about">
            <Button
              size="lg"
              className="group relative h-12 gap-2 overflow-hidden rounded-xl border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                {home.hero.primaryCta}
                <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
          </Link>
        }
        secondaryCta={
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
            >
              {home.hero.secondaryCta}
            </Button>
          </Link>
        }
      >
        <StaggerContainer className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {home.highlights.map((highlight, index) => {
            const Icon = iconMap[highlight.icon as keyof typeof iconMap] ?? Sparkles
            return (
              <StaggerItem key={`${highlight.label}-${index}`}>
                <FeatureCard
                  icon={Icon}
                  title={highlight.label}
                  value={highlight.value}
                  description={highlight.description ?? undefined}
                  className={String(highlight.className)}
                />
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </HeroSection>

      <PageSection variant="alternate" blobs>
        <SectionHeader
          title={home.features.title}
          subtitle={home.features.subtitle}
        />
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
      </PageSection>

      {/* Signals Examples Section */}
      <PageSection variant="glow" blobs>
        <SectionHeader
          eyebrow={home.signals.title}
          title={home.signals.subtitle}
        />
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {home.signals.examples.map((signal, index) => {
            const Icon = iconMap[signal.icon as keyof typeof iconMap] ?? Sparkles
            return (
              <StaggerItem key={`${signal.title}-${index}`}>
                <FeatureCard
                  icon={Icon}
                  title={signal.title}
                  description={signal.description ?? undefined}
                  className="bg-slate-900/30 backdrop-blur-xl border-white/5 hover:bg-slate-900/50 hover:border-amber-500/30"
                />
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </PageSection>

      {/* Pricing Section */}
      <PageSection variant="alternate" blobs>
        <SectionHeader
          eyebrow={pricingCopy.overview.eyebrow}
          title={pricingCopy.overview.title}
          subtitle={pricingCopy.overview.description}
        >
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
        </SectionHeader>

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </StaggerContainer>
        <p className="mt-12 text-center text-sm text-slate-500">{pricingCopy.overview.note}</p>
      </PageSection>

      {/* Workflow Section */}
      {/* Workflow Section */}
      <PageSection variant="glow" blobs>
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">{home.workflow.title}</h2>
            <p className="text-lg text-slate-400 leading-relaxed text-pretty">{home.workflow.description}</p>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/30 p-10 shadow-[0_0_100px_-30px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent blur opacity-40" />
            <StaggerContainer className="relative space-y-8">
              {home.workflow.steps.map((step, index) => (
                <WorkflowStep
                  key={step.title}
                  index={index}
                  title={step.title}
                  description={step.description}
                  isLast={index === home.workflow.steps.length - 1}
                />
              ))}
            </StaggerContainer>
          </div>
        </div>
      </PageSection>

      {/* Contact Preview Section */}
      <PageSection variant="alternate" blobs>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">{home.contactPreview.eyebrow}</p>
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
              {home.contactPreview.title}
            </h2>
            <p className="text-lg text-slate-400 text-pretty mb-8">{home.contactPreview.description}</p>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link href="/contact">
                <Button className="h-12 rounded-xl px-8 bg-white text-slate-900 hover:bg-amber-50 hover:text-amber-900 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
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
                  <div className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <p className="text-lg text-slate-200">{highlight}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      {/* CTA Section */}
      <CTASection
        title={home.cta.title}
        description={home.cta.description}
        primaryCta={
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="h-14 rounded-xl bg-blue-600 px-10 text-lg font-semibold text-white shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] border border-blue-400/20"
            >
              {home.cta.primary}
              <ArrowRight className="ml-2 h-5 w-5 text-amber-200" aria-hidden />
            </Button>
          </Link>
        }
        secondaryCta={
          <Link href="/about">
            <Button
              variant="ghost"
              size="lg"
              className="h-14 rounded-xl text-lg text-slate-300 hover:bg-white/5 hover:text-amber-200"
            >
              {home.cta.secondary}
            </Button>
          </Link>
        }
      />
    </PageShell>
  )
}
