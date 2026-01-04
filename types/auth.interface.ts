export interface SignupCopy {
  badge: string
  headline: string
  subhead: string
  badgeFooter: string
  cardTitle: string
  cardDescription: string
  orgNameLabel: string
  orgNamePlaceholder: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  confirmPasswordLabel: string
  submitLoading: string
  submit: string
  loginPrompt: string
  loginCta: string
  passwordMismatch: string
  genericError: string
}

export interface SignupClientProps {
  copy: SignupCopy
}

export interface LoginCopy {
  badge: string
  headline: string
  subhead: string
  badgeFooter: string
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  submitLoading: string
  submit: string
  signupPrompt: string
  signupCta: string
  genericError: string
}

export interface LoginClientProps {
  copy: LoginCopy
}
