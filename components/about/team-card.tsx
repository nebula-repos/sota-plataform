import { MouseGlowCard } from "@/components/ui/mouse-glow-card"
import { TeamCardProps } from "@/types/components.interface"
import { cn } from "@/lib/utils"

export function TeamCard({ member, className }: TeamCardProps) {
  return (
    <MouseGlowCard
      className={cn(
        "h-full rounded-3xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group text-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="size-20 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-bold text-slate-500">
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-amber-100 transition-colors">
            {member.name}
          </h3>
          <p className="text-blue-400 font-medium">{member.role}</p>
          <p className="text-sm text-slate-400 mt-1">{member.title}</p>
        </div>
      </div>
    </MouseGlowCard>
  )
}
