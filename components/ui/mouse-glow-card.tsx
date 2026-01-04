"use client"

import { useCallback, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type MouseGlowCardProps = {
  children: ReactNode
  className?: string
}

export function MouseGlowCard({ children, className }: MouseGlowCardProps) {
  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)

    const rotateRange = 10
    const relativeX = (x - rect.width / 2) / (rect.width / 2)
    const relativeY = (y - rect.height / 2) / (rect.height / 2)

    const rotateX = Math.max(Math.min(relativeY * -rotateRange, rotateRange), -rotateRange)
    const rotateY = Math.max(Math.min(relativeX * rotateRange, rotateRange), -rotateRange)
    const translateZ = Math.min(18, Math.hypot(rotateX, rotateY) * 1.2)

    card.style.setProperty("--mouse-rotate-x", `${rotateX}deg`)
    card.style.setProperty("--mouse-rotate-y", `${rotateY}deg`)
    card.style.setProperty("--mouse-translate-z", `${translateZ}px`)
  }, [])

  const handleMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()

    card.style.setProperty("--mouse-x", `${rect.width / 2}px`)
    card.style.setProperty("--mouse-y", `${rect.height / 2}px`)
    card.style.setProperty("--mouse-rotate-x", "0deg")
    card.style.setProperty("--mouse-rotate-y", "0deg")
    card.style.setProperty("--mouse-translate-z", "0px")
  }, [])

  const handleMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const style = card.style
    style.removeProperty("--mouse-x")
    style.removeProperty("--mouse-y")
    style.removeProperty("--mouse-rotate-x")
    style.removeProperty("--mouse-rotate-y")
    style.removeProperty("--mouse-translate-z")
  }, [])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative will-change-transform overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:shadow-blue-500/10 hover:bg-slate-900/50",
        className,
      )}
      style={{
        transform:
          "perspective(1300px) rotateX(var(--mouse-rotate-x, 0deg)) rotateY(var(--mouse-rotate-y, 0deg)) translateZ(var(--mouse-translate-z, 0px))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 80%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
