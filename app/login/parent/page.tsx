"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Heart, TrendingUp, Bell, Clock, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function ParentZoneContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  
  // Shared States
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sign In States
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Sign Up States
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      router.push(redirectTo || '/dashboard/parent')
      router.refresh()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: signUpData.firstName,
          last_name: signUpData.lastName,
          role: 'parent',
        },
      },
    })

    setIsLoading(false)

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('rate limit')) {
        setError('Too many signup attempts. Please wait a few minutes and try again.')
      } else if (signUpError.message.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    if (authData.session) {
      try {
        await fetch('/api/auth/create-parent-profile', { method: 'POST' })
      } catch (err) {
        console.error('[v0] Error creating parent profile:', err)
      }
      router.push(redirectTo || '/dashboard/parent')
    } else {
      setSuccess(true)
    }
  }

  const passwordStrength = () => {
    const pass = signUpData.password
    if (pass.length === 0) return { strength: 0, label: "", color: "" }
    if (pass.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" }
    if (pass.length < 10) return { strength: 2, label: "Medium", color: "bg-yellow-500" }
    return { strength: 3, label: "Strong", color: "bg-green-500" }
  }

  const { strength, label, color } = passwordStrength()

  const features = [
    { icon: TrendingUp, title: "Track Progress", desc: "See your child's learning journey" },
    { icon: Bell, title: "Activity Alerts", desc: "Get notified of achievements" },
    { icon: Clock, title: "Screen Time", desc: "Manage learning time" },
  ]

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image src="/images/professor-whiskers-new.png" alt="Professor Whiskers" fill className="object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email!</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation link to <strong>{signUpData.email}</strong>. 
            Click the link to activate your parent account!
          </p>
          <Button onClick={() => setSuccess(false)} className="w-full">Back to Login</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200/10 rounded-full blur-lg" />
        {/* Hearts decoration */}
        <div className="absolute top-1/4 left-1/3 text-white/10 text-6xl animate-bounce delay-500">♥</div>
        <div className="absolute bottom-1/3 right-1/3 text-white/10 text-4xl animate-bounce delay-700">♥</div>
      </div>

      {/* Back to Home */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Side - Info */}
        <div className="flex-1 text-white text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Parent Zone</h1>
              <p className="text-white/80 text-sm">Family Dashboard</p>
            </div>
          </div>
          
          <p className="text-lg text-white/90 mb-8 max-w-md mx-auto lg:mx-0">
            Stay connected with your child's learning journey. Monitor progress, celebrate achievements, and support their growth.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-left hidden lg:block">
            <p className="text-white/90 italic mb-4">
              "I love being able to see what my daughter is learning. The progress reports are so helpful!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold">SM</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Sarah M.</p>
                <p className="text-white/60 text-xs">Parent of 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image src="/images/professor-whiskers-new.png" alt="Professor Whiskers" fill className="object-contain rounded-full" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome, Parent!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in or create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted">
                <TabsTrigger value="signin" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-0">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-purple-500"
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
                  
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="First name"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        className="pl-10 h-12 rounded-xl border-border focus:border-purple-500"
                        required
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      className="h-12 rounded-xl border-border focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="pl-10 h-12 rounded-xl border-border focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password (min 6 chars)"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-purple-500"
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
                    {signUpData.password && (
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      className="pl-10 h-12 rounded-xl border-border focus:border-purple-500"
                      required
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div 
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreeTerms ? "bg-purple-600 border-purple-600" : "border-border"}`}
                    >
                      {agreeTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      I agree to the <Link href="/terms" className="text-purple-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ParentZonePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParentZoneContent />
    </Suspense>
  )
}
