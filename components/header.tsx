import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { LanguageToggle } from "@/components/language-toggle"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function Header() {
  const locale = await getLocale()
  const common = await getDictionary(locale, "common")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userProfile = user ? await resolveUserProfile(supabase, user) : null

  const navLinkClass =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700/60"
  const subtleAuthButtonClass =
    "rounded-full px-5 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-white/5 hover:text-amber-500"

  return (
    <header className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-full border border-white/5 bg-slate-950/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950/70 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group relative flex items-center gap-2 text-lg font-bold tracking-tight transition-transform hover:scale-105"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-700 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-600"></span>
            </span>
            <span className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              SotA
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-6">
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/pricing" className={navLinkClass}>
              {common.header.nav.pricing}
            </Link>
            <Link href="/about" className={navLinkClass}>
              {common.header.nav.about}
            </Link>
            {user && (
              <Link href="/dashboard" className={navLinkClass}>
                {common.header.nav.myAccount}
              </Link>
            )}
            {userProfile?.role === "admin" && (
              <Link href="/admin" className={navLinkClass}>
                {common.header.nav.admin}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 pl-6 sm:border-l sm:border-white/5">
            {user ? (
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit" className={subtleAuthButtonClass}>
                  {common.header.auth.signout}
                </Button>
              </form>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:inline-block">
                  <Button variant="ghost" size="sm" className={subtleAuthButtonClass}>
                    {common.header.auth.login}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="group relative overflow-hidden rounded-full border border-blue-500/30 bg-blue-500/10 px-6 text-sm font-semibold text-blue-200 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] hover:bg-blue-500/20 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] hover:border-blue-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {common.header.auth.signup}
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    </span>
                  </Button>
                </Link>
              </>
            )}
            <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
              <LanguageToggle locale={locale} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

