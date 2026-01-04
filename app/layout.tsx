import { LanguageTransitionProvider } from '@/components/providers/language-transition-provider'

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { getLocale } from '@/lib/i18n/server'

export const metadata: Metadata = {
  title: 'SotA - State of the Art Research Platform',
  description: 'Access high-quality academic and industry research with SotA.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body className={`font-mono ${GeistMono.variable} ${GeistSans.variable}`}>
        <LanguageTransitionProvider>
          <div key={locale}>
            {children}
          </div>
          <Analytics />
        </LanguageTransitionProvider>
      </body>
    </html>
  )
}
