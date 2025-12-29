import Link from "next/link"
import { Instagram, Linkedin, Twitter, Sparkles } from "lucide-react"

import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function Footer() {
  const locale = await getLocale()
  const common = await getDictionary(locale, "common")
  const footerCopy = common.footer

  return (
    <footer className="border-t border-white/5 bg-slate-900 pt-20 pb-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-2 group">
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-amber-500/20 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">SotA</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{footerCopy.tagline}</p>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {footerCopy.sections.links}
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-amber-400 transition-colors">
                  {footerCopy.links.pricing}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-amber-400 transition-colors">
                  {footerCopy.links.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-amber-400 transition-colors">
                  {footerCopy.links.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {footerCopy.sections.legal}
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-amber-400 transition-colors">
                  {footerCopy.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-amber-400 transition-colors">
                  {footerCopy.links.terms}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">{footerCopy.socials.title}</h3>
            <ul className="space-y-4 text-sm">
              {footerCopy.socials.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="group flex items-center gap-3 text-slate-400 transition-colors hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.label === "Instagram" && <Instagram className="h-4 w-4" aria-hidden />}
                      {item.label.startsWith("X") && <Twitter className="h-4 w-4" aria-hidden />}
                      {item.label === "LinkedIn" && <Linkedin className="h-4 w-4" aria-hidden />}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-300 transition-colors">{item.label}</span>
                      <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{item.handle}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SotA. {footerCopy.rights}</p>
          <p className="text-xs text-slate-600">Designed with intent.</p>
        </div>
      </div>
    </footer>
  )
}

