import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  try {
    const { subjectSlug } = await params
    const supabase = await createClient()
    
    // First get the subject
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', subjectSlug)
      .single()

    if (subjectError || !subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    // Get units with lessons
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select(`
        *,
        lessons (
          id,
          title,
          slug,
          description,
          duration_minutes,
          difficulty_level,
          stars_reward,
          lesson_order,
          lesson_type,
          is_locked,
          video_url,
          content
        )
      `)
      .eq('subject_id', subject.id)
      .eq('is_active', true)
      .order('unit_order')

    if (unitsError) {
      console.error('[v0] Error fetching lessons:', unitsError)
      return NextResponse.json({ error: unitsError.message }, { status: 500 })
    }

    // Sort lessons within each unit
    const sortedUnits = units?.map(unit => ({
      ...unit,
      lessons: unit.lessons?.sort((a: { lesson_order: number }, b: { lesson_order: number }) => a.lesson_order - b.lesson_order) || []
    }))

    return NextResponse.json({ subject, units: sortedUnits })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
