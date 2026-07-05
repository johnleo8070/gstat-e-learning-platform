"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  Home, BookOpen, Trophy, Settings, LogOut, Bell, 
  User, Calendar, BarChart3, Users, CreditCard, Loader2, Menu, X 
} from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Child {
  id: string
  profile_id: string
  profile?: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
  grade_level: number | null
  date_of_birth: string | null
  total_stars: number
  total_badges: number
  current_streak: number
}

interface ParentContextType {
  children: Child[]
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>
  selectedChild: Child | null
  setSelectedChild: (child: Child | null) => void
  parentName: string
  loading: boolean
  notAuthenticated: boolean
}

export const ParentContext = createContext<ParentContextType | undefined>(undefined)

export function useParentContext() {
  const context = useContext(ParentContext)
  if (context === undefined) {
    throw new Error("useParentContext must be used within a ParentDashboardShell")
  }
  return context
}

const getSidebarItems = (childId?: string) => [
  { icon: Home, label: "Dashboard", href: "/dashboard/parent" },
  { icon: Users, label: "My Children", href: "/dashboard/parent/children" },
  { icon: BookOpen, label: "Curriculum", href: childId ? `/dashboard/parent/curriculum?childId=${childId}` : "/dashboard/parent/curriculum" },
  { icon: BarChart3, label: "Progress Reports", href: "/dashboard/parent/reports" },
  { icon: Trophy, label: "Achievements", href: "/dashboard/parent/achievements" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/parent/schedule" },
  { icon: BookOpen, label: "Worksheets", href: "/dashboard/parent/worksheets" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/parent/subscription" },
  { icon: Settings, label: "Settings", href: "/dashboard/parent/settings" },
]

export function ParentDashboardShell({ children: content }: { children: React.ReactNode }) {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [parentName, setParentName] = useState("Parent")
  const [loading, setLoading] = useState(true)
  const [notAuthenticated, setNotAuthenticated] = useState(false)
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const pathname = usePathname()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  async function checkAuthAndLoadData() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      setNotAuthenticated(true)
      return
    }
    
    loadData()
  }

  async function loadData() {
    setLoading(true)
    const supabase = await createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          setParentName(profile.first_name || 'Parent')
        }
      }

      const response = await fetch('/api/parent/children')
      if (response.ok) {
        const data = await response.json()
        if (data.children && Array.isArray(data.children)) {
          setChildren(data.children)
          // Try to select the first child if not selected
          if (data.children.length > 0 && !selectedChild) {
            setSelectedChild(data.children[0])
          }
        }
      }
    } catch (error) {
      console.log('[v0] Error loading data:', error)
    }

    setLoading(false)
  }

  if (notAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You need to be logged in to access the parent dashboard.</p>
            <Link href="/login?redirect=/dashboard/parent">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false)
    }
  }

  const activeChildId = selectedChild?.id
  const sidebarItems = getSidebarItems(activeChildId)

  return (
    <ParentContext.Provider value={{ children, setChildren, selectedChild, setSelectedChild, parentName, loading, notAuthenticated }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex">
        
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 
          ${sidebarOpen ? "w-64" : "w-20"} 
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={handleLinkClick}>
              <div className="w-10 h-10 relative shrink-0">
                <Image
                  src="/images/professor-whiskers-new.png"
                  alt="GSTAT"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              {sidebarOpen && (
                <div className="md:block block">
                  <span className="font-bold text-primary">GSTAT</span>
                  <span className="block text-[10px] text-muted-foreground">Parent Dashboard</span>
                </div>
              )}
            </Link>
            
            {/* Close button for mobile */}
            <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon
              // Active state based on pathname prefix for inner pages
              const isActive = pathname === item.href || (item.href !== "/dashboard/parent" && pathname.startsWith(item.href.split('?')[0]))
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-0 right-0 px-4 bg-white pt-2">
            <SignOutButton className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all w-full">
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm">Logout</span>}
            </SignOutButton>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} w-full`}>
          {/* Top Bar */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 rounded-lg bg-muted text-foreground"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-foreground">Welcome back, {parentName}!</h1>
                  <p className="text-sm text-muted-foreground">Here's how your children are doing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium truncate max-w-[120px]">{parentName}</p>
                    <p className="text-xs text-muted-foreground">Parent Account</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Children Layout Content */}
          <main className="w-full">
            {content}
          </main>
        </div>
      </div>
    </ParentContext.Provider>
  )
}
