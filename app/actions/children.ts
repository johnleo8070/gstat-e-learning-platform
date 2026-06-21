'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from './auth'

export async function getChildren() {
  const supabase = await createClient()
  const profile = await getUserProfile()
  
  if (!profile) return []

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('parent_id', profile.id)

  if (error) {
    console.error('Error fetching children:', error)
    return []
  }

  return data || []
}

export async function addChild(formData: FormData) {
  const supabase = await createClient()
  const profile = await getUserProfile()

  if (!profile) {
    return { error: 'Not authenticated as a parent' }
  }

  const name = formData.get('name') as string
  const gradeLevel = formData.get('grade_level') ? parseInt(formData.get('grade_level') as string, 10) : null
  const dateOfBirth = formData.get('date_of_birth') as string || null

  if (!name) {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase.from('students').insert({
    name,
    parent_id: profile.id,
    grade_level: gradeLevel,
    date_of_birth: dateOfBirth,
    total_stars: 0,
    total_badges: 0,
    current_streak: 0,
  }).select().single()

  if (error) {
    console.error('Error adding child:', error)
    return { error: error.message || 'Failed to add child' }
  }

  revalidatePath('/dashboard/parent/children')
  return { success: true, data }
}
