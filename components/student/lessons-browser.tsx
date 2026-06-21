"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Lock, CheckCircle, Flame } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  subject: string
  duration: number
  difficulty: number
  stars_reward: number
  thumbnail_url?: string
  is_locked: boolean
  completed: boolean
  score?: number
}

interface LessonsBrowserProps {
  ageGroupId: string
  onLessonSelect: (lesson: Lesson) => void
}

export function LessonsBrowser({ ageGroupId, onLessonSelect }: LessonsBrowserProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('available')
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  useEffect(() => {
    loadLessons()
  }, [ageGroupId])

  async function loadLessons() {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons?age_group_id=${ageGroupId}`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data.lessons || [])
        
        // Extract unique subjects
        const uniqueSubjects = [...new Set(data.lessons.map((l: Lesson) => l.subject))]
        setSubjects(uniqueSubjects)
      }
    } catch (error) {
      console.error('[v0] Error loading lessons:', error)
    }
    setLoading(false)
  }

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'completed' && !lesson.completed) return false
    if (filter === 'available' && (lesson.is_locked || lesson.completed)) return false
    if (selectedSubject !== 'all' && lesson.subject !== selectedSubject) return false
    return true
  })

  const subjectIcons: Record<string, string> = {
    'English': '📚',
    'Math': '🔢',
    'Science': '🔬',
    'Coding': '💻',
    'Arts': '🎨',
    'Social Studies': '🌍',
    'Life Skills': '❤️'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium mb-2">Filter by Status</p>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'available', 'completed'] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Filter by Subject</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSubject === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject('all')}
            >
              All Subjects
            </Button>
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No lessons found matching your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map(lesson => (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                lesson.is_locked ? 'opacity-50' : ''
              }`}
              onClick={() => !lesson.is_locked && onLessonSelect(lesson)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subjectIcons[lesson.subject] || '📖'} {lesson.subject}
                    </p>
                  </div>
                  {lesson.completed && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  )}
                  {lesson.is_locked && (
                    <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{lesson.duration} min</span>
                  <div className="flex gap-1">
                    {Array(lesson.difficulty).fill(0).map((_, i) => (
                      <Flame key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-900">Earn</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-amber-600">{lesson.stars_reward}</span>
                    <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  </div>
                </div>

                {lesson.completed && lesson.score && (
                  <div className="bg-green-50 rounded px-3 py-2 text-center">
                    <p className="text-xs font-medium text-green-900">
                      Your Score: {lesson.score}%
                    </p>
                  </div>
                )}

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLessonSelect(lesson)
                  }}
                  className="w-full"
                  disabled={lesson.is_locked}
                  variant={lesson.is_locked ? 'outline' : 'default'}
                >
                  {lesson.is_locked ? 'Locked' : lesson.completed ? 'Review' : 'Start'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
