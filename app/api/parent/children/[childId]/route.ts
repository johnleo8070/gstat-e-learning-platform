import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch single child details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const { childId } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get child details - verify parent owns this child (parent_id is user.id)
  const { data: child, error } = await supabase
    .from('students')
    .select(`
      id,
      profile_id,
      grade_level,
      date_of_birth,
      total_stars,
      total_badges,
      current_streak,
      profile:profiles!students_profile_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('id', childId)
    .eq('parent_id', user.id)
    .single()

  if (error || !child) {
    console.error('[v0] Error fetching child:', error)
    return NextResponse.json({ error: 'Child not found' }, { status: 404 })
  }

  return NextResponse.json({ child })
}

// PUT - Update child details
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const { childId } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify parent owns this child (parent_id is user.id)
    const { data: child } = await supabase
      .from('students')
      .select('id, profile_id')
      .eq('id', childId)
      .eq('parent_id', user.id)
      .single()

    if (!child) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 })
    }

    const body = await request.json()
    const { firstName, lastName, dateOfBirth, gradeLevel, gender } = body

    // Update profile if provided
    if (firstName || lastName || gender !== undefined) {
      const profileUpdate: Record<string, unknown> = {}
      if (firstName) profileUpdate.first_name = firstName
      if (lastName !== undefined) profileUpdate.last_name = lastName || ''
      if (gender !== undefined) profileUpdate.gender = gender

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', child.profile_id)

      if (profileError) {
        console.error('[v0] Error updating profile:', profileError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
    }

    // Update student record if provided
    const studentUpdate: Record<string, unknown> = {}
    if (dateOfBirth !== undefined) studentUpdate.date_of_birth = dateOfBirth
    if (gradeLevel !== undefined) studentUpdate.grade_level = gradeLevel ? parseInt(gradeLevel) : null

    if (Object.keys(studentUpdate).length > 0) {
      const { error: studentError } = await supabase
        .from('students')
        .update(studentUpdate)
        .eq('id', childId)

      if (studentError) {
        console.error('[v0] Error updating student:', studentError)
        return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: 'Child updated successfully' })
  } catch (error) {
    console.error('[v0] Error in PUT:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

// PATCH - Alias for PUT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  return PUT(request, { params })
}

// DELETE - Remove child account
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const { childId } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify parent owns this child and get profile_id (parent_id is user.id)
    const { data: child } = await supabase
      .from('students')
      .select('id, profile_id')
      .eq('id', childId)
      .eq('parent_id', user.id)
      .single()

    if (!child) {
      return NextResponse.json({ error: 'Child not found or access denied' }, { status: 404 })
    }

    // Get the child's profile to find auth user
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', child.profile_id)
      .single()

    // Delete student record (cascades delete progress and achievements)
    const { error: studentError } = await supabase
      .from('students')
      .delete()
      .eq('id', childId)

    if (studentError) {
      console.error('[v0] Error deleting student:', studentError)
      return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 })
    }

    // Delete child profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', child.profile_id)

    if (profileError) {
      console.error('[v0] Error deleting profile:', profileError)
    }

    // Delete auth user if exists
    if (profile?.user_id) {
      const { error: authError } = await supabase.auth.admin.deleteUser(profile.user_id)
      if (authError) {
        console.error('[v0] Error deleting auth user:', authError)
      }
    }

    return NextResponse.json({ success: true, message: 'Child account deleted successfully' })
  } catch (error) {
    console.error('[v0] Error in DELETE:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
