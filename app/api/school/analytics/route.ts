import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Fetch school analytics
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

    // Fetch school info
    const { data: school } = await supabase
      .from('schools')
      .select('*')
      .eq('id', profile.school_id)
      .single()

    // Count students
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', profile.school_id)

    // Count parents
    const { count: totalParents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', profile.school_id)
      .eq('role', 'parent')

    // Count teachers
    const { count: totalTeachers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', profile.school_id)
      .eq('role', 'teacher')

    // Count classes
    const { count: totalClasses } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', profile.school_id)

    // Get active students (logged in within last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: activeStudents } = await supabase
      .from('student_progress')
      .select('student_id', { count: 'exact', head: true })
      .gte('started_at', sevenDaysAgo.toISOString())

    // Get total lessons completed
    const { count: lessonsCompleted } = await supabase
      .from('student_progress')
      .select('*', { count: 'exact', head: true })
      .not('completed_at', 'is', null)

    // Get top performing students
    const { data: topStudents } = await supabase
      .from('students')
      .select('id, name, total_stars, current_streak, class:classes(name)')
      .eq('school_id', profile.school_id)
      .order('total_stars', { ascending: false })
      .limit(5)

    // Get recent activity
    const { data: recentProgress } = await supabase
      .from('student_progress')
      .select(`
        id,
        started_at,
        completed_at,
        stars_earned,
        student:students!inner(id, name, school_id),
        lesson:lessons(title)
      `)
      .eq('student.school_id', profile.school_id)
      .order('started_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      school,
      stats: {
        totalStudents: totalStudents || 0,
        totalParents: totalParents || 0,
        totalTeachers: totalTeachers || 0,
        totalClasses: totalClasses || 0,
        activeStudents: activeStudents || 0,
        lessonsCompleted: lessonsCompleted || 0,
      },
      topStudents: topStudents || [],
      recentActivity: recentProgress || [],
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
