import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedCurriculumData } from '@/lib/seed/curriculum-seed-data'

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can seed data' }, { status: 403 })
    }

    console.log('[v0] Seeding curriculum data...')
    const result = await seedCurriculumData()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Curriculum data seeded successfully',
      data: result.data
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in seed endpoint:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
