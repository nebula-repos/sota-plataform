import * as SheetPrimitive from "@radix-ui/react-dialog"
import { ReactNode } from "react"

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: "top" | "bottom" | "left" | "right"
  children?: ReactNode
}
