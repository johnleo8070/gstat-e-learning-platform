"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Calendar, Mail, User, Phone, School, Users, Building, Check, Clock, Video, MessageSquare } from "lucide-react"

const demoFeatures = [
  { icon: Video, title: "Live Demo", description: "30-min personalized walkthrough" },
  { icon: MessageSquare, title: "Q&A Session", description: "Get all your questions answered" },
  { icon: Users, title: "Team Overview", description: "See how it works for your school" },
]

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    role: "",
    studentCount: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState("")

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTime) {
      alert("Please select a preferred time slot")
      return
    }
    setIsLoading(true)
    // Simulate booking
    setTimeout(() => {
      setIsLoading(false)
      alert(`Demo booked for ${selectedTime}! We'll send a confirmation email shortly. (Demo mode)`)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-indigo-300/10 rounded-full blur-lg animate-bounce" />
      </div>

      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Side - Info */}
        <div className="lg:col-span-2 text-white space-y-6 hidden lg:block">
          <div>
            <h1 className="text-3xl font-bold mb-3">Book a School Demo</h1>
            <p className="text-white/80">
              See how GSTAT can transform digital learning at your school with a personalized demo.
            </p>
          </div>

          {/* Mascot */}
          <div className="relative w-40 h-40 mx-auto">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
            <Check className="w-6 h-6 text-green-400" />
            <span className="text-white/90">Trusted by 500+ schools across Africa</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="lg:col-span-3 shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Schedule Your Demo</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details and we&apos;ll set up a personalized session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Work email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>

                {/* School Name */}
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="School name"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>

                {/* Role */}
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your role (e.g., Principal)"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>

                {/* Student Count */}
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Number of students"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="pl-10 h-11 rounded-xl border-border focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred time slot
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-blue-600 text-white"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <Textarea
                  placeholder="Any specific topics you&apos;d like us to cover? (optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[80px] rounded-xl border-border focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl"
              >
                {isLoading ? "Booking demo..." : "Book My Demo"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By booking, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
