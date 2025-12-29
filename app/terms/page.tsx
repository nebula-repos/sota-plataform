import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

export default async function TermsPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "terms")

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[oklch(20.8%_0.042_265.755)]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-blue-500/30 blur-[120px] rounded-full opacity-70 mix-blend-screen" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full opacity-60 mix-blend-screen" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-blue-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)] backdrop-blur-md">
              {copy.hero.effective}
            </div>
            <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
              {copy.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-400 md:text-xl leading-relaxed">{copy.hero.subtitle}</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative overflow-hidden py-24 bg-[oklch(12.9%_0.042_264.695)] border-t border-white/5">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[130px] rounded-full opacity-40 mix-blend-screen" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[130px] rounded-full opacity-30 mix-blend-screen" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500">{copy.hero.title}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {copy.sections.map((section) => (
                <MouseGlowCard
                  key={section.title}
                  className="h-full space-y-4 rounded-3xl border border-white/5 bg-slate-900/30 p-8 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group"
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white group-hover:text-amber-100 transition-colors">{section.title}</h2>
                    {section.body?.map((paragraph, index) => (
                      <p key={`${section.title}-body-${index}`} className="text-base text-slate-400 leading-relaxed">
                        {paragraph}
                        {section.email && section.body && index === section.body.length - 1 ? (
                          <>
                            {" "}
                            <a className="text-blue-400 hover:text-amber-400 underline decoration-blue-500/30 underline-offset-4 transition-colors" href={`mailto:${section.email}`}>
                              {section.email}
                            </a>
                            .
                          </>
                        ) : null}
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="space-y-3 rounded-2xl border border-white/5 bg-slate-900/40 p-5 text-sm text-slate-300 shadow-inner">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1.5 size-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && <p className="text-sm text-slate-500 italic border-l-2 border-amber-500/30 pl-3">{section.note}</p>}
                </MouseGlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="relative overflow-hidden border-t border-white/5 bg-[oklch(20.8%_0.042_265.755)] py-24">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-blue-900/5 blur-3xl opacity-50" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
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
        </section>
      </main>
      <Footer />
    </div>
  )
}
