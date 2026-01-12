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

      <PageSection variant="default" className="bg-slate-50 !border-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_0.75fr] lg:items-start">

          <div className="rounded-none border border-slate-200 bg-white p-8 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.4)] md:p-10">
            <ContactForm copy={contact.form} />
          </div>

          <div className="space-y-6">
            <InfoCard
              title={contact.details.title}
              description={contact.details.note}
              response={contact.details.response}
              tone="light"
            >
              {contact.details.items?.[0] && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {contact.details.items[0].label}
                  </p>
                  <Link
                    href={`mailto:${contact.details.items[0].value}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900"
                  >
                    <span className="flex size-8 items-center justify-center rounded-none bg-slate-100 text-slate-600">
                      <Mail className="h-4 w-4" aria-hidden />
                    </span>
                    {contact.details.items[0].value}
                  </Link>
                  <p className="text-sm text-slate-500">{contact.details.items[0].description}</p>
                </div>
              )}
            </InfoCard>

            {socialLinks.length > 0 && (
              <InfoCard
                title={contact.socials.title}
                description={contact.socials.description}
                socials={socialLinks}
                tone="light"
              />
            )}
          </div>
        </div>
      </PageSection>
    </PageShell>
  )
}
