import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const lesson_id = searchParams.get('lesson_id')

  if (!lesson_id) {
    return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('lesson_id', lesson_id)
      .eq('is_active', true)

    if (error) {
      console.error('[v0] Error fetching assessments:', error)
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }

    return NextResponse.json({ assessments: data || [] })
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
    lesson_id,
    title,
    description,
    assessment_type,
    passing_score,
    total_points,
    time_limit_minutes,
    question_pool,
    content
  } = body

  if (!lesson_id || !title || !assessment_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        lesson_id,
        title,
        description: description || null,
        assessment_type,
        passing_score: passing_score || 70,
        total_points: total_points || 100,
        time_limit_minutes: time_limit_minutes || null,
        question_pool: question_pool || null,
        content: content || null
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating assessment:', error)
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
    }

    return NextResponse.json({ assessment: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
