import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params
    const supabase = await createClient()
    
    const { data: units, error } = await supabase
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
          age_level,
          is_locked
        )
      `)
      .eq('subject_id', subjectId)
      .eq('is_active', true)
      .order('unit_order')

    if (error) {
      console.error('[v0] Error fetching units:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sort lessons within each unit
    const sortedUnits = units?.map(unit => ({
      ...unit,
      lessons: unit.lessons?.sort((a: { lesson_order: number }, b: { lesson_order: number }) => a.lesson_order - b.lesson_order) || []
    }))

    return NextResponse.json({ units: sortedUnits })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
