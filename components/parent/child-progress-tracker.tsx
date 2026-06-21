"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Award, Target, Download, BarChart3 } from "lucide-react"

interface SkillMastery {
  skill_name: string
  current_proficiency_level: string
  mastery_percentage: number
  last_assessed_at: string
  is_mastered: boolean
}

interface Certificate {
  title: string
  issued_at: string
  skills_mastered: string[]
}

interface ChildProgressProps {
  childId: string
  childName: string
  totalStars: number
  totalBadges: number
  currentStreak: number
}

export function ChildProgressTracker({
  childId,
  childName,
  totalStars,
  totalBadges,
  currentStreak
}: ChildProgressProps) {
  const [skillMastery, setSkillMastery] = useState<SkillMastery[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'skills' | 'certificates' | 'analytics'>('skills')

  useEffect(() => {
    loadProgressData()
  }, [childId])

  async function loadProgressData() {
    setLoading(true)
    try {
      // Load skill mastery
      const skillsResponse = await fetch(`/api/curriculum/student-skills?student_id=${childId}`)
      if (skillsResponse.ok) {
        const data = await skillsResponse.json()
        setSkillMastery(data.skill_mastery || [])
      }

      // Load certificates
      const certificatesResponse = await fetch(`/api/curriculum/certificates?student_id=${childId}`)
      if (certificatesResponse.ok) {
        const data = await certificatesResponse.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error('[v0] Error loading progress data:', error)
    }
    setLoading(false)
  }

  const masteredSkills = skillMastery.filter(s => s.is_mastered).length
  const avgMastery = skillMastery.length > 0
    ? Math.round(skillMastery.reduce((acc, s) => acc + s.mastery_percentage, 0) / skillMastery.length)
    : 0

  const proficiencyColors: Record<string, string> = {
    'beginner': 'from-blue-400 to-blue-500',
    'developing': 'from-cyan-400 to-blue-500',
    'proficient': 'from-green-400 to-emerald-500',
    'advanced': 'from-purple-400 to-indigo-500',
    'mastery': 'from-amber-400 to-orange-500'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Stars</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-3xl font-bold text-amber-600">{totalStars}</p>
              <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Badges Earned</p>
            <p className="text-3xl font-bold mt-2">{totalBadges}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Learning Streak</p>
            <p className="text-3xl font-bold mt-2">{currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Skills Mastered</p>
            <div className="flex items-baseline gap-1 mt-2">
              <p className="text-3xl font-bold">{masteredSkills}</p>
              <p className="text-sm text-muted-foreground">/ {skillMastery.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{childName}&apos;s Progress Report</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            {(['skills', 'certificates', 'analytics'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {loading ? (
                <p className="text-muted-foreground">Loading skills data...</p>
              ) : skillMastery.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No skill data yet. Start learning to track progress!</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-blue-900">Overall Mastery</p>
                      <p className="text-sm text-blue-700">{avgMastery}%</p>
                    </div>
                    <Progress value={avgMastery} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {skillMastery.map((skill, idx) => (
                      <div key={idx} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{skill.skill_name}</p>
                            <p className="text-xs text-muted-foreground">
                              Level: {skill.current_proficiency_level.charAt(0).toUpperCase() + skill.current_proficiency_level.slice(1)}
                            </p>
                          </div>
                          {skill.is_mastered && (
                            <Award className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={skill.mastery_percentage} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-foreground min-w-[40px]">
                            {skill.mastery_percentage}%
                          </span>
                        </div>
                        {skill.last_assessed_at && (
                          <p className="text-xs text-muted-foreground">
                            Last assessed: {new Date(skill.last_assessed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No certificates earned yet. Keep learning!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert, idx) => (
                    <Card key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-amber-900">{cert.title}</p>
                            <p className="text-sm text-amber-700">
                              {new Date(cert.issued_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Award className="w-8 h-8 text-amber-600" />
                        </div>
                        {cert.skills_mastered && cert.skills_mastered.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-amber-900 mb-1">Skills Mastered:</p>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills_mastered.map((skill, sidx) => (
                                <span key={sidx} className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          View Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-900 font-medium">Completion Rate</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <p className="text-2xl font-bold text-green-600">{Math.round((masteredSkills / Math.max(skillMastery.length, 1)) * 100)}%</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium">Learning Trend</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-600">Improving</p>
                  </div>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Monthly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Detailed analytics and charts coming soon
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
