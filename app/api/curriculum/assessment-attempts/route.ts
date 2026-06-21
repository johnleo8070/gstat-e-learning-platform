import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const student_id = searchParams.get('student_id')
  const assessment_id = searchParams.get('assessment_id')

  if (!student_id) {
    return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
  }

  try {
    let query = supabase
      .from('assessment_attempts')
      .select(`
        *,
        assessment:assessments (
          title,
          description,
          assessment_type,
          passing_score,
          total_points
        )
      `)
      .eq('student_id', student_id)

    if (assessment_id) {
      query = query.eq('assessment_id', assessment_id)
    }

    const { data, error } = await query.order('started_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching assessment attempts:', error)
      return NextResponse.json({ error: 'Failed to fetch assessment attempts' }, { status: 500 })
    }

    return NextResponse.json({ attempts: data || [] })
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

  const body = await request.json()
  const {
    student_id,
    assessment_id,
    score,
    total_points,
    time_spent_seconds,
    feedback
  } = body

  if (!student_id || !assessment_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Get assessment details to determine pass/fail
    const { data: assessment } = await supabase
      .from('assessments')
      .select('passing_score, total_points')
      .eq('id', assessment_id)
      .single()

    const is_passed = score ? (score >= (assessment?.passing_score || 70)) : false
    const stars_earned = is_passed ? 10 : (score && score > 0 ? 5 : 0)

    const { data, error } = await supabase
      .from('assessment_attempts')
      .insert({
        student_id,
        assessment_id,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        score: score || null,
        total_points: total_points || assessment?.total_points || 100,
        stars_earned,
        feedback: feedback || null,
        is_passed,
        time_spent_seconds: time_spent_seconds || 0
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating assessment attempt:', error)
      return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 })
    }

    // Update student rewards if passed
    if (is_passed && stars_earned > 0) {
      await supabase.from('student_rewards').insert({
        student_id,
        reward_type: 'assessment_completion',
        stars_amount: stars_earned,
        source_type: 'assessment',
        source_id: assessment_id,
        earned_at: new Date().toISOString()
      })
    }

    return NextResponse.json({ attempt: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
