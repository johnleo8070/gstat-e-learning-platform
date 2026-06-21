"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Star, Zap, Award, Medal, Crown } from "lucide-react"

const achievements = [
  { icon: Trophy, name: "Quick Learner", desc: "Complete 5 lessons in one day", earned: true, date: "2024-01-15" },
  { icon: Star, name: "Perfect Score", desc: "Score 100% on a lesson", earned: true, date: "2024-01-18" },
  { icon: Zap, name: "Streak Master", desc: "Maintain 7-day learning streak", earned: true, date: "2024-01-20" },
  { icon: Award, name: "Knowledge Seeker", desc: "Complete 50 lessons", earned: true, date: "2024-01-22" },
  { icon: Medal, name: "Subject Expert", desc: "Reach 95% in a subject", earned: true, date: "2024-01-25" },
  { icon: Crown, name: "Math Champion", desc: "Complete all Math lessons", earned: false, date: null },
]

export default function AchievementsPage() {
  const earnedCount = achievements.filter(a => a.earned).length

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Achievements & Badges</h1>
        <p className="text-muted-foreground">Celebrate your child's learning milestones</p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <p className="text-sm text-amber-900 mb-1">Total Badges</p>
            <p className="text-3xl font-bold text-amber-600">{earnedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <p className="text-sm text-purple-900 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-purple-600">{achievements.length - earnedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <p className="text-sm text-green-900 mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-green-600">{Math.round((earnedCount / achievements.length) * 100)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl text-center transition-all ${
                    achievement.earned
                      ? "bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 shadow-lg"
                      : "bg-muted border-2 border-muted-foreground/20 opacity-50"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    achievement.earned
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                      : "bg-muted-foreground/30"
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.desc}</p>
                  {achievement.earned && (
                    <p className="text-xs text-amber-600 font-medium">✓ Earned</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
