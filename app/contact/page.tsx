import Link from "next/link"
import { ArrowRight, Clock, Mail } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { InfoCard } from "@/components/contact/info-card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection } from "@/components/common/page-section"

export default async function ContactPage() {
  const locale = await getLocale()
  const contact = await getDictionary(locale, "contact")
  const common = await getDictionary(locale, "common")
  const socialLinks = (common.footer.socials.items ?? []) as Array<{ label: string; handle: string; url: string }>


  return (
    <PageShell>
      <HeroSection
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        subtitle={contact.hero.description}
        primaryCta={
          <Link href={`mailto:${contact.hero.email}`} className="group">
            <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50">
              <Mail className="h-4 w-4" aria-hidden />
              {contact.hero.emailLabel}
              <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        }
        secondaryCta={
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-6 py-3 text-sm text-slate-400 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-blue-400" aria-hidden />
            {contact.hero.meta}
          </div>
        }
      />

      <PageSection variant="alternate" blobs>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_0.85fr] lg:items-start">

          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-slate-400">Fill out the form below and we&apos;ll get back to you shortly.</p>
            </div>
            <ContactForm copy={contact.form} />
          </div>

          <div className="space-y-8">
            <InfoCard
              title={contact.details.title}
              description={contact.details.note}
              response={contact.details.response}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {contact.details.items.map((item: { label: string; description: string; value: string }) => (
                <InfoCard
                  key={item.value}
                  title={item.label}
                  description={item.description}
                >
                  <Link
                    href={`mailto:${item.value}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-amber-400 transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    {item.value}
                  </Link>
                </InfoCard>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <InfoCard
                title={contact.socials.title}
                description={contact.socials.description}
                socials={socialLinks}
              />
            )}
          </div>
        </div>
      </PageSection>
    </PageShell>
  )
}
