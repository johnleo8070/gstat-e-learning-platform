"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, BookOpen, Zap, Target } from "lucide-react"

export default function ReportsPage() {
  const [reportData, setReportData] = useState({
    weeklyProgress: 87,
    lessonsCompleted: 24,
    averageScore: 92,
    totalTimeSpent: "12 hours 45 min"
  })

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Progress Reports</h1>
        <p className="text-muted-foreground">Detailed insights into your child's learning journey</p>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Weekly Progress</p>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{reportData.weeklyProgress}%</p>
            <p className="text-xs text-blue-700 mt-1">↑ 5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-900">Lessons Completed</p>
              <BookOpen className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{reportData.lessonsCompleted}</p>
            <p className="text-xs text-green-700 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">Average Score</p>
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{reportData.averageScore}%</p>
            <p className="text-xs text-purple-700 mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-orange-900">Time Spent</p>
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{reportData.totalTimeSpent}</p>
            <p className="text-xs text-orange-700 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { subject: "Mathematics", progress: 95, color: "from-red-400 to-red-500" },
            { subject: "Science", progress: 87, color: "from-blue-400 to-blue-500" },
            { subject: "English", progress: 92, color: "from-green-400 to-green-500" },
            { subject: "History", progress: 85, color: "from-purple-400 to-purple-500" }
          ].map((item) => (
            <div key={item.subject}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.subject}</span>
                <span className="text-sm font-bold">{item.progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-sm text-blue-900 mb-1">Most Active Day</p>
              <p className="text-lg font-bold text-blue-600">Wednesday</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-green-900 mb-1">Favorite Subject</p>
              <p className="text-lg font-bold text-green-600">Mathematics</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-sm text-purple-900 mb-1">Daily Average</p>
              <p className="text-lg font-bold text-purple-600">45 minutes</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <p className="text-sm text-orange-900 mb-1">Current Streak</p>
              <p className="text-lg font-bold text-orange-600">12 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
