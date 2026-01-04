export interface ProfileData {
  fullName: string
  email: string
  role: string
  orgName: string
  planName: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  type: 'user' | 'invitation'
  initials: string
}
