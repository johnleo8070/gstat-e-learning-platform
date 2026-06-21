import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const student_id = searchParams.get('student_id')
  const subject_id = searchParams.get('subject_id')

  if (!student_id) {
    return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
  }

  try {
    let query = supabase
      .from('skill_masteries')
      .select(`
        *,
        skill_progression:skill_progressions (
          skill_name,
          skill_description,
          proficiency_levels,
          subject_id
        )
      `)
      .eq('student_id', student_id)

    if (subject_id) {
      query = query.eq('skill_progression.subject_id', subject_id)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching student skills:', error)
      return NextResponse.json({ error: 'Failed to fetch student skills' }, { status: 500 })
    }

    return NextResponse.json({ skill_mastery: data || [] })
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
  const { student_id, skill_progression_id, current_proficiency_level, mastery_percentage } = body

  if (!student_id || !skill_progression_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Check if record already exists
    const { data: existing } = await supabase
      .from('skill_masteries')
      .select('id')
      .eq('student_id', student_id)
      .eq('skill_progression_id', skill_progression_id)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('skill_masteries')
        .update({
          current_proficiency_level,
          mastery_percentage,
          total_assessments: supabase.rpc('increment', { x: 1 }),
          last_assessed_at: new Date().toISOString(),
          is_mastered: mastery_percentage >= 90
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('[v0] Error updating skill mastery:', error)
        return NextResponse.json({ error: 'Failed to update skill mastery' }, { status: 500 })
      }

      return NextResponse.json({ skill_mastery: data })
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('skill_masteries')
        .insert({
          student_id,
          skill_progression_id,
          current_proficiency_level,
          mastery_percentage,
          total_assessments: 1,
          last_assessed_at: new Date().toISOString(),
          is_mastered: mastery_percentage >= 90
        })
        .select()
        .single()

      if (error) {
        console.error('[v0] Error creating skill mastery:', error)
        return NextResponse.json({ error: 'Failed to create skill mastery' }, { status: 500 })
      }

      return NextResponse.json({ skill_mastery: data }, { status: 201 })
    }
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
