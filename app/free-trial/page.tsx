"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Check, Mail, User, School, Sparkles, Star, Rocket, BookOpen } from "lucide-react"

const trialFeatures = [
  { icon: BookOpen, text: "Access to 10 premium lessons" },
  { icon: Rocket, text: "3 fun educational games" },
  { icon: Star, text: "Basic progress tracking" },
  { icon: Sparkles, text: "No credit card required" },
]

export default function FreeTrialPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    schoolName: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate trial signup and redirect to student dashboard
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/student")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-emerald-300/20 rounded-full blur-lg animate-bounce" />
      </div>

      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="text-white space-y-8 hidden md:block">
          <div>
            <h1 className="text-4xl font-bold mb-4">Start Your 7-Day Free Trial</h1>
            <p className="text-white/80 text-lg">
              Give your child the gift of fun learning with Professor Whiskers!
            </p>
          </div>

          {/* Mascot */}
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {trialFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Free Trial</CardTitle>
            <CardDescription className="text-muted-foreground">
              7 days of unlimited fun learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Parent&apos;s name"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-border focus:border-emerald-500"
                  required
                />
              </div>

              {/* Child Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Child&apos;s name"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-border focus:border-emerald-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-border focus:border-emerald-500"
                  required
                />
              </div>

              {/* School Name (Optional) */}
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="School name (optional)"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-border focus:border-emerald-500"
                />
              </div>

              {/* No Credit Card Notice */}
              <div className="flex items-center justify-center gap-2 py-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">No credit card required</span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl"
              >
                {isLoading ? "Activating trial..." : "Start Free Trial"}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
