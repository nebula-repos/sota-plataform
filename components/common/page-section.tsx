import { PageSectionProps, SectionHeaderProps } from "@/types/common.interface"
import { cn } from "@/lib/utils"

export function PageSection({
  children,
  className,
  variant = "default",
  blobs = false
}: PageSectionProps) {
  const variants = {
    default: "bg-slate-950",
    alternate: "bg-[oklch(12.9%_0.042_264.695)]",
    glow: "bg-[oklch(20.8%_0.042_265.755)]",
  }

  return (
    <section className={cn("relative overflow-hidden py-24 border-t border-white/5", variants[variant], className)}>
      {blobs && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[130px] rounded-full opacity-40 mix-blend-screen" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[130px] rounded-full opacity-30 mix-blend-screen" />
        </div>
      )}
      <div className="container relative z-10 mx-auto px-4">
        {children}
      </div>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
  children
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-16", align === "center" ? "mx-auto max-w-2xl text-center" : "text-left", className)}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500 mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-lg text-slate-400 leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}
