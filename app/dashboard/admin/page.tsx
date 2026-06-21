"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Home, LogOut, Bell, Settings, Users, CreditCard, BarChart3, CheckCircle, Clock, XCircle,
  Search, Filter, Download, RefreshCw, ChevronRight, AlertCircle
} from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { createClient } from "@/lib/supabase/client"

type AdminTab = "overview" | "parents" | "payments" | "subscriptions" | "analytics"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [adminName, setAdminName] = useState("Admin")
  const [loading, setLoading] = useState(true)
  const [notAuthenticated, setNotAuthenticated] = useState(false)

  // State for each section
  const [parents, setParents] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

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

    // Check if user is admin using user_metadata
    const isAdmin = session.user.user_metadata?.role === 'admin'
    
    if (!isAdmin) {
      setNotAuthenticated(true)
      return
    }

    // Get admin profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('user_id', session.user.id)
      .single()

    if (profile?.first_name) {
      setAdminName(profile.first_name)
    }

    await loadData()
  }

  async function loadData() {
    setLoading(true)
    const supabase = await createClient()

    try {
      // Load parents - fetch from auth.users and join with profiles
      const { data: { users } } = await supabase.auth.admin.listUsers()
      
      // Filter parent users (those with parent role in metadata)
      const parentUsers = users?.filter(u => u.user_metadata?.role === 'parent') || []
      
      // Get profile info for each parent
      const parentProfiles = await Promise.all(
        parentUsers.map(async (user) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('user_id', user.id)
            .single()
          
          return {
            id: profile?.id || user.id,
            user_id: user.id,
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            email: user.email,
            created_at: user.created_at
          }
        })
      )

      setParents(parentProfiles)

      // Load pending payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          payment_method,
          transaction_reference,
          bank_name,
          created_at,
          parent:parent_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      setPayments(paymentsData || [])

      // Load subscriptions
      const { data: subscriptionsData } = await supabase
        .from('parent_subscriptions')
        .select(`
          id,
          status,
          start_date,
          end_date,
          parent:parent_id(first_name, last_name),
          package:package_id(name, price)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      setSubscriptions(subscriptionsData || [])

      // Calculate analytics
      const pendingPaymentsCount = paymentsData?.filter(p => p.status === 'pending').length || 0
      const approvedPaymentsCount = paymentsData?.filter(p => p.status === 'approved').length || 0
      const totalRevenue = paymentsData
        ?.filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const activeSubscriptions = subscriptionsData?.filter(s => s.status === 'active').length || 0

      setAnalytics({
        totalParents: parentsData?.length || 0,
        totalPayments: paymentsData?.length || 0,
        pendingPayments: pendingPaymentsCount,
        approvedPayments: approvedPaymentsCount,
        totalRevenue,
        activeSubscriptions
      })
    } catch (error) {
      console.error('[v0] Error loading admin data:', error)
    }

    setLoading(false)
  }

  async function approvePayment(paymentId: string, parentName: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('payments')
      .update({ status: 'approved', verified_at: new Date().toISOString() })
      .eq('id', paymentId)

    if (!error) {
      alert(`Payment approved for ${parentName}`)
      await loadData()
    } else {
      alert('Failed to approve payment')
    }
  }

  async function rejectPayment(paymentId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('payments')
      .update({ status: 'rejected' })
      .eq('id', paymentId)

    if (!error) {
      alert('Payment rejected')
      await loadData()
    } else {
      alert('Failed to reject payment')
    }
  }

  if (notAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You do not have permission to access the admin dashboard.</p>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg">GSTAT Admin</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-white/10 rounded">
            <ChevronRight className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'parents', label: 'Parents', icon: Users },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'subscriptions', label: 'Subscriptions', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                activeTab === id ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          <Link href="/settings">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </Link>
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-all">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {adminName}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {adminName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Parents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics?.totalParents || 0}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{analytics?.pendingPayments || 0}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Approved Payments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{analytics?.approvedPayments || 0}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">${(analytics?.totalRevenue || 0).toFixed(2)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{analytics?.activeSubscriptions || 0}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics?.totalPayments || 0}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Parents Tab */}
              {activeTab === 'parents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Parent Accounts</h2>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {parents.length === 0 ? (
                          <p className="text-muted-foreground">No parents found</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="border-b border-border">
                                <tr>
                                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                                  <th className="text-left py-3 px-4 font-semibold">Joined</th>
                                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parents.map((parent) => (
                                  <tr key={parent.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-3 px-4">{parent.first_name} {parent.last_name}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{parent.email || 'N/A'}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{new Date(parent.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-right">
                                      <Button variant="outline" size="sm">View</Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Payment Verification</h2>
                    <Button onClick={loadData} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {payments.length === 0 ? (
                          <p className="text-muted-foreground">No payments found</p>
                        ) : (
                          <div className="space-y-3">
                            {payments.map((payment) => (
                              <div key={payment.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="font-semibold">{payment.parent?.first_name} {payment.parent?.last_name}</p>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        payment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                        payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                        {payment.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Amount: ${payment.amount} | Bank: {payment.bank_name} | Ref: {payment.transaction_reference}
                                    </p>
                                  </div>
                                  {payment.status === 'pending' && (
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        onClick={() => approvePayment(payment.id, `${payment.parent?.first_name} ${payment.parent?.last_name}`)}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => rejectPayment(payment.id)}
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Active Subscriptions</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b border-border">
                            <tr>
                              <th className="text-left py-3 px-4 font-semibold">Parent</th>
                              <th className="text-left py-3 px-4 font-semibold">Package</th>
                              <th className="text-left py-3 px-4 font-semibold">Price</th>
                              <th className="text-left py-3 px-4 font-semibold">Status</th>
                              <th className="text-left py-3 px-4 font-semibold">End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscriptions.map((sub) => (
                              <tr key={sub.id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4">{sub.parent?.first_name} {sub.parent?.last_name}</td>
                                <td className="py-3 px-4">{sub.package?.name}</td>
                                <td className="py-3 px-4">${sub.package?.price}</td>
                                <td className="py-3 px-4">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Platform Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>Parent accounts created over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                        <p>Chart would display here</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue</CardDescription>
                      </CardHeader>
                      <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                        <p>Chart would display here</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
