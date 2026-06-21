"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Lock, CheckCircle, Play, Clock, Trophy, Sparkles } from "lucide-react"
import { useState } from "react"

interface Lesson {
  id: number
  title: string
  description: string
  duration: string
  completed: boolean
  locked: boolean
}

interface Unit {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

interface CurriculumPageLayoutProps {
  subject: string
  subjectSlug: string
  tagline: string
  description: string
  icon: React.ReactNode
  color: string
  gradientFrom: string
  gradientTo: string
  units: Unit[]
  totalLessons: number
  completedLessons: number
  childId?: string
}

export function CurriculumPageLayout({
  subject,
  subjectSlug,
  tagline,
  description,
  icon,
  color,
  gradientFrom,
  gradientTo,
  units,
  totalLessons,
  completedLessons,
  childId,
}: CurriculumPageLayoutProps) {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1)
  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-amber-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} py-8 md:py-12`}>
        <div className="container mx-auto px-4">
          <Link href={`/dashboard/parent/curriculum${childId ? `?childId=${childId}` : ''}`} className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Icon */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/90 rounded-3xl shadow-xl flex items-center justify-center shrink-0">
              {icon}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                {tagline}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {subject}
              </h1>
              <p className="text-white/90 text-lg max-w-xl">
                {description}
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl w-full md:w-auto md:min-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-foreground">Your Progress</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.ceil(progressPercent / 33)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Units */}
          <div className="space-y-6">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Unit Header */}
                <button
                  onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                  className={`w-full flex items-center gap-4 p-5 md:p-6 hover:bg-gray-50 transition-colors text-left`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md`}>
                    {unit.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{unit.title}</h3>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {unit.lessons.filter(l => l.completed).length}/{unit.lessons.length} lessons
                    </span>
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${expandedUnit === unit.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Lessons */}
                {expandedUnit === unit.id && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {unit.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-4 p-4 md:p-5 ${lesson.locked ? "opacity-60" : "hover:bg-gray-50"} transition-colors`}
                      >
                        {/* Status Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          lesson.completed
                            ? "bg-green-100 text-green-600"
                            : lesson.locked
                            ? "bg-gray-100 text-gray-400"
                            : `bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : lesson.locked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                        </div>

                        {/* Duration & Action */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                          {!lesson.locked && (
                            <Link href={`/dashboard/parent/lesson/${subjectSlug}/${lesson.id}${childId ? `?childId=${childId}` : ''}`}>
                              <Button
                                size="sm"
                                className={`rounded-full ${
                                  lesson.completed
                                    ? "bg-green-500 hover:bg-green-600"
                                    : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
                                } text-white`}
                              >
                                {lesson.completed ? "Review" : "Start"}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Professor Whiskers Encouragement */}
          <div className="mt-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="Professor Whiskers"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold text-foreground mb-2">
                "Keep up the great work!"
              </p>
              <p className="text-muted-foreground">
                You're making amazing progress in {subject}. Complete more lessons to earn stars and unlock achievements!
              </p>
              <Button className={`mt-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-full`}>
                <Sparkles className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
