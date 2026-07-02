"use client"

import { useState, useEffect, use } from "react"
import { CurriculumPageLayout } from "@/components/curriculum-page-layout"
import { BookOpen, Calculator, Code, FlaskConical, Palette, Music } from "lucide-react"

// Map subjects to their specific UI elements
const subjectConfig: Record<string, any> = {
  math: {
    icon: <Calculator className="w-12 h-12 text-blue-500" />,
    color: "bg-blue-500",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    tagline: "Numbers & Logic"
  },
  english: {
    icon: <BookOpen className="w-12 h-12 text-emerald-500" />,
    color: "bg-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-400",
    tagline: "Reading & Writing"
  },
  science: {
    icon: <FlaskConical className="w-12 h-12 text-purple-500" />,
    color: "bg-purple-500",
    gradientFrom: "from-purple-600",
    gradientTo: "to-pink-500",
    tagline: "Discover the World"
  },
  coding: {
    icon: <Code className="w-12 h-12 text-indigo-500" />,
    color: "bg-indigo-500",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-500",
    tagline: "Create & Build"
  },
  art: {
    icon: <Palette className="w-12 h-12 text-pink-500" />,
    color: "bg-pink-500",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-400",
    tagline: "Express Yourself"
  },
  music: {
    icon: <Music className="w-12 h-12 text-amber-500" />,
    color: "bg-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-400",
    tagline: "Rhythm & Sound"
  }
}

export default function CurriculumSubjectPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ childId?: string }>
}) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)
  
  const [data, setData] = useState<any>(null)
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Fetch curriculum data
        const res = await fetch(`/api/curriculum/lessons/${resolvedParams.slug}`)
        if (!res.ok) throw new Error('Failed to load curriculum')
        
        const curriculumData = await res.json()
        setData(curriculumData)

        // Fetch progress if childId is present
        if (resolvedSearchParams.childId && curriculumData.subject?.id) {
          const progRes = await fetch(`/api/curriculum/progress?studentId=${resolvedSearchParams.childId}&subjectId=${curriculumData.subject.id}`)
          if (progRes.ok) {
            const progData = await progRes.json()
            setProgress(progData.progress || [])
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [resolvedParams.slug, resolvedSearchParams.childId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !data?.subject) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center">
        <div>
          <p className="text-red-500 mb-2">Error loading curriculum</p>
          <p className="text-muted-foreground">{error || 'Subject not found'}</p>
        </div>
      </div>
    )
  }

  const config = subjectConfig[data.subject.slug] || subjectConfig.math // Fallback to math style

  // Map database units/lessons to the layout format
  const formattedUnits = data.units.map((unit: any) => ({
    id: unit.unit_order || 1,
    title: unit.title,
    description: unit.description || `Unit ${unit.unit_order || 1} content`,
    lessons: unit.lessons?.map((lesson: any) => {
      const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed_at)
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || 'Learn and practice',
        duration: `${lesson.duration_minutes || 10} min`,
        completed: isCompleted,
        locked: lesson.is_locked
      }
    }) || []
  }))

  const totalLessons = formattedUnits.reduce((acc: number, u: any) => acc + u.lessons.length, 0)
  const completedLessons = formattedUnits.reduce((acc: number, u: any) => 
    acc + u.lessons.filter((l: any) => l.completed).length
  , 0)

  return (
    <CurriculumPageLayout
      subject={data.subject.name}
      subjectSlug={data.subject.slug}
      tagline={config.tagline}
      description={data.subject.description || "Start learning today!"}
      icon={config.icon}
      color={config.color}
      gradientFrom={config.gradientFrom}
      gradientTo={config.gradientTo}
      units={formattedUnits}
      totalLessons={totalLessons || 1} // Avoid division by zero
      completedLessons={completedLessons}
      childId={resolvedSearchParams.childId}
    />
  )
}
