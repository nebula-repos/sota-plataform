import { BaseComponentProps } from "./common.interface"
import { LucideIcon } from "lucide-react"

export interface FeatureCardProps extends BaseComponentProps {
  icon?: React.ElementType | LucideIcon
  title: string
  description?: string
  value?: string | number
  className?: string
  children?: React.ReactNode
  headerElement?: React.ReactNode
}

export interface TeamMember {
  name: string
  role: string
  title: string
}

export interface TeamCardProps extends BaseComponentProps {
  member: TeamMember
}

export interface CTASectionProps extends BaseComponentProps {
  title: string
  description: string
  primaryCta: React.ReactNode
  secondaryCta?: React.ReactNode
}

export interface WorkflowStepProps extends BaseComponentProps {
  index: number
  title: string
  description: string
  isLast?: boolean
}

export interface SocialLink {
  label: string
  handle: string
  url: string
}

export interface InfoCardProps extends BaseComponentProps {
  title: string
  description?: string
  response?: string
  items?: Array<{ label: string; description: string; value: string }>
  socials?: SocialLink[]
  tone?: "dark" | "light"
}
