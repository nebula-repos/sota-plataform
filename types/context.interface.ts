import { Locale } from "@/lib/i18n/config"

export type LanguageTransitionContextType = {
  isTransitioning: boolean
  switchLanguage: (nextLocale: Locale) => Promise<void>
}
