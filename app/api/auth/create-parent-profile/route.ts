import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Check if profile already exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingProfile) {
    console.log('[v0] Parent profile already exists')
    return NextResponse.json({ success: true, profile: existingProfile })
  }

  // Create parent profile
  const firstName = user.user_metadata?.first_name || 'Parent'
  const lastName = user.user_metadata?.last_name || ''

  console.log('[v0] Creating parent profile for user:', user.id, 'Name:', firstName, lastName)

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      role: 'parent',
      school_id: null,
      is_active: true
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating parent profile:', error)
    return NextResponse.json({ error: `Failed to create profile: ${error.message}` }, { status: 500 })
  }

  console.log('[v0] Parent profile created:', profile?.id)
  return NextResponse.json({ success: true, profile })
}
