import { HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

export interface AnimationProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  delay?: number
  staggerChildren?: number
}
