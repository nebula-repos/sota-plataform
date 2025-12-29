import { Bell, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface DashboardHeaderProps {
  currentView: string
  onNavigate: (view: string) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
}

export function DashboardHeader({ currentView, onNavigate, searchQuery = "", setSearchQuery }: DashboardHeaderProps) {

  const handleNotificationClick = () => {
    toast("No new notifications", {
      description: "You're all caught up! We'll let you know when new high-impact signals arrive.",
      position: "top-right"
    })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 transition-colors">
      <div
        className="flex items-center gap-2 font-semibold cursor-pointer"
        onClick={() => onNavigate('feed')}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
          <span className="text-lg font-bold">S</span>
        </div>
        <span className="text-xl text-blue-900 dark:text-white">SotA</span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {setSearchQuery && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search signals..."
              className="w-64 bg-gray-50 dark:bg-gray-900 pl-9 border-gray-200 dark:border-gray-800 focus:border-blue-700 dark:focus:border-blue-500 focus:ring-blue-700/20 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 relative"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-gray-950"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${currentView === 'settings' ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full border border-gray-200 dark:border-gray-700 p-1 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 ${currentView === 'profile' ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
