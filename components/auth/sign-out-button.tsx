'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SignOutButtonProps {
  children: React.ReactNode
  className?: string
}

export function SignOutButton({ children, className }: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleSignOut} className={className}>
      {children}
    </button>
  )
}
