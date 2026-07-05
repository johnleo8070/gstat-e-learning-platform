'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from './auth'

import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function getChildren() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

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

  const profileId = parentProfile?.id;
  if (!profileId) return [];

  const { data: students, error } = await supabaseService
    .from('students')
    .select('*')
    .eq('parent_id', profileId)
    .order('created_at', { ascending: true })

  console.log('[v0 debug] getChildren profile.id:', profileId, 'found students:', students?.length, 'error:', error);

  if (error || !students) {
    console.error('Error fetching children:', error)
    return []
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
      profilesMap = profiles.reduce((acc: any, p: any) => {
        acc[p.id] = p;
        return acc;
      }, {});
    }
  }

  return students.map(child => {
    const p = child.profile_id ? profilesMap[child.profile_id] : null;
    const nameParts = (child.name || '').trim().split(/\s+/);
    const fallbackFirst = nameParts[0] || 'Child';
    const fallbackLast = nameParts.slice(1).join(' ') || '';
    
    return {
      ...child,
      profile: p,
      name: p ? `${p.first_name} ${p.last_name}`.trim() : child.name,
      avatar_url: p?.avatar_url || null
    };
  });
}

export async function addChild(formData: FormData) {
  const supabase = await createClient()
  const profile = await getUserProfile()

  if (!profile) {
    return { error: 'Not authenticated as a parent' }
  }

  const name = formData.get('name') as string
  const gradeLevel = formData.get('grade_level') ? parseInt(formData.get('grade_level') as string, 10) : null
  const dateOfBirth = formData.get('date_of_birth') as string || null

  if (!name) {
    return { error: 'Name is required' }
  }

  const { data, error } = await supabase.from('students').insert({
    name,
    parent_id: profile.id,
    grade_level: gradeLevel,
    date_of_birth: dateOfBirth,
    total_stars: 0,
    total_badges: 0,
    current_streak: 0,
  }).select().single()

  if (error) {
    console.error('Error adding child:', error)
    return { error: error.message || 'Failed to add child' }
  }

  revalidatePath('/dashboard/parent/children')
  return { success: true, data }
}
