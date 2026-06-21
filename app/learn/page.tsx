"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Brain, BookOpen, FlaskConical, Palette, Heart, Code, Smile,
  Star, Trophy, Flame, ArrowRight, Search, Sparkles
} from "lucide-react"

interface LearningZone {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  gradient_from: string | null
  gradient_to: string | null
  tagline: string | null
  display_order: number
}

interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  'book-open': BookOpen,
  flask: FlaskConical,
  palette: Palette,
  heart: Heart,
  code: Code,
  smile: Smile,
  calculator: Brain,
}

const subjectConfig: Record<string, { gradient: string; icon: React.ComponentType<{ className?: string }> }> = {
  math: { gradient: 'from-orange-400 to-amber-400', icon: Brain },
  english: { gradient: 'from-blue-400 to-indigo-400', icon: BookOpen },
  science: { gradient: 'from-purple-400 to-violet-400', icon: FlaskConical },
  'art-music': { gradient: 'from-pink-400 to-rose-400', icon: Palette },
  'social-studies': { gradient: 'from-amber-400 to-orange-400', icon: Heart },
  'physical-education': { gradient: 'from-emerald-400 to-teal-400', icon: Heart },
  coding: { gradient: 'from-cyan-400 to-blue-400', icon: Code },
  emotions: { gradient: 'from-yellow-400 to-amber-400', icon: Smile },
}

export default function LearnPage() {
  const [zones, setZones] = useState<LearningZone[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAge, setSelectedAge] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ stars: 0, streak: 0, badges: 0 })

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch zones
        const zonesRes = await fetch('/api/curriculum/zones')
        const zonesData = await zonesRes.json()
        setZones(zonesData.zones || [])

        // Fetch subjects
        const subjectsRes = await fetch('/api/curriculum/subjects')
        const subjectsData = await subjectsRes.json()
        setSubjects(subjectsData.subjects || [])
      } catch (error) {
        console.error('[v0] Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-foreground">Loading Learning Zones...</p>
          <p className="text-muted-foreground">Get ready for an adventure!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-5xl animate-bounce" style={{ animationDuration: '3s' }}>*</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce" style={{ animationDuration: '2.5s' }}>*</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-float" style={{ animationDuration: '4s' }}>*</div>
        <div className="absolute top-40 right-[15%] text-4xl animate-wiggle" style={{ animationDuration: '2s' }}>*</div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="relative z-10 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <Image
                    src="/images/professor-whiskers-new.png"
                    alt="Professor Whiskers"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Zones</h1>
                  <p className="text-muted-foreground">Choose your adventure!</p>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{stats.stars}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold">{stats.streak} day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-bold">{stats.badges}</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur border-2 border-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {['all', '2-3', '4-5', '6-7'].map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedAge === age
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white/80 text-muted-foreground hover:bg-white'
                  }`}
                >
                  {age === 'all' ? 'All Ages' : `Ages ${age}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Learning Zones Grid */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        {/* Featured Zones */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Learning Worlds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => {
              const config = subjectConfig[subject.slug] || { gradient: 'from-gray-400 to-gray-500', icon: Brain }
              const Icon = config.icon

              return (
                <Link key={subject.id} href={`/curriculum/${subject.slug}`} className="group">
                  <Card className="h-full bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-br ${config.gradient} p-6 text-white relative overflow-hidden`}>
                        {/* Animated background shapes */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                        
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Icon className="w-8 h-8" style={{ color: subject.color || '#f97316' }} />
                          </div>
                          <h3 className="text-xl font-bold mb-1">{subject.name}</h3>
                          <p className="text-white/80 text-sm line-clamp-2">{subject.description}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">0% complete</span>
                        </div>
                        <Button size="sm" variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                          Start <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Continue Learning */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="Professor Whiskers"
                fill
                className="object-contain"
              />
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-4 bg-white rounded-xl px-3 py-1 shadow-lg">
                <p className="text-xs font-medium">Ready to learn?</p>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">Welcome, Explorer!</h3>
              <p className="text-muted-foreground mb-4">
                Professor Whiskers is here to guide you through amazing learning adventures. 
                Pick a world above and start earning stars!
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button className="rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-white hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Link href="/dashboard/student">
                  <Button variant="outline" className="rounded-full">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Challenges */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Daily Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Complete 3 Lessons', reward: 50, progress: 0, icon: BookOpen, color: 'from-blue-400 to-indigo-400' },
              { title: 'Earn 25 Stars', reward: 30, progress: 0, icon: Star, color: 'from-yellow-400 to-amber-400' },
              { title: 'Play a Game', reward: 20, progress: 0, icon: Brain, color: 'from-green-400 to-emerald-400' },
            ].map((challenge, i) => (
              <Card key={i} className="bg-white/90 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center text-white`}>
                    <challenge.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${challenge.color} rounded-full`}
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{challenge.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{challenge.reward}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
