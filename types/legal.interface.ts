export interface LegalSectionItem {
  title: string
  body?: string | string[]
  list?: string[]
  email?: string
  note?: string
  effective?: string
  items?: string[] // For privacy page specific structure
}

export interface LegalCopy {
  hero: {
    title: string
    subtitle?: string
    effective?: string
    reviewed?: string
  }
  sections: LegalSectionItem[] | Record<string, LegalSectionItem>
  cta: {
    title: string
    prefix: string
    email: string
    suffix: string
  }
}
