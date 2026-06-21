import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch all students for the school
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin's school
    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id, role')
      .eq('user_id', user.id)
      .single()

    if (!profile?.school_id || !['school_admin', 'super_admin', 'teacher'].includes(profile.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch students with their parent and class info
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        *,
        profile:profiles!students_profile_id_fkey(first_name, last_name, avatar_url, email:user_id),
        parent:profiles!students_parent_id_fkey(id, first_name, last_name),
        class:classes(id, name)
      `)
      .eq('school_id', profile.school_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ students: students || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new student
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin's school
    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id, role')
      .eq('user_id', user.id)
      .single()

    if (!profile?.school_id || !['school_admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, grade_level, date_of_birth, parent_id, class_id } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // Create auth user for student
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile
    const { data: studentProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        school_id: profile.school_id,
        role: 'student',
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || null,
        is_active: true,
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Create student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        profile_id: studentProfile.id,
        school_id: profile.school_id,
        name,
        grade_level: grade_level || null,
        date_of_birth: date_of_birth || null,
        parent_id: parent_id || null,
        class_id: class_id || null,
        total_stars: 0,
        total_badges: 0,
        current_streak: 0,
      })
      .select()
      .single()

    if (studentError) {
      console.error('Student error:', studentError)
      return NextResponse.json({ error: studentError.message }, { status: 500 })
    }

    return NextResponse.json({ student }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
