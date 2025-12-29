"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "./_components/dashboard-header"
import { SignalList } from "./_components/signal-selector"
import { SignalDetailView } from "./_components/signal-detail-view"
import { enrichedSignals, Signal } from "./_lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, User, Bell, Shield, Key, Users, UserPlus, MoreVertical, Trash2, Moon, Sun } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@corp.inc", role: "Admin", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@corp.inc", role: "Editor", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@corp.inc", role: "Viewer", status: "Invited" },
]

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('feed')
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddSignalOpen, setIsAddSignalOpen] = useState(false)
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(enrichedSignals[0].id)
  const [savedSignalIds, setSavedSignalIds] = useState<number[]>([])
  const [currentViewFilter, setCurrentViewFilter] = useState<string | undefined>(undefined)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Handlers
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
      const isCurrentlySaved = prev.includes(id)

      // Perform side effect immediately based on current state check
      // Note in strict mode this updater might run twice but we only want to toast once.
      // Better approach: Calculate next state then toast.

      if (isCurrentlySaved) {
        // We can't put toast here safely in Strict Mode if we want it once.
        return prev.filter(sid => sid !== id)
      } else {
        return [...prev, id]
      }
    })

    // Check current state outside updater to fire toast
    if (savedSignalIds.includes(id)) {
      toast.info("Signal removed from saved items")
    } else {
      toast.success("Signal saved to your list")
    }
  }

  const handleViewFilterChange = (view: string) => {
    setCurrentViewFilter(view === currentViewFilter ? undefined : view)
  }

  const handleSelectSignal = (id: number) => {
    setSelectedSignalId(id)
    // Only close sidebar on mobile if we were supporting mobile, but for now keep open
  }

  const selectedSignal = enrichedSignals.find(s => s.id === selectedSignalId) || enrichedSignals[0]

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
      </div>
    </div>
  )
}
