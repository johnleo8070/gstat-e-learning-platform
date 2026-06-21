"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, CheckCircle } from "lucide-react"

const scheduleData = [
  { day: "Monday", time: "10:00 AM - 11:00 AM", subject: "Mathematics", status: "completed" },
  { day: "Tuesday", time: "2:00 PM - 3:00 PM", subject: "Science", status: "completed" },
  { day: "Wednesday", time: "10:00 AM - 11:00 AM", subject: "English", status: "completed" },
  { day: "Thursday", time: "3:00 PM - 4:00 PM", subject: "Mathematics", status: "in-progress" },
  { day: "Friday", time: "2:00 PM - 3:00 PM", subject: "Science", status: "scheduled" },
  { day: "Saturday", time: "10:00 AM - 11:00 AM", subject: "English", status: "scheduled" },
]

export default function SchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Schedule</h1>
        <p className="text-muted-foreground">View and manage your child's learning schedule</p>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <p className="text-sm text-blue-900 mb-1">Sessions This Week</p>
            <p className="text-3xl font-bold text-blue-600">6</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <p className="text-sm text-green-900 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">3</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <p className="text-sm text-orange-900 mb-1">Total Hours</p>
            <p className="text-3xl font-bold text-orange-600">6 hrs</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-32">
                  <p className="font-semibold text-sm">{item.day}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-2">
                  <p className="text-sm font-medium">{item.subject}</p>
                </div>
                <div className="text-right">
                  {item.status === "completed" && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Done</span>
                    </div>
                  )}
                  {item.status === "in-progress" && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <div className="w-3 h-3 rounded-full border-2 border-blue-600 animate-pulse" />
                      <span className="text-xs font-semibold">Active</span>
                    </div>
                  )}
                  {item.status === "scheduled" && (
                    <span className="text-xs font-semibold text-muted-foreground">Scheduled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            Consistency is key! Encourage your child to maintain a regular learning schedule. The recommended time is 30-60 minutes per day for optimal learning outcomes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
