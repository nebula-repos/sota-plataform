
export type ContactFormCopy = {
  eyebrow?: string
  title: string
  description: string
  fields: {
    name: string
    email: string
    company: string
    phone: string
    industry: string
    help: string
    message: string
  }
  placeholders: {
    name: string
    email: string
    company: string
    phone: string
    industry: string
    help: string
    message: string
  }
  consent: string
  submit: string
  success: string
  error: string
}
