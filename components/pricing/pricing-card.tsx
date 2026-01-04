import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StaggerItem } from "@/components/ui/animation-wrappers"
import { PricingCardProps } from "@/types/pricing.interface"
import { cn } from "@/lib/utils"

export function PricingCard({ plan, className }: PricingCardProps) {
  return (
    <StaggerItem
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/60",
        plan.highlightLabel
          ? "ring-1 ring-amber-500/50 shadow-[0_0_50px_-20px_rgba(245,158,11,0.15)]"
          : "hover:border-amber-500/20",
        className
      )}
    >
      {plan.tag && (
        <span className="absolute left-8 top-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-amber-300">
          {plan.tag}
        </span>
      )}
      {plan.highlightLabel && (
        <span className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-br from-amber-500 to-amber-700 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-white shadow-lg">
          {plan.highlightLabel}
        </span>
      )}

      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-semibold text-white group-hover:text-amber-100 transition-colors">
          {plan.name}
        </h3>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <p className="text-4xl font-bold text-white tracking-tight">{plan.price}</p>
          {plan.originalPrice && (
            <span className="text-sm font-semibold text-slate-500 line-through decoration-slate-600">
              {plan.originalPrice}
            </span>
          )}
        </div>
        {plan.implementationFee && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            {plan.implementationFee}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-400 leading-relaxed min-h-[40px]">
          {plan.description}
        </p>
      </div>

      <div className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
              <div className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.3)]">
                <Check className="h-2.5 w-2.5" aria-hidden />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={plan.id === "tier-custom" ? "/contact" : "/auth/signup"} className="block">
          <Button
            className={cn(
              "w-full h-12 rounded-xl font-semibold tracking-wide transition-all duration-300",
              plan.highlightLabel
                ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-900/20"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/5 hover:border-amber-500/30"
            )}
          >
            {plan.cta}
          </Button>
        </Link>
      </div>
    </StaggerItem>
  )
}
