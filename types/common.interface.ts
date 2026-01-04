export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface HeroSectionProps extends BaseComponentProps {
  eyebrow?: string
  title: string | React.ReactNode
  subtitle?: string
  primaryCta?: React.ReactNode
  secondaryCta?: React.ReactNode
  blobs?: boolean
}

export interface PageSectionProps extends BaseComponentProps {
  variant?: "default" | "alternate" | "glow"
  blobs?: boolean
}

export interface SectionHeaderProps extends BaseComponentProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}
