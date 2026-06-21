'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupSuccess, setSetupSuccess] = useState(false)

  const handleSetupAdmin = async () => {
    setSetupLoading(true)
    setError(null)
    setSetupSuccess(false)

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to setup admin account')
        setSetupLoading(false)
        return
      }

      setSetupSuccess(true)
      // Auto-fill the login form
      setEmail('admin@gstat.dev')
      setPassword('AdminPass@123')
      
      setTimeout(() => {
        setSetupSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('[v0] Setup error:', err)
      setError('Failed to setup admin account')
    }

    setSetupLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = await createClient()

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || 'Failed to sign in')
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError('Login failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Check if user is admin using user_metadata role field
      const isAdmin = data.user.user_metadata?.role === 'admin'

      if (!isAdmin) {
        // Sign them out if not admin
        await supabase.auth.signOut()
        setError('Only admin users can access this page')
        setIsLoading(false)
        return
      }

      // Successfully logged in as admin
      router.push('/dashboard/admin')
      router.refresh()
    } catch (err) {
      console.error('[v0] Admin login error:', err)
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="GSTAT"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            GSTAT eLearning Platform Management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {setupSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Admin account created! Use the credentials below to log in.</span>
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In as Admin'}
            </Button>

            {/* Setup Button */}
            <Button
              type="button"
              onClick={handleSetupAdmin}
              disabled={setupLoading}
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold text-base"
            >
              {setupLoading ? 'Setting up...' : 'Setup Admin Account (First Time)'}
            </Button>

            {/* Default Credentials Info */}
            <div className="mt-8 space-y-2 text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-semibold text-foreground">Default Admin Credentials:</p>
              <p>Email: admin@gstat.dev</p>
              <p>Password: AdminPass@123</p>
              <p className="text-xs pt-2">⚠️ Change these credentials after your first login</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
