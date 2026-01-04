import { MouseGlowCard } from "@/components/ui/mouse-glow-card"
import { LegalSectionItem } from "@/types/legal.interface"

export function LegalSection({ section }: { section: LegalSectionItem }) {
  return (
    <MouseGlowCard
      className="h-full space-y-4 rounded-3xl border border-white/5 bg-slate-900/30 p-8 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-slate-900/50 hover:border-amber-500/20 group"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white group-hover:text-amber-100 transition-colors">
          {section.title}
        </h2>
        {(Array.isArray(section.body) ? section.body : [section.body]).filter(Boolean).map((paragraph, index) => (
          <p key={`${section.title}-body-${index}`} className="text-base text-slate-400 leading-relaxed">
            {paragraph}
            {section.email && section.body && index === (Array.isArray(section.body) ? section.body.length : 1) - 1 ? (
              <>
                {" "}
                <a
                  className="text-blue-400 hover:text-amber-400 underline decoration-blue-500/30 underline-offset-4 transition-colors"
                  href={`mailto:${section.email}`}
                >
                  {section.email}
                </a>
                .
              </>
            ) : null}
          </p>
        ))}
      </div>
      {(section.list || section.items) && (
        <ul className="space-y-3 rounded-2xl border border-white/5 bg-slate-900/40 p-5 text-sm text-slate-300 shadow-inner">
          {(section.list || section.items || []).map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.note && (
        <p className="text-sm text-slate-500 italic border-l-2 border-amber-500/30 pl-3">
          {section.note}
        </p>
      )}
      {section.effective && <p className="text-sm text-slate-500 font-mono">{section.effective}</p>}
    </MouseGlowCard>
  )
}
