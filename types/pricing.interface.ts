export interface PricingPlan {
  id: string
  tag?: string | null
  name: string
  price: string
  implementationFee?: string | null
  originalPrice?: string | null
  highlightLabel?: string | null
  description: string
  features: string[]
  cta: string
}

import { BaseComponentProps } from "./common.interface"

export interface PricingCardProps extends BaseComponentProps {
  plan: PricingPlan
}
