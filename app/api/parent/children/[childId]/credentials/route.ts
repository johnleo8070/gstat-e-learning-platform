import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateStudentCredentials } from '@/lib/auth/generate-credentials'

export async function GET(request: Request, { params }: { params: Promise<{ childId: string }> }) {
  const supabase = await createClient()
  const { childId } = await params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get student record to verify parent ownership
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        profile:profiles!students_profile_id_fkey (
          id,
          user_id,
          first_name,
          last_name,
          is_active
        )
      `)
      .eq('id', childId)
      .eq('parent_id', user.id)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      child: student
    })
  } catch (error) {
    console.error('[v0] Error fetching child credentials:', error)
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ childId: string }> }) {
  const supabase = await createClient()
  const { childId } = await params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { action } = await request.json()

  try {
    // Get student record to verify parent ownership
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        profile:profiles!students_profile_id_fkey (
          id,
          user_id,
          first_name,
          last_name
        )
      `)
      .eq('id', childId)
      .eq('parent_id', user.id)
      .single()

    if (studentError || !student || !student.profile || student.profile.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get the first (and only) profile from the array
    const profile = Array.isArray(student.profile) ? student.profile[0] : student.profile

    if (action === 'reset_password') {
      // Generate new credentials
      const credentials = generateStudentCredentials(
        profile.first_name,
        profile.last_name,
        profile.id
      )

      // Update the auth account password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile.user_id,
        { password: credentials.password }
      )

      if (updateError) {
        console.error('[v0] Error resetting password:', updateError)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully',
        credentials: {
          username: credentials.username,
          password: credentials.password
        }
      })
    }

    if (action === 'deactivate') {
      // Deactivate child account
      const { error: deactivateError } = await supabase.auth.admin.updateUserById(
        profile.user_id,
        { user_metadata: { is_active: false } }
      )

      if (deactivateError) {
        console.error('[v0] Error deactivating account:', deactivateError)
        return NextResponse.json({ error: 'Failed to deactivate account' }, { status: 500 })
      }

      // Update profile as inactive
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', student.profile.id)

      if (updateError) {
        console.error('[v0] Error updating profile:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Child account deactivated'
      })
    }

    if (action === 'activate') {
      // Activate child account
      const { error: activateError } = await supabase.auth.admin.updateUserById(
        profile.user_id,
        { user_metadata: { is_active: true } }
      )

      if (activateError) {
        console.error('[v0] Error activating account:', activateError)
        return NextResponse.json({ error: 'Failed to activate account' }, { status: 500 })
      }

      // Update profile as active
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', student.profile.id)

      if (updateError) {
        console.error('[v0] Error updating profile:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Child account activated'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
