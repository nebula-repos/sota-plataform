import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LegalSection } from "@/components/legal/legal-section"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection, SectionHeader } from "@/components/common/page-section"

const sectionOrder = ["collect", "use", "share", "security", "rights", "changes"] as const

export default async function PrivacyPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "privacy")

  return (
    <PageShell>
      <HeroSection
        eyebrow={copy.hero.reviewed}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
      />

      <PageSection variant="alternate" blobs>
        <SectionHeader eyebrow={copy.hero.title} title="" className="mb-16" />
        <div className="grid gap-8 md:grid-cols-2">
          {sectionOrder.map((key) => {
            const section = copy.sections[key]
            return (
              <LegalSection key={section.title} section={section} />
            )
          })}
        </div>
      </PageSection>

      <PageSection variant="default" blobs>
        <div className="text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
            {copy.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-400">
            {copy.cta.prefix}{" "}
            <a className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 underline-offset-4 transition-colors font-semibold" href={`mailto:${copy.cta.email}`}>
              {copy.cta.email}
            </a>{" "}
            {copy.cta.suffix}
          </p>
        </div>
      </PageSection>
    </PageShell>
  )
}
