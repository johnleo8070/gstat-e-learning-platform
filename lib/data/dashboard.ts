import { createClient } from '@/lib/supabase/server'
import type { Profile, Student, Subject, Lesson, StudentProgress, Achievement, StudentAchievement, Subscription } from '@/lib/types/database'

export async function getCurrentUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, school:schools(*)')
    .eq('user_id', user.id)
    .single()

  return profile
}

export async function getStudentDashboardData(userId: string) {
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!profile) return null

  // Get student record
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  // Get all subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  // Get lessons with progress
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, subject:subjects(*)')
    .eq('is_active', true)
    .order('unit_number')
    .order('lesson_order')

  // Get student progress
  let progress: StudentProgress[] = []
  if (student) {
    const { data: progressData } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', student.id)
    progress = progressData || []
  }

  // Get achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')

  // Get student achievements
  let earnedAchievements: StudentAchievement[] = []
  if (student) {
    const { data: achievementData } = await supabase
      .from('student_achievements')
      .select('*, achievement:achievements(*)')
      .eq('student_id', student.id)
    earnedAchievements = achievementData || []
  }

  // Calculate subject progress
  const subjectProgress = (subjects || []).map(subject => {
    const subjectLessons = (lessons || []).filter(l => l.subject_id === subject.id)
    const completedLessons = subjectLessons.filter(l => 
      progress.some(p => p.lesson_id === l.id && p.completed_at)
    )
    const progressPercent = subjectLessons.length > 0 
      ? Math.round((completedLessons.length / subjectLessons.length) * 100)
      : 0
    const starsEarned = progress
      .filter(p => subjectLessons.some(l => l.id === p.lesson_id))
      .reduce((sum, p) => sum + p.stars_earned, 0)

    return {
      ...subject,
      progress: progressPercent,
      starsEarned,
      lessonsCompleted: completedLessons.length,
      totalLessons: subjectLessons.length,
      nextLesson: subjectLessons.find(l => 
        !progress.some(p => p.lesson_id === l.id && p.completed_at)
      ),
    }
  })

  return {
    profile,
    student,
    subjects: subjectProgress,
    lessons,
    progress,
    achievements,
    earnedAchievements,
    totalStars: student?.total_stars || 0,
    totalBadges: earnedAchievements.length,
    streak: student?.current_streak || 0,
  }
}

export async function getParentDashboardData(userId: string) {
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!profile) return null

  // Get children (students linked to this parent)
  const { data: children } = await supabase
    .from('students')
    .select(`
      *,
      profile:profiles(*),
      progress:student_progress(*, lesson:lessons(*, subject:subjects(*))),
      achievements:student_achievements(*, achievement:achievements(*))
    `)
    .eq('parent_id', profile.id)

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  // Calculate per-child stats
  const childrenWithStats = (children || []).map(child => {
    const completedLessons = child.progress?.filter((p: StudentProgress) => p.completed_at) || []
    const totalTimeSeconds = child.progress?.reduce((sum: number, p: StudentProgress) => sum + p.time_spent_seconds, 0) || 0
    
    // Group progress by subject
    const subjectProgress: Record<string, { completed: number; total: number }> = {}
    child.progress?.forEach((p: StudentProgress & { lesson: Lesson & { subject: Subject } }) => {
      const subjectName = p.lesson?.subject?.name || 'Unknown'
      if (!subjectProgress[subjectName]) {
        subjectProgress[subjectName] = { completed: 0, total: 0 }
      }
      subjectProgress[subjectName].total++
      if (p.completed_at) {
        subjectProgress[subjectName].completed++
      }
    })

    return {
      ...child,
      lessonsCompleted: completedLessons.length,
      timeSpent: formatTime(totalTimeSeconds),
      badgesEarned: child.achievements?.length || 0,
      subjectProgress: Object.entries(subjectProgress).map(([name, data]) => ({
        name,
        progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      })),
      recentActivity: completedLessons
        .sort((a: StudentProgress, b: StudentProgress) => 
          new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
        )
        .slice(0, 5),
    }
  })

  return {
    profile,
    children: childrenWithStats,
    subscription,
  }
}

export async function getSubscription(profileId: string) {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  return subscription
}

export async function getSubjects() {
  const supabase = await createClient()
  
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return subjects || []
}

export async function getLessons(subjectSlug?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('lessons')
    .select('*, subject:subjects(*)')
    .eq('is_active', true)
    .order('unit_number')
    .order('lesson_order')

  if (subjectSlug) {
    query = query.eq('subject.slug', subjectSlug)
  }

  const { data: lessons } = await query

  return lessons || []
}

export async function getAchievements() {
  const supabase = await createClient()
  
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')

  return achievements || []
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
