"use client"

import { createContext, useContext, useState, useTransition, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Locale, LOCALE_COOKIE } from "@/lib/i18n/config"

type LanguageTransitionContextType = {
  isTransitioning: boolean
  switchLanguage: (nextLocale: Locale) => Promise<void>
}

const LanguageTransitionContext = createContext<LanguageTransitionContextType | undefined>(undefined)

export function useLanguageTransition() {
  const context = useContext(LanguageTransitionContext)
  if (!context) {
    throw new Error("useLanguageTransition must be used within a LanguageTransitionProvider")
  }
  return context
}

export function LanguageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pending, startTransition] = useTransition()

  const switchLanguage = async (nextLocale: Locale) => {
    setIsTransitioning(true)

    // Wait for the entrance animation to cover the screen
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Switch the locale
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; max-age=31536000; path=/`

    startTransition(() => {
      router.refresh()

      // Wait for the refresh to likely happen, then remove overlay
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    })
  }

  return (
    <LanguageTransitionContext.Provider value={{ isTransitioning, switchLanguage }}>
      {children}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="language-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-700 opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-600"></span>
                </span>
                <span className="text-xl font-bold tracking-tight text-white">SotA</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageTransitionContext.Provider>
  )
}
