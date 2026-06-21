import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      const user = data.session.user
      // Check if profile exists, if not create it
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
        
      if (!existingProfile) {
        // Initialize service client for bypassing RLS
        const { createClient: createServiceClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        const supabaseService = (supabaseUrl && serviceKey) ? createServiceClient(supabaseUrl, serviceKey) : supabase;

        // Get or create default school
        let schoolId = null;
        if (supabaseUrl && serviceKey) {
          const { data: defaultSchool } = await supabaseService
            .from('schools')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()
          
          if (defaultSchool?.id) {
            schoolId = defaultSchool.id
          } else {
            const { data: newSchool } = await supabaseService
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
            if (newSchool?.id) schoolId = newSchool.id
          }
        }

        await supabaseService.from('profiles').insert({
          user_id: user.id,
          first_name: user.user_metadata?.first_name || 'User',
          last_name: user.user_metadata?.last_name || '',
          role: user.user_metadata?.role || 'student',
          school_id: schoolId,
          is_active: true
        })
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
