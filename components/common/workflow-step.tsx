import { StaggerItem } from "@/components/ui/animation-wrappers"
import { WorkflowStepProps } from "@/types/components.interface"
import { cn } from "@/lib/utils"

export function WorkflowStep({
  index,
  title,
  description,
  isLast,
  className,
}: WorkflowStepProps) {
  return (
    <StaggerItem className={cn("group flex gap-6", className)}>
      <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-800/50 text-xl font-bold text-blue-400 shadow-inner group-hover:border-amber-500/40 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all duration-300">
        <span>{index + 1}</span>
        {!isLast && (
          <div className="absolute bottom-[-34px] left-1/2 w-px h-8 bg-white/5 group-hover:bg-amber-500/30 transition-colors" />
        )}
      </div>
      <div className="pt-1">
        <p className="text-lg font-semibold text-white group-hover:text-amber-100 transition-colors">
          {title}
        </p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </StaggerItem>
  )
}
