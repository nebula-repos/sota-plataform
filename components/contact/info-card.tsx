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
  tone = "dark",
}: InfoCardProps & { children?: React.ReactNode; icon?: React.ElementType }) {

  const resolveSocialIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("instagram")) return Instagram
    if (lower.includes("linkedin")) return Linkedin
    return Twitter
  }
  const isLight = tone === "light"
  const cardClass = isLight
    ? "rounded-none border-slate-200/80 bg-white shadow-[0_22px_55px_-35px_rgba(15,23,42,0.25)]"
    : "rounded-none border-white/5 bg-slate-900/30 shadow-xl backdrop-blur-xl group hover:border-amber-500/20 transition-all duration-300"
  const titleClass = isLight ? "text-slate-900" : "text-white"
  const descriptionClass = isLight ? "text-slate-500" : "text-slate-400"
  const responseClass = isLight
    ? "rounded-none border-slate-200 bg-slate-100 text-slate-600"
    : "rounded-none border-blue-500/20 bg-blue-500/10 text-blue-300"
  const responseIconClass = isLight ? "text-slate-500" : "text-blue-300"
  const socialLinkClass = isLight
    ? "rounded-none border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:border-slate-300"
    : "rounded-none border-white/5 bg-slate-900/40 text-slate-200 hover:bg-slate-900/80 hover:border-blue-500/30"
  const socialIconClass = isLight ? "rounded-none bg-slate-100 text-slate-600" : "rounded-none bg-blue-500/10 text-blue-400"
  const socialLabelClass = isLight ? "text-slate-400" : "text-slate-500"
  const socialHandleClass = isLight ? "text-slate-900" : "text-white"
  const socialArrowClass = isLight ? "text-slate-400 group-hover:text-slate-700" : "text-slate-600 group-hover:text-amber-400"

  return (
    <Card
      className={cn(
        "border group transition-all duration-300",
        cardClass,
        response && "overflow-hidden",
        className
      )}
    >
      {response && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[2px] opacity-60",
            isLight
              ? "bg-gradient-to-r from-slate-900/40 via-slate-900/15 to-transparent"
              : "bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"
          )}
        />
      )}
      <CardHeader className={response ? "space-y-4" : undefined}>
        <CardTitle className={cn(titleClass, response ? "text-2xl font-bold" : "text-lg font-semibold")}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(descriptionClass, response ? "text-base leading-relaxed" : "")}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={response ? "space-y-4" : undefined}>
        {response && (
          <div className={cn("inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]", responseClass)}>
            <Clock className={cn("h-4 w-4", responseIconClass)} aria-hidden />
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
                    className={cn(
                      "flex items-center gap-3 border px-4 py-3 text-sm transition-all hover:translate-x-1",
                      socialLinkClass
                    )}
                  >
                    <div className={cn("flex size-8 items-center justify-center", socialIconClass)}>
                      <SocialIcon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className={cn("text-[10px] uppercase tracking-wider font-bold", socialLabelClass)}>{link.label}</span>
                      <span className={cn("font-semibold", socialHandleClass)}>{link.handle}</span>
                    </div>
                    <ArrowRight className={cn("ml-auto h-4 w-4 transition-colors", socialArrowClass)} aria-hidden />
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
