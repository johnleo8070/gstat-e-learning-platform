import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function seedDefaultAdmin() {
  // Use service role for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[v0] Missing Supabase environment variables')
    throw new Error('Supabase configuration missing')
  }

  const supabase = createAdminClient(supabaseUrl, serviceRoleKey)

  // Try to create default admin auth account
  // If it already exists, we'll catch the error

  try {
    // Create default admin auth account with valid email
    const defaultEmail = 'admin@gstat.dev'
    const defaultPassword = 'AdminPass@123'
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: defaultEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'System',
        last_name: 'Admin',
        role: 'admin',
      },
    })

    if (authError) {
      // If user already exists, that's okay - just log it
      if (authError.message?.includes('already exists') || authError.message?.includes('User already registered')) {
        console.log('[v0] Default admin user already exists')
        return
      }
      console.error('[v0] Error creating admin auth account:', authError)
      throw new Error(`Auth creation failed: ${authError.message}`)
    }

    if (!authData.user) {
      console.error('[v0] No user returned from auth creation')
      throw new Error('No user returned from auth creation')
    }

    // Create admin profile (using parent role, marked as admin in metadata)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        first_name: 'System',
        last_name: 'Admin',
        role: 'parent',
        is_active: true,
      })

    if (profileError) {
      console.error('[v0] Error creating admin profile:', profileError)
      // Clean up auth account if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return
    }

    // Verify the profile was created
    const { data: profileCheck } = await supabase
      .from('profiles')
      .select('user_id, role')
      .eq('user_id', authData.user.id)
      .single()

    console.log('[v0] Default admin account created successfully')
    console.log('[v0] Email: admin@gstat.dev')
    console.log('[v0] Password: AdminPass@123')
    console.log('[v0] Profile check:', profileCheck)
    console.log('[v0] ⚠️  Please change this password after first login')
  } catch (error) {
    console.error('[v0] Error seeding admin account:', error)
  }
}
