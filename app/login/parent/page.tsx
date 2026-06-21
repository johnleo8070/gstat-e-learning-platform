"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, Heart, TrendingUp, Bell, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ParentLoginPage() {
  const router = useRouter()
  
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      // Get user profile to verify parent role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single()

      const role = profile?.role

      if (role !== 'parent') {
        setError("This login is for parents only. Please use the appropriate login page.")
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      router.push('/dashboard/parent')
      router.refresh()
    }
  }

  const features = [
    { icon: TrendingUp, title: "Track Progress", desc: "See your child's learning journey" },
    { icon: Bell, title: "Activity Alerts", desc: "Get notified of achievements" },
    { icon: Clock, title: "Screen Time", desc: "Manage learning time" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center p-4">
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
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
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
            Stay connected with your child&apos;s learning journey. Monitor progress, celebrate achievements, and support their growth.
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
              &quot;I love being able to see what my daughter is learning. The progress reports are so helpful!&quot;
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

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="Professor Whiskers"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome, Parent!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to see your child&apos;s progress
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

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border focus:border-purple-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/signup?role=parent" className="text-purple-600 font-semibold hover:underline">
                  Sign up as a parent
                </Link>
              </p>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Other login options */}
              <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-xl text-sm">
                    Student Login
                  </Button>
                </Link>
                <Link href="/login/school" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-xl text-sm">
                    School Login
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
