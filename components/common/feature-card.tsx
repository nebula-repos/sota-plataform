import { MouseGlowCard } from "@/components/ui/mouse-glow-card"
import { FeatureCardProps } from "@/types/components.interface"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export function FeatureCard({
  icon: Icon = Star,
  title,
  description,
  value,
  className,
  children,
  headerElement,
}: FeatureCardProps) {
  return (
    <MouseGlowCard
      className={cn(
        "relative overflow-hidden border border-white/5 bg-slate-900/30 p-8 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:bg-slate-900/50 group",
        className
      )}
    >
      {headerElement ? (
        headerElement
      ) : (
        <div className="mb-6 inline-flex items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] group-hover:border-amber-500/20 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors duration-300">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
      )}
      {value && (
        <>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-amber-500/80 transition-colors">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
        </>
      )}
      {!value && (
        <h3 className="mb-2 text-lg font-semibold text-slate-100 group-hover:text-amber-100 transition-colors">
          {title}
        </h3>
      )}
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      {children}
    </MouseGlowCard>
  )
}
