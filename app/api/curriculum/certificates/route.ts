import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const student_id = searchParams.get('student_id')

  if (!student_id) {
    return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        age_group:age_groups (name, slug),
        subject:subjects (name, slug)
      `)
      .eq('student_id', student_id)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching certificates:', error)
      return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
    }

    return NextResponse.json({ certificates: data || [] })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Check if user is teacher or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !['super_admin', 'school_admin', 'teacher'].includes(profile.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const {
    student_id,
    age_group_id,
    subject_id,
    certificate_type,
    title,
    description,
    completion_date,
    skills_mastered,
    proficiency_summary
  } = body

  if (!student_id || !age_group_id || !certificate_type || !title || !completion_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        student_id,
        age_group_id,
        subject_id: subject_id || null,
        certificate_type,
        title,
        description: description || null,
        completion_date,
        skills_mastered: skills_mastered || null,
        proficiency_summary: proficiency_summary || null,
        is_digital_enabled: true,
        is_printable: true,
        issued_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating certificate:', error)
      return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
    }

    return NextResponse.json({ certificate: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
