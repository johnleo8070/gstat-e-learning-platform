import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const supabase = await createClient()
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        subject:subjects (
          id,
          name,
          slug,
          color
        ),
        unit:units (
          id,
          title
        )
      `)
      .eq('id', lessonId)
      .single()

    if (error || !lesson) {
      console.error('[v0] Error fetching lesson:', error)
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get next and previous lessons
    const { data: siblingLessons } = await supabase
      .from('lessons')
      .select('id, title, lesson_order')
      .eq('unit_id', lesson.unit_id)
      .order('lesson_order')

    const currentIndex = siblingLessons?.findIndex(l => l.id === lessonId) || 0
    const prevLesson = siblingLessons?.[currentIndex - 1] || null
    const nextLesson = siblingLessons?.[currentIndex + 1] || null

    return NextResponse.json({ 
      lesson,
      prevLesson,
      nextLesson
    })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
