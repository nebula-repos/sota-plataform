import Link from "next/link"
import { ArrowRight, Clock, Instagram, Linkedin, Mail, Twitter } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function ContactPage() {
  const locale = await getLocale()
  const contact = await getDictionary(locale, "contact")
  const common = await getDictionary(locale, "common")
  const socialLinks = (common.footer.socials.items ?? []) as Array<{ label: string; handle: string; url: string }>

  const resolveSocialIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("instagram")) return Instagram
    if (lower.includes("linkedin")) return Linkedin
    return Twitter
  }

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
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-blue-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)] backdrop-blur-md">
              {contact.hero.eyebrow}
            </span>

            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight text-white md:text-6xl drop-shadow-sm">
              {contact.hero.title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">{contact.hero.description}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`mailto:${contact.hero.email}`} className="group">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)] hover:border-amber-400/50">
                  <Mail className="h-4 w-4" aria-hidden />
                  {contact.hero.emailLabel}
                  <ArrowRight className="h-4 w-4 text-amber-300 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-slate-900/50 px-6 py-3 text-sm text-slate-400 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-blue-400" aria-hidden />
                {contact.hero.meta}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="py-24 bg-[oklch(12.9%_0.042_264.695)] border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full opacity-40 mix-blend-screen" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_0.85fr] lg:items-start">

              {/* Contact Form Container */}
              <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                  <p className="text-slate-400">Fill out the form below and we&apos;ll get back to you shortly.</p>
                </div>
                <ContactForm copy={contact.form} />
              </div>

              {/* Info Side */}
              <div className="space-y-8">
                {/* Details Card */}
                <Card className="border border-white/5 bg-slate-900/30 shadow-xl backdrop-blur-xl overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent opacity-60" />
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl font-bold text-white">{contact.details.title}</CardTitle>
                    <CardDescription className="text-base text-slate-400 leading-relaxed">{contact.details.note}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                      <Clock className="h-4 w-4" aria-hidden />
                      {contact.details.response}
                    </div>
                  </CardContent>
                </Card>

                {/* Direct Contacts Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {contact.details.items.map((item: { label: string; description: string; value: string }) => (
                    <Card key={item.value} className="border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 backdrop-blur-xl transition-colors duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">{item.label}</CardTitle>
                        <CardDescription className="text-slate-400">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={`mailto:${item.value}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-amber-400 transition-colors"
                        >
                          <Mail className="h-4 w-4" aria-hidden />
                          {item.value}
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Socials Card */}
                {socialLinks.length > 0 && (
                  <Card className="border border-white/5 bg-slate-900/30 shadow-xl backdrop-blur-xl group hover:border-amber-500/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">{contact.socials.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {contact.socials.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {socialLinks.map((link) => {
                          const Icon = resolveSocialIcon(link.label)
                          return (
                            <li key={link.url}>
                              <Link
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 transition-all hover:bg-slate-900/80 hover:border-blue-500/30 hover:translate-x-1"
                              >
                                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                  <Icon className="h-4 w-4" aria-hidden />
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{link.label}</span>
                                  <span className="font-semibold text-white">{link.handle}</span>
                                </div>
                                <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors" aria-hidden />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
