import { NextResponse } from 'next/server'
import { seedDefaultAdmin } from '@/lib/seed/admin-seed'

/**
 * POST /api/admin/seed
 * Seeds the default admin account (admin@gstat.local)
 * Should only be called once during initial setup
 */
export async function POST(request: Request) {
  try {
    // Seed the default admin account
    // This endpoint should only be accessible during initial setup
    console.log('[v0] Admin seed endpoint called')
    await seedDefaultAdmin()
    console.log('[v0] Admin seed completed')

    return NextResponse.json({
      success: true,
      message: 'Default admin account seeded successfully',
      credentials: {
        email: 'admin@gstat.dev',
        password: 'AdminPass@123',
        warning: 'Please change the password after first login'
      }
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      { error: `Failed to seed admin account: ${error}` },
      { status: 500 }
    )
  }
}
