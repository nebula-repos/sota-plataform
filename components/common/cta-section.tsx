import { ScaleIn } from "@/components/ui/animation-wrappers"
import { CTASectionProps } from "@/types/components.interface"
import { cn } from "@/lib/utils"

export function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTASectionProps) {
  return (
    <section className={cn("relative overflow-hidden py-40", className)}>
      <div className="absolute inset-0 bg-blue-900/5" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px] rounded-full opacity-60 mix-blend-screen" />
        <div className="absolute bottom-0 w-[100%] h-[300px] bg-amber-500/10 blur-[120px] rounded-full opacity-40 mix-blend-screen" />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <ScaleIn className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/10 bg-slate-900/80 px-8 py-20 shadow-2xl backdrop-blur-xl transition-all hover:border-amber-500/20">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-400 leading-relaxed">{description}</p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryCta}
            {secondaryCta}
          </div>
        </ScaleIn>
      </div>
    </section>
  )
}
