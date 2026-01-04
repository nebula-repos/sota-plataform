import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { BaseComponentProps } from "@/types/common.interface"
import { cn } from "@/lib/utils"

export function PageShell({ children, className }: BaseComponentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <Header />
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  )
}
