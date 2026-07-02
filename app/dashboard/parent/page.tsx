"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Home, BookOpen, Trophy, Settings, LogOut, Bell, 
  User, Plus, ChevronRight, Star, Clock, TrendingUp,
  Calendar, Target, BarChart3, Users, CreditCard, X, Loader2, Key, Eye, Gamepad2
} from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { createClient } from "@/lib/supabase/client"
import { ChildManagementModal } from "@/components/parent/child-management-modal"

interface Child {
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

// Sidebar items - Curriculum href is dynamic based on selectedChild
const getSidebarItems = (childId?: string) => [
  { icon: Home, label: "Dashboard", href: "/dashboard/parent", active: true },
  { icon: Users, label: "My Children", href: "/dashboard/parent/children" },
  { icon: BookOpen, label: "Curriculum", href: childId ? `/dashboard/parent/curriculum?childId=${childId}` : "/dashboard/parent/curriculum" },
  { icon: BarChart3, label: "Progress Reports", href: "/dashboard/parent/reports" },
  { icon: Trophy, label: "Achievements", href: "/dashboard/parent/achievements" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/parent/schedule" },
  { icon: CreditCard, label: "Subscription", href: "/dashboard/parent/subscription" },
  { icon: Settings, label: "Settings", href: "/dashboard/parent/settings" },
]

export default function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [managingChild, setManagingChild] = useState<Child | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [parentName, setParentName] = useState("Parent")
  const [loading, setLoading] = useState(true)
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [newChildForm, setNewChildForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gradeLevel: ""
  })
  const [addingChild, setAddingChild] = useState(false)
  const [notAuthenticated, setNotAuthenticated] = useState(false)

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
      // Load parent profile
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

      // Load children
      const response = await fetch('/api/parent/children')
      if (response.ok) {
        const data = await response.json()
        if (data.children && Array.isArray(data.children)) {
          setChildren(data.children)
          if (data.children.length > 0) {
            setSelectedChild(data.children[0])
          }
        }
      }
    } catch (error) {
      console.log('[v0] Error loading data:', error)
    }

    setLoading(false)
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault()
    setAddingChild(true)

    try {
      // Validation
      if (!newChildForm.firstName.trim()) {
        alert('First name is required')
        setAddingChild(false)
        return
      }

      // Validate age (should be 2-7 years)
      if (newChildForm.dateOfBirth) {
        const birthDate = new Date(newChildForm.dateOfBirth)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        if (age < 2 || age > 7) {
          alert('Child age should be between 2 and 7 years')
          setAddingChild(false)
          return
        }
      }

      const response = await fetch('/api/parent/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newChildForm.firstName,
          lastName: newChildForm.lastName,
          dateOfBirth: newChildForm.dateOfBirth || null,
          gradeLevel: newChildForm.gradeLevel || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        console.log('[v0] Child created successfully:', data.child)
        
        // Add the new child to the list
        setChildren([...children, data.child])
        
        // Select the newly created child
        setSelectedChild(data.child)
        
        setShowAddChildModal(false)
        setNewChildForm({ 
          firstName: "", 
          lastName: "", 
          dateOfBirth: "", 
          gradeLevel: ""
        })
        
        // Show success message
        alert(`✓ Child profile created successfully!\n\nChild: ${data.child.profile.first_name}`)
      } else {
        const error = await response.json()
        console.error('[v0] API Error:', error)
        alert(error.error || 'Failed to add child')
      }
    } catch (error) {
      console.error('[v0] Error adding child:', error)
      alert('An error occurred while adding the child')
    }

    setAddingChild(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative shrink-0">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="GSTAT"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-primary">GSTAT</span>
                <span className="block text-[10px] text-muted-foreground">Parent Dashboard</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {getSidebarItems(selectedChild?.id).map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  item.active 
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
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <SignOutButton className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all w-full">
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {parentName}!</h1>
              <p className="text-sm text-muted-foreground">Here&apos;s how your children are doing</p>
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
                  <p className="text-sm font-medium">{parentName}</p>
                  <p className="text-xs text-muted-foreground">Parent Account</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Children Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Select Child:</span>
            <div className="flex gap-2 flex-wrap items-center">
              {children.map((child) => (
                <div key={child.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedChild(child)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      selectedChild?.id === child.id
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "bg-white text-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden flex items-center justify-center">
                      {child.profile?.avatar_url ? (
                        <Image src={child.profile.avatar_url} alt={child.profile?.first_name || "Child"} fill className="object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{child.profile?.first_name || "Child"}</span>
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setManagingChild(child)}
                    title="Manage child profile"
                  >
                    <Key className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <button 
                onClick={() => setShowAddChildModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Child</span>
              </button>
            </div>
          </div>

          {children.length === 0 ? (
            // Empty state
            <Card className="py-16">
              <CardContent className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <Image
                    src="/images/professor-whiskers-new.png"
                    alt="Professor Whiskers"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">No Children Added Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add your first child to start tracking their learning progress and achievements.
                </p>
                <Button 
                  onClick={() => setShowAddChildModal(true)}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Child
                </Button>
              </CardContent>
            </Card>
          ) : selectedChild && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-orange-400 to-amber-400 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Stars</p>
                        <p className="text-3xl font-bold mt-1">{selectedChild.total_stars || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-400 to-blue-500 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Badges Earned</p>
                        <p className="text-3xl font-bold mt-1">{selectedChild.total_badges || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-400 to-purple-500 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Grade Level</p>
                        <p className="text-3xl font-bold mt-1">{selectedChild.grade_level || "N/A"}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-400 to-emerald-500 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Learning Streak</p>
                        <p className="text-3xl font-bold mt-1">{selectedChild.current_streak || 0} Days</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Welcome Message */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardHeader>
                    <CardTitle>Welcome to Parent Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Track {selectedChild.profile?.first_name || "your child"}&apos;s learning progress and achievements. This dashboard shows real-time updates on stars earned, badges achieved, and learning streaks.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href={`/dashboard/parent/curriculum?childId=${selectedChild.id}`} className="inline-block">
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-white">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </Link>
                      <Link href={`/dashboard/parent/games?childId=${selectedChild.id}`} className="inline-block">
                        <Button variant="outline" className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 hover:opacity-90">
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Play Games
                        </Button>
                      </Link>
                      <Link href="/dashboard/parent/reports" className="inline-block col-span-2">
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Reports
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-amber-900">Stars</span>
                      <span className="text-2xl font-bold text-amber-600">{selectedChild.total_stars || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Badges</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedChild.total_badges || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Streak</span>
                      <span className="text-2xl font-bold text-green-600">{selectedChild.current_streak || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Child</CardTitle>
              <button 
                onClick={() => setShowAddChildModal(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddChild} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <Input
                    value={newChildForm.firstName}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    value={newChildForm.lastName}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    value={newChildForm.dateOfBirth}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Grade Level</label>
                  <select
                    value={newChildForm.gradeLevel}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, gradeLevel: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select grade</option>
                    <option value="0">Kindergarten</option>
                    <option value="1">1st Grade</option>
                    <option value="2">2nd Grade</option>
                    <option value="3">3rd Grade</option>
                    <option value="4">4th Grade</option>
                    <option value="5">5th Grade</option>
                    <option value="6">6th Grade</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddChildModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addingChild || !newChildForm.firstName}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                  >
                    {addingChild ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Child"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Child Management Modal */}
      {managingChild && (
        <ChildManagementModal
          child={managingChild}
          onClose={() => setManagingChild(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  )
}
