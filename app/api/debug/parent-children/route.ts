import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get parent profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, first_name, role')
      .eq('user_id', user.id)
      .single()

    // Get a school for reference
    let { data: schools } = await supabase
      .from('schools')
      .select('id, name')
      .limit(1)

    // If no school exists, create a default one
    if (!schools || schools.length === 0) {
      const { data: newSchool } = await supabase
        .from('schools')
        .insert({
          name: 'GSTAT School',
          slug: 'gstat-default',
          is_active: true,
          primary_color: '#FF9500',
          secondary_color: '#1E90FF'
        })
        .select()
        .single()
      
      if (newSchool) {
        schools = [newSchool]
      }
    }

    // Get students with parent_id = profile.id
    let studentsWithProfileId = []
    if (profile?.id) {
      const { data: students } = await supabase
        .from('students')
        .select('id, parent_id, name, grade_level')
        .eq('parent_id', profile.id)
      studentsWithProfileId = students || []
    }

    // Get ALL students to see what's in the table
    const { data: allStudents } = await supabase
      .from('students')
      .select('id, parent_id, name, grade_level')
      .limit(10)

    const response = {
      debug: {
        user_id: user.id,
        profile,
        schools: schools || [],
        students_with_parent_id: studentsWithProfileId,
        all_students_sample: allStudents || [],
        profile_error: profileError
      }
    }
    
    console.log('[v0] DEBUG RESPONSE:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      error: String(error)
    }, { status: 500 })
  }
}
