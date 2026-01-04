import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

import { FeatureCard } from "@/components/common/feature-card"
import { StaggerContainer, StaggerItem } from "@/components/ui/animation-wrappers"
import { PageShell } from "@/components/common/page-shell"
import { HeroSection } from "@/components/common/hero-section"
import { PageSection } from "@/components/common/page-section"

import { unstable_cache } from "next/cache"
import { createServerClient } from "@supabase/ssr"

export default async function SignalsPage() {
  const locale = await getLocale()
  const dict = await getDictionary(locale, "signals")

  const getSignalTypes = unstable_cache(
    async () => {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return [] },
            setAll() { },
          },
        }
      )
      const { data } = await supabase
        .from("signal_types")
        .select("*")
        .order("priority")
      return data
    },
    ["signal_types"],
    {
      revalidate: 3600,
      tags: ["signal_types"],
    }
  )

  const signalTypes = await getSignalTypes()

  return (
    <PageShell>
      <HeroSection
        eyebrow={dict.hero.eyebrow}
        title={dict.hero.title}
        subtitle={dict.hero.subtitle}
      />

      <PageSection variant="alternate" blobs>
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {signalTypes?.map((type, index) => (
            <StaggerItem key={type.id} className="h-full">
              <FeatureCard
                title={type.name}
                description={type.description}
                className="h-full flex flex-col justify-between"
                headerElement={
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                    <span className="text-lg font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                }
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>
    </PageShell>
  )
}
