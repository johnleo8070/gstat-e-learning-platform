import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const age_group_id = searchParams.get('age_group_id')
  const subject_id = searchParams.get('subject_id')

  try {
    let query = supabase
      .from('skill_progressions')
      .select('*')
      .eq('is_active', true)

    if (age_group_id) {
      query = query.eq('age_group_id', age_group_id)
    }

    if (subject_id) {
      query = query.eq('subject_id', subject_id)
    }

    const { data, error } = await query.order('skill_name', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching skills:', error)
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    return NextResponse.json({ skills: data || [] })
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

  // Check if user is admin or teacher
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !['super_admin', 'school_admin', 'teacher'].includes(profile.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { subject_id, age_group_id, skill_name, skill_description, proficiency_levels, progression_path, assessment_criteria } = body

  if (!subject_id || !age_group_id || !skill_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('skill_progressions')
      .insert({
        subject_id,
        age_group_id,
        skill_name,
        skill_description,
        proficiency_levels: proficiency_levels || ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
        progression_path: progression_path || null,
        assessment_criteria: assessment_criteria || null
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating skill:', error)
      return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
    }

    return NextResponse.json({ skill: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
