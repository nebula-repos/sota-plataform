"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "./_components/dashboard-header"
import { SignalList } from "./_components/signal-selector"
import { SignalDetailView } from "./_components/signal-detail-view"
// import { enrichedSignals } from "./_lib/mock-data" // Removed mock data
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Bell, Shield, Key, Users, UserPlus, MoreVertical, Trash2, Moon, Sun, LogOut } from "lucide-react"
import { Toaster, toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define Signal Interface (matching what components expect)
interface Signal {
  id: number | string // Handle both for now
  type: string
  title: string
  summary: string
  score: number
  source: string
  date: string
  time: string
  description?: string
  fullAnalysis?: string
  metrics?: any[]
  sources?: any[]
  relatedSignals?: any[]
  chartType?: string
  revenueData?: any
  correlationData?: any
  marketMapData?: any
  tableData?: any
  impact?: 'high' | 'medium' | 'low'
}

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@corp.inc", role: "Admin", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@corp.inc", role: "Editor", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@corp.inc", role: "Viewer", status: "Invited" },
]

interface ProfileData {
  fullName: string
  email: string
  role: string
  orgName: string
  planName: string
}


interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: string
  type: 'user' | 'invitation'
  initials: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState('feed')
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddSignalOpen, setIsAddSignalOpen] = useState(false)

  // Real Signals State
  const [signals, setSignals] = useState<Signal[]>([])
  const [selectedSignalId, setSelectedSignalId] = useState<number | string | null>(null)

  const [savedSignalIds, setSavedSignalIds] = useState<number[]>([])
  const [currentViewFilter, setCurrentViewFilter] = useState<string | undefined>(undefined)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)

  // Team Management State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("user")
  const [inviteLoading, setInviteLoading] = useState(false)

  const fetchSignals = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('signals')
      .select('*')
      .order('published_at', { ascending: false })

    if (!error && data) {
      const mapped: Signal[] = data.map(s => {
        const meta = s.metadata || {}
        return {
          id: s.id,
          type: s.type_id || 'market',
          title: s.title,
          summary: s.content?.substring(0, 150) || "No summary available.",
          score: meta.score || 95,
          source: meta.source || "SotA Intelligence",
          date: new Date(s.published_at || s.created_at).toLocaleDateString(),
          time: new Date(s.published_at || s.created_at).toLocaleTimeString(),
          fullAnalysis: s.content || "Full analysis content would appear here.",
          metrics: meta.metrics || [
            { label: "Relevance", value: "High", trend: "positive", change: "+5%" },
            { label: "Urgency", value: "Immediate", trend: "neutral", change: "0%" },
          ],
          sources: meta.sources || [
            { name: "Source A", url: "#" }
          ],
          relatedSignals: meta.relatedSignals || [],
          impact: meta.impact || 'medium',
          chartType: meta.chartType,
          revenueData: meta.revenueData,
          correlationData: meta.correlationData,
          marketMapData: meta.marketMapData,
          tableData: meta.tableData
        }
      })
      setSignals(mapped)

      // Select first if none selected
      if (mapped.length > 0 && !selectedSignalId) {
        setSelectedSignalId(mapped[0].id)
      }
    }
  }

  const fetchTeamData = async () => {
    const supabase = createClient()

    // Fetch Users (RLS filters for same org)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('full_name')

    // Fetch Invitations (RLS filters for same org)
    const { data: invitations, error: invitesError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at')

    if (!usersError && !invitesError) {
      const formattedUsers: TeamMember[] = (users || []).map(u => ({
        id: u.id,
        name: u.full_name || u.email,
        email: u.email,
        role: u.role,
        status: 'Active',
        type: 'user',
        initials: (u.full_name || u.email || 'U').substring(0, 2).toUpperCase()
      }))

      const formattedInvites: TeamMember[] = (invitations || []).map(i => ({
        id: i.id,
        name: i.email, // No name yet
        email: i.email,
        role: i.role,
        status: 'Invited',
        type: 'invitation',
        initials: (i.email || 'I').substring(0, 2).toUpperCase()
      }))

      setTeamMembers([...formattedUsers, ...formattedInvites])
    }
  }


  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Fetch public user data + organization info
        const { data: userData, error } = await supabase
          .from('users')
          .select(`
            full_name, 
            email, 
            role, 
            organizations (
              name,
              plan_id
            )
          `)
          .eq('id', user.id)
          .single()

        if (userData && !error) {
          // @ts-ignore - Supabase types inference might need distinct type generation, explicit casting for now
          const org = Array.isArray(userData.organizations) ? userData.organizations[0] : userData.organizations

          let planName = "Free"
          if (org?.plan_id) {
            const { data: planData } = await supabase
              .from('pricing_plans')
              .select('name')
              .eq('id', org.plan_id)
              .single()
            if (planData) planName = planData.name
          }

          setProfileData({
            fullName: userData.full_name || user.email || "User",
            email: userData.email,
            role: userData.role,
            orgName: org?.name || "No Organization",
            planName: planName
          })
          fetchTeamData()
          fetchSignals()
        }
      }
    }
    fetchProfile()
  }, [])

  // Handlers
  const handleAddSignal = () => {
    setIsAddSignalOpen(false)
    toast.success("Signal requested successfully", {
      description: "Our team will start tracking this new source immediately."
    })
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setChangePasswordLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated successfully")
      setIsChangePasswordOpen(false)
      setNewPassword("")
      setConfirmNewPassword("")
    }
    setChangePasswordLoading(false)
  }

  const handleInviteUser = async () => {
    setInviteLoading(true)
    const supabase = createClient()

    // Get organization ID from current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
    if (!userData?.organization_id) {
      toast.error("Organization not found")
      setInviteLoading(false)
      return
    }

    const { error } = await supabase.from('user_invitations').insert({
      email: inviteEmail,
      role: inviteRole,
      organization_id: userData.organization_id,
      status: 'pending'
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Invitation sent to ${inviteEmail}`)
      setIsInviteUserOpen(false)
      setInviteEmail("")
      fetchTeamData() // Refresh list
    }
    setInviteLoading(false)
  }

  const handleUpdateMemberRole = async (member: TeamMember, newRole: string) => {
    const supabase = createClient()

    if (member.type === 'invitation') {
      // Update invitation
      const { error } = await supabase
        .from('user_invitations')
        .update({ role: newRole })
        .eq('id', member.id)

      if (error) toast.error("Failed to update invitation")
      else {
        toast.success("Role updated")
        fetchTeamData()
      }
    } else {
      // Update User
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', member.id)

      if (error) toast.error(error.message)
      else {
        toast.success("User role updated")
        fetchTeamData()
      }
    }
  }

  const handleRemoveMember = async (member: TeamMember) => {
    const supabase = createClient()

    if (member.type === 'invitation') {
      const { error } = await supabase.from('user_invitations').delete().eq('id', member.id)
      if (error) toast.error("Failed to delete invitation")
      else {
        toast.success("Invitation canceled")
        fetchTeamData()
      }
    } else {
      // Delete User (Requires the new DELETE policy)
      const { error } = await supabase.from('users').delete().eq('id', member.id)
      if (error) toast.error(error.message)
      else {
        toast.success("User removed from organization")
        fetchTeamData()
      }
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    toast.success("Logged out successfully")
  }

  const handleSettingAction = (actionName: string) => {
    if (actionName === 'Change Password') {
      setIsChangePasswordOpen(true)
      return
    }
    if (actionName === 'Invite User') {
      setIsInviteUserOpen(true)
      return
    }
    // Handle "Edit Role [Name]" or "Remove [Name]" logic?
    // The dropdown items call this with formatted strings. 
    // I should refactor the dropdowns to call new handlers directly if possible, or parse string.
    // Parsing string is brittle. Better to update the dropdowns in the UI render.

    toast(`Action: ${actionName}`, {
      description: "This is a mock action for demonstration purposes.",
    })
  }

  const handleToggleSignalSave = (id: number | string) => {
    setSavedSignalIds(prev => {
      const isCurrentlySaved = prev.includes(id as number) // Cast to number for now, assuming savedSignalIds stores numbers

      // Perform side effect immediately based on current state check
      // Note in strict mode this updater might run twice but we only want to toast once.
      // Better approach: Calculate next state then toast.

      if (isCurrentlySaved) {
        // We can't put toast here safely in Strict Mode if we want it once.
        return prev.filter(sid => sid !== id)
      } else {
        return [...prev, id as number] // Cast to number for now
      }
    })

    // Check current state outside updater to fire toast
    if (savedSignalIds.includes(id as number)) { // Cast to number for now
      toast.info("Signal removed from saved items")
    } else {
      toast.success("Signal saved to your list")
    }
  }

  const handleViewFilterChange = (view: string) => {
    setCurrentViewFilter(view === currentViewFilter ? undefined : view)
  }

  const handleSelectSignal = (id: number | string) => {
    setSelectedSignalId(id)
    // Only close sidebar on mobile if we were supporting mobile, but for now keep open
  }

  const selectedSignal = signals.find(s => s.id === selectedSignalId) || signals[0] || null

  return (
    // Apply dark class to wrapper if enabled
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50/30`}>
      <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Toaster position="top-center" richColors theme={isDarkMode ? 'dark' : 'light'} />
        <DashboardHeader
          currentView={currentView}
          onNavigate={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          {/* Sidebar only shows on Feed view */}
          {currentView === 'feed' && (
            <div
              className={`
                        hidden lg:block relative
                        transition-all duration-300 ease-in-out
                        overflow-hidden
                        ${isSidebarOpen ? 'w-80 opacity-100 border-r border-gray-200 dark:border-gray-800' : 'w-0 opacity-0 border-none'}
                    `}
            >
              <div className="w-80 h-full">
                <SignalList
                  signals={signals}
                  selectedSignalId={selectedSignalId}
                  onSelectSignal={handleSelectSignal}
                  currentViewFilter={currentViewFilter}
                  onViewFilterChange={handleViewFilterChange}
                  savedSignalIds={savedSignalIds}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className={`flex-1 min-w-0 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/50 ${currentView !== 'feed' ? 'bg-white dark:bg-gray-950 p-8' : ''}`}>

            {currentView === 'feed' && (
              <div className="h-full">
                {selectedSignal ? (
                  <div className="p-8 h-full">
                    <SignalDetailView
                      signal={selectedSignal}
                      onToggleSave={handleToggleSignalSave}
                      isSaved={savedSignalIds.includes(selectedSignal.id)}
                      onSelectSignal={handleSelectSignal}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p>Select a signal to view details</p>
                  </div>
                )}

                {/* Floating Action Button for Add Signal */}
                <div className="fixed bottom-8 right-8 z-50">
                  <Button
                    className="h-14 w-14 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-xl shadow-blue-900/20 flex items-center justify-center p-0"
                    onClick={() => setIsAddSignalOpen(true)}
                  >
                    <Plus className="h-6 w-6 text-amber-300" />
                  </Button>
                </div>
              </div>
            )}

            {currentView === 'settings' && (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-100">Settings</h1>
                </div>

                <div className="space-y-6">
                  {/* Appearance Section for Dark Mode */}
                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg">
                          {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Customize the look and feel of your dashboard.</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                      </Button>
                    </div>
                  </div>

                  {/* User Management Section */}
                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm transition-colors">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-lg">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage users and access roles for your enterprise.</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleSettingAction("Invite User")} className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite User
                      </Button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                      {teamMembers.map((member, idx) => (
                        <div key={member.id} className={`flex items-center justify-between p-4 ${idx !== teamMembers.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-sm font-bold">
                              {member.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                              {member.status}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right capitalize">{member.role}</span>

                            {/* Only Admins can manage users - For now assum active user is admin or we show partial options */}
                            {/* Assuming current user can manage everyone except themselves eventually */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUpdateMemberRole(member, member.role === 'admin' ? 'user' : 'admin')}>
                                  {member.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {member.type === 'invitation' ? 'Cancel Invite' : 'Remove User'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      {teamMembers.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No team members found. Invite someone!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage how you receive alerts for high-impact signals.</p>
                        <Button variant="outline" className="mt-4 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => handleSettingAction('Configure Notifications')}>Configure</Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Security</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Control data sharing settings and audit logs.</p>
                        <Button variant="outline" className="mt-4 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => handleSettingAction('Manage Privacy')}>Manage</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'profile' && (
              <div className="max-w-2xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-blue-950 dark:text-blue-100 mb-6">User Profile</h1>
                {profileData ? (
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-4xl font-bold">
                      {profileData.fullName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{profileData.fullName}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{profileData.role} @ {profileData.orgName}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-700/30 capitalize">{profileData.role}</span>
                        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-600/30 capitalize">{profileData.planName}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse flex items-center gap-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                    <div className="space-y-3">
                      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Key className="h-5 w-5 text-gray-400" />
                      Security Credentials
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Email</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{profileData?.email || 'Loading...'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Password</span>
                        <Button variant="link" className="text-blue-700 dark:text-blue-400 h-auto p-0" onClick={() => handleSettingAction('Change Password')}>Change</Button>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400">2FA</span>
                        <span className="text-yellow-600 font-medium text-sm bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded">Coming Soon</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Add Signal Dialog */}
        <Dialog open={isAddSignalOpen} onOpenChange={setIsAddSignalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-950 dark:border-gray-800 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>Add Custom Signal</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Define a new intelligence source or topic you want to track.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="topic" className="dark:text-gray-300">Topic / Entity</Label>
                <Input id="topic" placeholder="e.g. Competitor X, Generative AI Regulation" className="dark:bg-gray-900 dark:border-gray-700 text-white" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="dark:text-gray-300">Description (Optional)</Label>
                <Textarea id="description" placeholder="What specific information are you looking for?" className="dark:bg-gray-900 dark:border-gray-700 text-white" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSignalOpen(false)} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</Button>
              <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleAddSignal}>Request Signal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite User Dialog */}
        <Dialog open={isInviteUserOpen} onOpenChange={setIsInviteUserOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-950 dark:border-gray-800 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email" className="dark:text-gray-300">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role" className="dark:text-gray-300">Role</Label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteUserOpen(false)} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</Button>
              <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleInviteUser} disabled={inviteLoading}>
                {inviteLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-950 dark:border-gray-800 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Update your account password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="dark:text-gray-300">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password" className="dark:text-gray-300">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</Button>
              <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleChangePassword} disabled={changePasswordLoading}>
                {changePasswordLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
