import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) {
      console.error('[v0] Error fetching subjects:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
