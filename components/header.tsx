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
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground/90 transition-colors duration-200 hover:bg-white/10 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
  const subtleAuthButtonClass =
    "rounded-full px-5 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-white/10 hover:text-primary"

  return (
    <header className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-full border border-white/10 bg-background/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl transition-all duration-300 hover:bg-background/80 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group relative flex items-center gap-2 text-lg font-bold tracking-tight transition-transform hover:scale-105"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <span className="bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 bg-clip-text text-transparent">
              SotA
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-6">
          <div className="hidden items-center gap-1 sm:flex">
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

          <div className="flex items-center gap-3 pl-6 sm:border-l sm:border-white/10">
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
                    className="group relative overflow-hidden rounded-full bg-primary/10 px-6 text-sm font-semibold text-primary shadow-sm hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {common.header.auth.signup}
                      <div className="h-1.5 w-1.5 rounded-full bg-primary transition-all group-hover:bg-emerald-400" />
                    </span>
                  </Button>
                </Link>
              </>
            )}
            <div className="scale-90">
              <LanguageToggle locale={locale} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
