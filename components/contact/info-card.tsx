import Link from "next/link"
import { ArrowRight, Clock, Instagram, Linkedin, Twitter } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoCardProps } from "@/types/components.interface"
import { cn } from "@/lib/utils"

export function InfoCard({
  title,
  description,
  response,
  socials,
  className,
  children,
}: InfoCardProps & { children?: React.ReactNode; icon?: React.ElementType }) {

  const resolveSocialIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("instagram")) return Instagram
    if (lower.includes("linkedin")) return Linkedin
    return Twitter
  }

  return (
    <Card
      className={cn(
        "border border-white/5 bg-slate-900/30 shadow-xl backdrop-blur-xl group hover:border-amber-500/20 transition-all duration-300",
        response && "overflow-hidden",
        className
      )}
    >
      {response && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent opacity-60" />
      )}
      <CardHeader className={response ? "space-y-4" : undefined}>
        <CardTitle className={cn("text-white font-semibold", response ? "text-2xl font-bold" : "text-lg")}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn("text-slate-400", response ? "text-base leading-relaxed" : "")}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={response ? "space-y-4" : undefined}>
        {response && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
            <Clock className="h-4 w-4" aria-hidden />
            {response}
          </div>
        )}

        {/* If rendering a simple link with icon (like keys/emails) */}
        {children}

        {socials && (
          <ul className="space-y-3">
            {socials.map((link) => {
              const SocialIcon = resolveSocialIcon(link.label)
              return (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 transition-all hover:bg-slate-900/80 hover:border-blue-500/30 hover:translate-x-1"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <SocialIcon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{link.label}</span>
                      <span className="font-semibold text-white">{link.handle}</span>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
