import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Lightbulb, ShieldCheck } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animation-wrappers"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection, SectionHeader } from "@/components/common/page-section"
import { TeamCard } from "@/components/about/team-card"
import { FeatureCard } from "@/components/common/feature-card"
import { CTASection } from "@/components/common/cta-section"

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
    <PageShell>
      <HeroSection
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        subtitle={about.hero.description}
        primaryCta={
          <Link href="/research-lines">
            <Button
              size="lg"
              className="group relative h-12 gap-2 overflow-hidden rounded-xl border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                {about.hero.primaryCta}
                <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
          </Link>
        }
        secondaryCta={
          <Link href="/research-lines#releases">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
            >
              {about.hero.secondaryCta}
            </Button>
          </Link>
        }
      />

      {/* Principles */}
      <PageSection variant="alternate" blobs>
        <SectionHeader eyebrow={about.hero.eyebrow} title="" className="mb-16" />
        <StaggerContainer className="grid gap-8 md:grid-cols-2">
          {about.principles.map((principle, index) => {
            const Icon = principleIcons[principle.icon as keyof typeof principleIcons] ?? Target
            return (
              <StaggerItem key={`${principle.title}-${index}`}>
                <FeatureCard
                  icon={Icon}
                  title={principle.title}
                  description={principle.description}
                  className="h-full bg-slate-900/30 backdrop-blur-xl border-white/5 hover:bg-slate-900/50 hover:border-amber-500/20"
                >
                  {principle.body && <p className="text-sm text-slate-400/80 mt-4">{principle.body}</p>}
                  {Array.isArray(principle.bullets) && (
                    <ul className="space-y-2 text-sm text-slate-300 mt-4">
                      {principle.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1.5 size-1.5 rounded-sm bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </FeatureCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </PageSection>

      {/* How we work */}
      <PageSection variant="glow" blobs>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <FadeIn className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30 p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group">
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
          </FadeIn>

          <StaggerContainer className="space-y-6">
            <StaggerItem className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-amber-500/20">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
              <h3 className="text-lg font-bold text-white mb-4">{about.how.pillars.title}</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {about.how.pillars.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                      <span className="size-1.5 rounded-sm bg-current" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            <StaggerItem className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:border-amber-500/20">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent" />
              <h3 className="text-lg font-bold text-white mb-4">{about.how.collaboration.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {about.how.collaboration.description}{" "}
                <a className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 underline-offset-4 transition-colors font-semibold" href="mailto:hola@sotar.ai">
                  hola@sotar.ai
                </a>
                .
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </PageSection>

      {/* Team */}
      <PageSection variant="alternate" blobs>
        <SectionHeader
          eyebrow={about.hero.eyebrow}
          title={about.team.title}
        />
        <StaggerContainer className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {about.team.members.map((member, index) => (
            <StaggerItem key={index}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      {/* CTA */}
      <CTASection
        title={about.cta.title}
        description={about.cta.description}
        primaryCta={
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="group relative h-12 gap-2 overflow-hidden rounded-xl border border-amber-500/20 bg-blue-600 text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50 px-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                {about.cta.primary}
                <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
          </Link>
        }
        secondaryCta={
          <Link href="/research-lines">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-slate-700 bg-slate-900/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:border-amber-500/40 hover:text-amber-100 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
            >
              {about.cta.secondary}
            </Button>
          </Link>
        }
      />
    </PageShell>
  )
}

