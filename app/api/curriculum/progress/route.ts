import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Helper: get service-role Supabase client
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createServiceClient(supabaseUrl, serviceKey)
}

// Helper: verify that a student belongs to the logged-in parent
async function verifyParentOwnership(userId: string, studentId: string) {
  const supabaseService = getServiceClient()

  // Get parent profile
  const { data: parentProfile } = await supabaseService
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!parentProfile) return false

  // Check student belongs to this parent
  const { data: student } = await supabaseService
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('parent_id', parentProfile.id)
    .single()

  return !!student
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const studentId = searchParams.get('studentId')
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseService = getServiceClient()
    let resolvedStudentId: string | null = null

    if (studentId) {
      // Parent is requesting progress for a specific child
      const isOwner = await verifyParentOwnership(user.id, studentId)
      if (!isOwner) {
        return NextResponse.json({ error: 'Not authorized to view this child' }, { status: 403 })
      }
      resolvedStudentId = studentId
    } else {
      // Legacy: try to find the student linked to the logged-in user's profile
      const { data: profile } = await supabaseService
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        return NextResponse.json({ progress: [] })
      }

      const { data: student } = await supabaseService
        .from('students')
        .select('id')
        .eq('profile_id', profile.id)
        .single()

      if (!student) {
        return NextResponse.json({ progress: [] })
      }
      resolvedStudentId = student.id
    }

    // Build query for progress using service role to bypass RLS
    let query = supabaseService
      .from('student_progress')
      .select(`
        *,
        lesson:lessons (
          id,
          subject_id,
          title,
          slug
        )
      `)
      .eq('student_id', resolvedStudentId)

    // If subjectId provided, filter by subject
    if (subjectId) {
      const { data: lessons } = await supabaseService
        .from('lessons')
        .select('id')
        .eq('subject_id', subjectId)

      if (lessons && lessons.length > 0) {
        const lessonIds = lessons.map(l => l.id)
        query = query.in('lesson_id', lessonIds)
      } else {
        return NextResponse.json({ progress: [] })
      }
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('[v0] Error fetching progress:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: progress || [] })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lessonId, studentId, score, starsEarned, timeSpentSeconds, completed } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseService = getServiceClient()
    let resolvedStudentId: string | null = null

    if (studentId) {
      // Parent saving progress for a child
      const isOwner = await verifyParentOwnership(user.id, studentId)
      if (!isOwner) {
        return NextResponse.json({ error: 'Not authorized for this child' }, { status: 403 })
      }
      resolvedStudentId = studentId
    } else {
      // Legacy: student saving their own progress
      const { data: profile } = await supabaseService
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      const { data: student } = await supabaseService
        .from('students')
        .select('id, total_stars')
        .eq('profile_id', profile.id)
        .single()

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      resolvedStudentId = student.id
    }

    // Get current student stats for updating
    const { data: currentStudent } = await supabaseService
      .from('students')
      .select('total_stars, total_badges')
      .eq('id', resolvedStudentId)
      .single()

    // Upsert progress using service role
    const { data: progress, error: progressError } = await supabaseService
      .from('student_progress')
      .upsert({
        student_id: resolvedStudentId,
        lesson_id: lessonId,
        score: score || 0,
        stars_earned: starsEarned || 0,
        time_spent_seconds: timeSpentSeconds || 0,
        completed_at: completed ? new Date().toISOString() : null,
        attempts: 1
      }, {
        onConflict: 'student_id,lesson_id'
      })
      .select()
      .single()

    if (progressError) {
      console.error('[v0] Error saving progress:', progressError)
      return NextResponse.json({ error: progressError.message }, { status: 500 })
    }

    // Update student stats if completed
    if (completed) {
      const { data: previousProgress } = await supabaseService
        .from('student_progress')
        .select('completed_at')
        .eq('student_id', resolvedStudentId)
        .neq('lesson_id', lessonId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)

      let newStreak = currentStudent?.current_streak || 0
      const now = new Date()

      if (previousProgress && previousProgress.length > 0 && previousProgress[0].completed_at) {
        const lastCompleted = new Date(previousProgress[0].completed_at)
        const diffDays = Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 3600 * 24))
        
        if (diffDays === 1) {
          // It was yesterday, increment streak
          newStreak += 1
        } else if (diffDays > 1) {
          // Missed a day, reset streak
          newStreak = 1
        }
        // If 0 (same day), keep it same
      } else {
        // First completion ever
        newStreak = 1
      }

      const newStars = (currentStudent?.total_stars || 0) + (starsEarned || 0)
      const newBadges = Math.floor(newStars / 50) // 1 badge every 50 stars

      await supabaseService
        .from('students')
        .update({
          total_stars: newStars,
          total_badges: newBadges,
          current_streak: newStreak
        })
        .eq('id', resolvedStudentId)
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
