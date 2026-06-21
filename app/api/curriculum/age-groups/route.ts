import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching age groups:', error)
      return NextResponse.json({ error: 'Failed to fetch age groups' }, { status: 500 })
    }

    return NextResponse.json({ age_groups: data || [] })
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

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !['super_admin', 'school_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { name, slug, min_age_months, max_age_months, description, curriculum_overview, learning_outcomes } = body

  if (!name || !slug || typeof min_age_months !== 'number' || typeof max_age_months !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('age_groups')
      .insert({
        name,
        slug,
        min_age_months,
        max_age_months,
        description,
        curriculum_overview,
        learning_outcomes: learning_outcomes || null
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating age group:', error)
      return NextResponse.json({ error: 'Failed to create age group' }, { status: 500 })
    }

    return NextResponse.json({ age_group: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
