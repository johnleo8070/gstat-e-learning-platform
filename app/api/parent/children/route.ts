import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// GET - Fetch all children for the logged-in parent
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role to bypass RLS for reads
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseService = createServiceClient(supabaseUrl, serviceKey);

  // Get parent profile ID via service role
  const { data: parentProfile } = await supabaseService
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();
  const parentProfileId = parentProfile?.id;

  if (!parentProfileId) {
    return NextResponse.json({ children: [] });
  }

  // Fetch children using service role - include `name` column for fallback
  const { data: students, error: studentsError } = await supabaseService
    .from('students')
    .select('id, name, profile_id, grade_level, date_of_birth, total_stars, total_badges, current_streak')
    .eq('parent_id', parentProfileId)
    .order('created_at', { ascending: true });

  if (studentsError) {
    console.error('[v0] Error fetching students:', studentsError);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }

  if (!students || students.length === 0) {
    return NextResponse.json({ children: [] });
  }

  // Get profiles for all students using service role
  const profileIds = students.map(s => s.profile_id).filter(Boolean);
  let profilesMap: Record<string, any> = {};
  if (profileIds.length > 0) {
    const { data: profiles } = await supabaseService
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', profileIds);
    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});
    }
  }

  const transformedChildren = students.map(child => {
    const profile = child.profile_id ? profilesMap[child.profile_id] : null;
    // Parse the student `name` column as fallback when there's no linked profile
    const nameParts = (child.name || '').trim().split(/\s+/);
    const fallbackFirst = nameParts[0] || 'Child';
    const fallbackLast = nameParts.slice(1).join(' ') || '';
    return {
      id: child.id,
      profile_id: child.profile_id,
      profile: {
        first_name: profile?.first_name || fallbackFirst,
        last_name: profile?.last_name || fallbackLast,
        avatar_url: profile?.avatar_url || null
      },
      grade_level: child.grade_level,
      date_of_birth: child.date_of_birth,
      total_stars: child.total_stars || 0,
      total_badges: child.total_badges || 0,
      current_streak: child.current_streak || 0
    };
  });

  console.log('[v0] Fetched', transformedChildren.length, 'children for parent:', user.id);
  return NextResponse.json({ children: transformedChildren });
}

// POST - Create a new child account
export async function POST(request: Request) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error('[v0] Auth error:', authError)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { firstName, lastName, dateOfBirth, gradeLevel, gender } = body

  // Validation
  if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
    return NextResponse.json({ error: 'First name is required' }, { status: 400 })
  }

  // Validate age if DOB provided
  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 2 || age > 7) {
      return NextResponse.json({ error: 'Child age should be between 2 and 7 years' }, { status: 400 })
    }
  }

  try {
    let parentProfileId: string;

    // Always use service role for profile operations to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    const supabaseService = createServiceClient(supabaseUrl, serviceKey)

    // Get parent's profile using service role (bypasses RLS)
    const { data: parentProfile, error: profileError } = await supabaseService
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !parentProfile) {
      console.log('[v0] Parent profile not found, creating via service role...')
      
      // Get default school
      const { data: defaultSchool } = await supabaseService
        .from('schools')
        .select('id')
        .eq('slug', 'gstat-default')
        .single()

      const { data: newProfile, error: insertError } = await supabaseService
        .from('profiles')
        .insert({
          user_id: user.id,
          school_id: defaultSchool?.id || null,
          role: 'parent',
          first_name: user.user_metadata?.first_name || 'Parent',
          last_name: user.user_metadata?.last_name || '',
          is_active: true
        })
        .select('id')
        .single()

      if (insertError || !newProfile) {
        console.error('[v0] Failed to create parent profile:', insertError)
        return NextResponse.json({ error: 'Parent profile not found and could not be created' }, { status: 400 })
      }
      parentProfileId = newProfile.id
    } else {
      parentProfileId = parentProfile.id
    }

    console.log('[v0] Creating child for parent:', user.id, 'Name:', firstName, lastName)

    // Get school ID using the already-initialized service client
    let schoolId = null;
    const { data: defaultSchool } = await supabaseService
      .from('schools')
      .select('id')
      .eq('slug', 'gstat-default')
      .single()
    
    if (defaultSchool?.id) {
      schoolId = defaultSchool.id
    }

    // Create student record using service role to bypass RLS
    const studentName = lastName ? `${firstName} ${lastName}` : firstName;
    console.log('[v0] Inserting student payload:', {
      parent_id: parentProfileId,
      school_id: schoolId,
      name: studentName,
      grade_level: gradeLevel ? parseInt(gradeLevel) : null,
      date_of_birth: dateOfBirth || null,
    });
    const { data: student, error: studentError } = await supabaseService
      .from('students')
      .insert({
        parent_id: parentProfileId,
        school_id: schoolId,
        name: studentName,
        grade_level: gradeLevel ? parseInt(gradeLevel) : null,
        date_of_birth: dateOfBirth || null,
        total_stars: 0,
        total_badges: 0,
        current_streak: 0,
      })
      .select()
      .single();
    if (studentError) {
      console.error('[v0] Student insertion error details:', studentError);
    }

    if (studentError || !student) {
      console.error('[v0] Error creating student record:', studentError)
      return NextResponse.json({ error: 'Failed to create child record' }, { status: 500 })
    }

    console.log('[v0] Child created successfully:', student.id)

    revalidatePath('/dashboard/parent/children');
      return NextResponse.json({ 
      success: true, 
      child: {
        id: student.id,
        profile_id: student.profile_id,
        profile: {
          first_name: firstName.trim(),
          last_name: (lastName || '').trim(),
          avatar_url: null
        },
        grade_level: gradeLevel ? parseInt(gradeLevel) : null,
        date_of_birth: dateOfBirth || null,
        total_stars: 0,
        total_badges: 0,
        current_streak: 0
      }
    })
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    // Include error details in response for debugging
    return NextResponse.json({ error: 'An unexpected error occurred', details: error?.message || String(error) }, { status: 500 });
  }
}

// Helper functions
function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function formatGrade(gradeLevel: number | null): string {
  if (!gradeLevel) return 'Not Set'
  if (gradeLevel === 0) return 'Kindergarten'
  const suffix = gradeLevel === 1 ? 'st' : gradeLevel === 2 ? 'nd' : gradeLevel === 3 ? 'rd' : 'th'
  return `${gradeLevel}${suffix} Grade`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function getDefaultSchool(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('slug', 'demo')
    .single()
  
  return school?.id || ''
}
