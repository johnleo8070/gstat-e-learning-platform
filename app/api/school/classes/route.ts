import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch all classes for the school
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

    // Fetch classes with student count
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        *,
        teacher:profiles!classes_teacher_id_fkey(id, first_name, last_name),
        students:students!students_class_id_fkey(id)
      `)
      .eq('school_id', profile.school_id)
      .order('grade_level', { ascending: true })

    if (error) {
      console.error('Error fetching classes:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to include student count
    const classesWithCount = classes?.map(c => ({
      ...c,
      student_count: c.students?.length || 0,
      students: undefined,
    })) || []

    return NextResponse.json({ classes: classesWithCount })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new class
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
    const { name, grade_level, description, teacher_id, academic_year } = body

    if (!name) {
      return NextResponse.json({ error: 'Class name is required' }, { status: 400 })
    }

    const { data: newClass, error } = await supabase
      .from('classes')
      .insert({
        school_id: profile.school_id,
        name,
        grade_level: grade_level || null,
        description: description || null,
        teacher_id: teacher_id || null,
        academic_year: academic_year || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating class:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ class: newClass }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
