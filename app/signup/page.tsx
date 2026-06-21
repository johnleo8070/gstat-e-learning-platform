"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, GraduationCap, AlertCircle, Users, School } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type AccountType = "parent"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [accountType] = useState<AccountType>("parent")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: accountType,
        },
      },
    })

    setIsLoading(false)

    if (signUpError) {
      // Provide user-friendly error messages
      if (signUpError.message.toLowerCase().includes('rate limit')) {
        setError('Too many signup attempts. Please wait a few minutes and try again, or use a different email address.')
      } else if (signUpError.message.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    if (signUpData.session) {
      // Email verification is disabled in Supabase, user is immediately logged in!
      try {
        await fetch('/api/auth/create-parent-profile', { method: 'POST' })
      } catch (err) {
        console.error('[v0] Error creating parent profile:', err)
      }
      router.push('/dashboard/parent')
    } else {
      // Email verification is enabled
      setSuccess(true)
    }
  }

  const passwordStrength = () => {
    const pass = formData.password
    if (pass.length === 0) return { strength: 0, label: "", color: "" }
    if (pass.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" }
    if (pass.length < 10) return { strength: 2, label: "Medium", color: "bg-yellow-500" }
    return { strength: 3, label: "Strong", color: "bg-green-500" }
  }

  const { strength, label, color } = passwordStrength()

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email!</h2>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>. 
            Click the link to activate your account and start learning!
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce" />
      </div>

      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          {/* Logo/Mascot */}
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Join the Adventure!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create an account to start learning
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

            {/* Account Type Info */}
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>Creating a Parent account to manage your children's learning</span>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-border focus:border-primary"
                  required
                />
              </div>
              <Input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="h-12 rounded-xl border-border focus:border-primary"
                required
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full ${strength >= 1 ? color : "bg-muted"} transition-all`} style={{ width: "33%" }} />
                    <div className={`h-full ${strength >= 2 ? color : "bg-muted"} transition-all`} style={{ width: "33%" }} />
                    <div className={`h-full ${strength >= 3 ? color : "bg-muted"} transition-all`} style={{ width: "34%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 h-12 rounded-xl border-border focus:border-primary"
                required
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div 
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreeTerms ? "bg-primary border-primary" : "border-border"}`}
              >
                {agreeTerms && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
