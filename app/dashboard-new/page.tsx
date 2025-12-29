"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "./_components/dashboard-header"
import { SignalCard, SignalType } from "./_components/signal-card"
import { SignalSelector, FilterState } from "./_components/signal-selector"
import { RevenueChart } from "./_components/charts/revenue-chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, User, Bell, Shield, Key, CreditCard, Sparkles, Users, UserPlus, MoreVertical, Trash2, Moon, Sun } from "lucide-react"
import { Toaster, toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockSignals = [
  {
    id: 1,
    type: "industrial" as SignalType,
    title: "Competitor 'X' launches AI-driven analytics suite",
    source: "TechCrunch",
    date: "2 hours ago",
    impact: "high" as const,
    trend: "down" as const,
    description: "Competitor X has announced a full rollout of their new analytics suite which directly overlaps with our 'Insights' module. Early reviews suggest lower pricing.",
  },
  {
    id: 2,
    type: "pricing" as SignalType,
    title: "SaaS Market Index: median seat price increased by 12%",
    source: "SaaS Capital",
    date: "1 day ago",
    impact: "medium" as const,
    trend: "up" as const,
    description: "Across the vertical, B2B SaaS seat prices have seen a steady increase. This suggests an opportunity to adjust our Enterprise tier pricing.",
    hasChart: true,
  },
  {
    id: 3,
    type: "academic" as SignalType,
    title: "New Transformer architecture reduces inference cost by 40%",
    source: "arXiv.org",
    date: "3 days ago",
    impact: "high" as const,
    trend: "neutral" as const,
    description: "A new paper form MIT researchers proposes 'Sparse-Attention-v2' which could significantly reduce our infrastructure costs if adopted.",
  },
  {
    id: 4,
    type: "regulation" as SignalType,
    title: "EU AI Act: Compliance deadline approached for High-Risk systems",
    source: "Official Journal of the EU",
    date: "1 week ago",
    impact: "high" as const,
    trend: "neutral" as const,
    description: "The grace period for high-risk AI systems is ending. We need to audit our 'Predictive Scoring' feature to ensure full compliance.",
  },
  {
    id: 5,
    type: "competitor" as SignalType,
    title: "Competitor 'Y' raises Series B to expand in APAC",
    source: "VentureBeat",
    date: "1 week ago",
    impact: "medium" as const,
    trend: "neutral" as const,
    description: "Competitor Y has secured $40M to open offices in Singapore and Tokyo. This might affect our Q3 expansion plans in the region.",
  },
]

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@corp.inc", role: "Admin", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@corp.inc", role: "Editor", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@corp.inc", role: "Viewer", status: "Invited" },
]

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('feed')
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddSignalOpen, setIsAddSignalOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<typeof mockSignals[0] | null>(null)
  const [savedSignalIds, setSavedSignalIds] = useState<number[]>([])
  const [currentViewFilter, setCurrentViewFilter] = useState<string | undefined>(undefined)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [filters, setFilters] = useState<FilterState>({
    all: true,
    academic: false,
    industrial: false,
    pricing: false,
    competitor: false,
    regulation: false,
  })

  // Simulated handlers
  const handleAddSignal = () => {
    setIsAddSignalOpen(false)
    toast.success("Signal requested successfully", {
      description: "Our team will start tracking this new source immediately."
    })
  }

  const handleSettingAction = (actionName: string) => {
    toast(`Action: ${actionName}`, {
      description: "This is a mock action for demonstration purposes.",
    })
  }

  const handleToggleSignalSave = (id: number) => {
    setSavedSignalIds(prev => {
      if (prev.includes(id)) {
        toast.info("Signal removed from saved items")
        return prev.filter(sid => sid !== id)
      } else {
        toast.success("Signal saved to your list")
        return [...prev, id]
      }
    })
  }

  const handleViewFilterChange = (view: string) => {
    setCurrentViewFilter(view === currentViewFilter ? undefined : view)
    if (view === 'competitor_watch') {
      setFilters({
        all: false,
        academic: false,
        industrial: false,
        pricing: false,
        competitor: true,
        regulation: false
      })
    }
  }

  const handleToggle = (key: string) => {
    setCurrentViewFilter(undefined)

    if (key === "all") {
      setFilters({
        all: true,
        academic: false,
        industrial: false,
        pricing: false,
        competitor: false,
        regulation: false,
      })
      return
    }

    setFilters((prev) => {
      const newState = { ...prev, [key]: !prev[key], all: false }
      const anyActive = Object.values(newState).some((v) => v)
      if (!anyActive) return { ...newState, all: true }
      return newState
    })
  }

  const filteredSignals = mockSignals.filter((signal) => {
    if (searchQuery && !signal.title.toLowerCase().includes(searchQuery.toLowerCase()) && !signal.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (currentViewFilter === 'saved') {
      return savedSignalIds.includes(signal.id)
    }
    if (filters.all) return true
    return filters[signal.type]
  })

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

        <div className="flex">
          {/* Sidebar only shows on Feed view */}
          {currentView === 'feed' && isSidebarOpen && (
            <div className="animate-in slide-in-from-left duration-300">
              <SignalSelector
                filters={filters}
                onToggle={handleToggle}
                currentViewFilter={currentViewFilter}
                onViewFilterChange={handleViewFilterChange}
              />
            </div>
          )}

          {/* Main Content Area */}
          <main className={`flex-1 p-8 bg-gray-50/30 dark:bg-gray-900/50 ${currentView !== 'feed' ? 'bg-white dark:bg-gray-950' : ''}`}>
            <div className={`mx-auto transition-all duration-300 ${isSidebarOpen ? 'max-w-5xl' : 'max-w-6xl'}`}>

              {currentView === 'feed' && (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-blue-950 dark:text-blue-100">
                        {currentViewFilter === 'saved' ? 'Saved Signals' : 'Intelligence Feed'}
                      </h1>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {currentViewFilter === 'saved' ? 'Your personal collection of bookmarked signals.' : "Real-time signals tailored to your organization's context."}
                      </p>
                    </div>
                    <Button
                      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-900/10 dark:shadow-blue-900/20"
                      onClick={() => setIsAddSignalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4 text-amber-300" />
                      Add Custom Signal
                    </Button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 animate-in fade-in duration-500">
                    {filteredSignals.map((signal) => (
                      <SignalCard
                        key={signal.id}
                        type={signal.type}
                        title={signal.title}
                        source={signal.source}
                        date={signal.date}
                        impact={signal.impact}
                        trend={signal.trend}
                        description={signal.description}
                        onViewDetails={() => setSelectedSignal(signal)}
                        onSave={() => handleToggleSignalSave(signal.id)}
                        isSaved={savedSignalIds.includes(signal.id)}
                      >
                        {signal.hasChart && (
                          <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Trend Analysis</span>
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+12% vs last Q</span>
                            </div>
                            <RevenueChart />
                          </div>
                        )}
                      </SignalCard>
                    ))}
                  </div>

                  {filteredSignals.length === 0 && (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <p className="text-gray-400 font-medium">No signals found {searchQuery ? `for "${searchQuery}"` : "for this selection"}.</p>
                      <Button variant="link" onClick={() => { handleToggle('all'); setSearchQuery(""); setCurrentViewFilter(undefined) }} className="mt-2 text-blue-700 dark:text-blue-400">
                        Clear filters
                      </Button>
                    </div>
                  )}
                </>
              )}

              {currentView === 'settings' && (
                <div className="max-w-3xl mx-auto py-8">
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
                        {mockUsers.map((user, idx) => (
                          <div key={user.id} className={`flex items-center justify-between p-4 ${idx !== mockUsers.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-sm font-bold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                {user.status}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">{user.role}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleSettingAction(`Edit ${user.name}`)}>Edit Role</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleSettingAction(`Remove ${user.name}`)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
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
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-4xl font-bold">
                      JD
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">John Doe</h2>
                      <p className="text-gray-500 dark:text-gray-400">Senior Analyst @ Corporation Inc.</p>
                      <div className="mt-2 flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-700/30">Admin</span>
                        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-600/30">Pro Plan</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Key className="h-5 w-5 text-gray-400" />
                        Security Credentials
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-600 dark:text-gray-400">Email</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">john.doe@corp.inc</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-600 dark:text-gray-400">Password</span>
                          <Button variant="link" className="text-blue-700 dark:text-blue-400 h-auto p-0" onClick={() => handleSettingAction('Change Password')}>Change</Button>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">2FA</span>
                          <span className="text-green-600 font-medium text-sm bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

        {/* View Details Sheet */}
        <Sheet open={!!selectedSignal} onOpenChange={(open) => !open && setSelectedSignal(null)}>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white dark:bg-gray-950 dark:border-gray-800 text-gray-900 dark:text-gray-100">
            {selectedSignal && (
              <>
                <SheetHeader className="mb-6">
                  <span className="inline-flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {selectedSignal.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{selectedSignal.date}</span>
                  </span>
                  <SheetTitle className="text-2xl font-bold leading-tight dark:text-white">{selectedSignal.title}</SheetTitle>
                  <SheetDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                    Source: {selectedSignal.source}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      AI Summary
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {selectedSignal.description}
                      <br /><br />
                      This event is significant because it directly impacts your current roadmap. The timing suggests a strategic move to capture market share before Q4.
                    </p>
                  </div>

                  {selectedSignal.hasChart && (
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Historical Trend</h4>
                      <RevenueChart />
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-lg hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-sm transition-all cursor-pointer">
                        <div className="mt-0.5 h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0" />
                        Share brief with Product Team
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-lg hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-sm transition-all cursor-pointer">
                        <div className="mt-0.5 h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0" />
                        Update competitive analysis deck
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  <Button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700">Mark as Read</Button>
                  <Button variant="outline" className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Share</Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
