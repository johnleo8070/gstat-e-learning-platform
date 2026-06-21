import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch all parents for the school
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

    // Fetch parents with their children
    const { data: parents, error } = await supabase
      .from('profiles')
      .select(`
        *,
        children:students!students_parent_id_fkey(id, name, grade_level, total_stars, class:classes(name))
      `)
      .eq('school_id', profile.school_id)
      .eq('role', 'parent')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching parents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ parents: parents || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new parent
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
    const { first_name, last_name, email, password, phone, children_ids } = body

    if (!first_name || !email || !password) {
      return NextResponse.json({ error: 'First name, email, and password are required' }, { status: 400 })
    }

    // Create auth user for parent
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
    const { data: parentProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        school_id: profile.school_id,
        role: 'parent',
        first_name,
        last_name: last_name || null,
        phone: phone || null,
        is_active: true,
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Link children to this parent if provided
    if (children_ids && children_ids.length > 0) {
      const { error: linkError } = await supabase
        .from('students')
        .update({ parent_id: parentProfile.id })
        .in('id', children_ids)
        .eq('school_id', profile.school_id)

      if (linkError) {
        console.error('Link error:', linkError)
      }
    }

    return NextResponse.json({ parent: parentProfile }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
