import { Badge } from "@/components/ui/badge"
import { FadeIn, SlideUp, AnimatedBackgroundBlob } from "@/components/ui/animation-wrappers"
import { HeroSectionProps } from "@/types/common.interface"
import { cn } from "@/lib/utils"

export function HeroSection({
  className,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  blobs = true,
  children,
}: HeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[oklch(20.8%_0.042_265.755)]", className)}>
      {blobs && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatedBackgroundBlob
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-blue-500/30 blur-[120px] rounded-full opacity-70 mix-blend-screen"
            delay={0}
          />
          <AnimatedBackgroundBlob
            className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full opacity-60 mix-blend-screen"
            delay={2}
          />
          <AnimatedBackgroundBlob
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/20 blur-[140px] rounded-full opacity-50 mix-blend-screen"
            delay={4}
          />
        </div>
      )}

      <div className="container relative z-10 mx-auto px-4 text-center">
        {eyebrow && (
          <div className="mb-8">
            <Badge variant="glow">{eyebrow}</Badge>
          </div>
        )}

        <FadeIn>
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-white md:text-6xl drop-shadow-sm">
            {typeof title === "string" ? (
              <span className="bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {title}
              </span>
            ) : (
              title
            )}
          </h1>
        </FadeIn>

        {subtitle && (
          <SlideUp delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed md:text-xl">
              {subtitle}
            </p>
          </SlideUp>
        )}

        {(primaryCta || secondaryCta) && (
          <SlideUp delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {primaryCta}
            {secondaryCta}
          </SlideUp>
        )}

        {children}
      </div>
    </section>
  )
}
