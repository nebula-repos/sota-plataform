"use client"

import { Locale, SUPPORTED_LOCALES } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { useLanguageTransition } from "./language-transition-provider"

export function LanguageToggle({ locale }: { locale: Locale }) {
  const { switchLanguage, isTransitioning } = useLanguageTransition()
  // We still use local state or props to show active, but the switching logic is delegated
  // Ideally, the parent passes the current locale. We can assume `locale` prop is current.
  const segmentWidth = 100 / SUPPORTED_LOCALES.length
  const activeIndex = Math.max(SUPPORTED_LOCALES.indexOf(locale), 0)

  const handleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return
    }
    switchLanguage(nextLocale)
  }

  return (
    <div className="relative flex rounded-full border border-white/10 bg-slate-900/50 p-1 shadow-inner shadow-black/20 backdrop-blur-md">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-blue-600/90 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-300 ease-out"
        style={{
          width: `calc(${segmentWidth}% - 3px)`,
          transform: `translate3d(calc(${activeIndex * 100}% + 3px), 0, 0)`,
          left: 0,
        }}
      />
      {SUPPORTED_LOCALES.map((code) => {
        const isActive = code === locale
        return (
          <button
            key={code}
            type="button"
            disabled={isTransitioning}
            onClick={() => handleChange(code)}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center rounded-full px-3 py-1 text-center text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-200",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200",
            )}
            aria-pressed={isActive}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
