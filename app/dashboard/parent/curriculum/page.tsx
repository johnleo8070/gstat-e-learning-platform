"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Lock, CheckCircle, Loader2, User, Star } from "lucide-react"

interface Child {
  id: string
  profile?: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

interface SubjectProgress {
  subjectId: string
  subjectName: string
  subjectSlug: string
  color: string
  totalLessons: number
  completedLessons: number
  progressPercent: number
}

const subjectColors: Record<string, string> = {
  math: "from-orange-400 to-amber-500",
  english: "from-blue-400 to-indigo-500",
  science: "from-purple-400 to-violet-500",
  coding: "from-green-400 to-emerald-500",
  art: "from-pink-400 to-rose-500",
  music: "from-cyan-400 to-teal-500",
}

export default function CurriculumPage() {
  const searchParams = useSearchParams()
  const childIdParam = searchParams.get("childId")

  const [children, setChildren] = useState<Child[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(childIdParam)
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(false)

  // Load children on mount
  useEffect(() => {
    async function loadChildren() {
      try {
        const res = await fetch("/api/parent/children")
        const data = await res.json()
        if (data.children && Array.isArray(data.children)) {
          setChildren(data.children)
          // If no childId param, default to first child
          if (!childIdParam && data.children.length > 0) {
            setSelectedChildId(data.children[0].id)
          }
        }
      } catch (e) {
        console.error("[v0] Error loading children:", e)
      }
      setLoading(false)
    }
    loadChildren()
  }, [childIdParam])

  // Load subject progress for selected child
  useEffect(() => {
    if (!selectedChildId) return

    async function loadProgress() {
      setProgressLoading(true)
      try {
        // 1. Fetch all subjects
        const subjectsRes = await fetch("/api/curriculum/lessons/math") // We'll use this to discover subjects
        // Actually, we need a subjects list. Let's fetch lessons for each known subject slug.
        const slugs = ["math", "english", "science", "coding", "art", "music"]
        const results: SubjectProgress[] = []

        for (const slug of slugs) {
          try {
            const lessonsRes = await fetch(`/api/curriculum/lessons/${slug}`)
            const lessonsData = await lessonsRes.json()

            if (!lessonsData.subject) continue

            const subjectId = lessonsData.subject.id
            const totalLessons = (lessonsData.units || []).reduce(
              (acc: number, u: any) => acc + (u.lessons?.length || 0),
              0
            )

            // Fetch progress for this child + subject
            const progressRes = await fetch(
              `/api/curriculum/progress?studentId=${selectedChildId}&subjectId=${subjectId}`
            )
            const progressData = await progressRes.json()
            const completedLessons = (progressData.progress || []).filter(
              (p: any) => p.completed_at
            ).length

            results.push({
              subjectId,
              subjectName: lessonsData.subject.name,
              subjectSlug: slug,
              color: subjectColors[slug] || "from-gray-400 to-gray-500",
              totalLessons,
              completedLessons,
              progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
            })
          } catch {
            // Subject might not exist in DB, skip
          }
        }

        setSubjectProgress(results)
      } catch (e) {
        console.error("[v0] Error loading progress:", e)
      }
      setProgressLoading(false)
    }
    loadProgress()
  }, [selectedChildId])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading curriculum...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Curriculum</h1>
        <p className="text-muted-foreground">
          {selectedChild
            ? `Track ${selectedChild.profile?.first_name || "your child"}'s progress through the curriculum`
            : "Select a child to view their curriculum progress"}
        </p>
      </div>

      {/* Child Selector */}
      {children.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Select Child:</span>
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedChildId === child.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white text-foreground hover:bg-muted border border-border"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">{child.profile?.first_name || "Child"}</span>
            </button>
          ))}
        </div>
      )}

      {children.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">No children added yet. Add a child to get started!</p>
            <Link href="/dashboard/parent">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Subject Cards */}
      {selectedChildId && (
        <div className="space-y-6">
          {progressLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading progress...</span>
            </div>
          ) : subjectProgress.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No curriculum subjects found. Please check back later.</p>
              </CardContent>
            </Card>
          ) : (
            subjectProgress.map((sp) => (
              <Link
                key={sp.subjectId}
                href={`/dashboard/parent/curriculum/${sp.subjectSlug}?childId=${selectedChildId}`}
                className="block"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                  <CardHeader className={`bg-gradient-to-r ${sp.color} text-white`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {sp.subjectName}
                      </CardTitle>
                      <span className="text-sm font-semibold">{sp.progressPercent}% Complete</span>
                    </div>
                    <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${sp.progressPercent}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">
                            {sp.completedLessons} of {sp.totalLessons} lessons completed
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${sp.color} text-white rounded-full group-hover:scale-105 transition-transform`}
                      >
                        {sp.completedLessons === 0 ? "Start" : sp.completedLessons >= sp.totalLessons ? "Review" : "Continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
