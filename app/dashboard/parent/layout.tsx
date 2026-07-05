import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ParentDashboardShell } from '@/components/parent/dashboard-shell'

export default async function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile to verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return (
    <ParentDashboardShell>
      {children}
    </ParentDashboardShell>
  )
}
