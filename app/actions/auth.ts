'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types/database'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const role = (formData.get('role') as UserRole) || 'student'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Check your email to confirm your account' }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine dashboard redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .single()

  revalidatePath('/', 'layout')

  // Redirect based on role
  const dashboardPath = getDashboardPath(profile?.role || 'student')
  redirect(redirectTo || dashboardPath)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, school:schools(*)')
    .eq('user_id', user.id)
    .single()

  return profile
}

export async function getStudentData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return null

  const { data: student } = await supabase
    .from('students')
    .select(`
      *,
      progress:student_progress(*, lesson:lessons(*, subject:subjects(*))),
      achievements:student_achievements(*, achievement:achievements(*))
    `)
    .eq('profile_id', profile.id)
    .single()

  return student
}

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/dashboard/student'
    case 'parent':
      return '/dashboard/parent'
    case 'teacher':
      return '/dashboard/teacher'
    case 'school_admin':
      return '/dashboard/school'
    case 'super_admin':
      return '/dashboard/admin'
    default:
      return '/dashboard/student'
  }
}
