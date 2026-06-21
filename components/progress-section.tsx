"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, Award, Medal } from "lucide-react"

const badges = [
  { icon: Star, label: "Star Learner", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: Trophy, label: "Champion", color: "text-amber-500", bg: "bg-amber-100" },
  { icon: Award, label: "Super Reader", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Medal, label: "Math Wizard", color: "text-blue-500", bg: "bg-blue-100" },
]

export function ProgressSection() {
  return (
    <section id="progress" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Progress Tracking */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Progress Tracking</h2>
            
            <div className="flex gap-4 mb-8">
              <Card className="flex-1 border-0 shadow-md overflow-hidden">
                <div className="relative h-48 md:h-56">
                  <Image
                    src="/images/numbers-counting.jpg"
                    alt="Current lesson"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs opacity-80">Currently Learning</p>
                    <p className="font-semibold">Counting</p>
                  </div>
                </div>
              </Card>
              <Card className="flex-1 border-0 shadow-md overflow-hidden">
                <div className="relative h-48 md:h-56">
                  <Image
                    src="/images/story-time.jpg"
                    alt="Story time"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs opacity-80">Up Next</p>
                    <p className="font-semibold">Story Time</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Products Dashboard */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Progress Dashboard</h2>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {/* Progress Stats */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Lessons Completed</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-3 bg-muted" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Current Skill</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-3 bg-muted" />
                  </div>
                </div>

                {/* Reward Box */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Reward Box</h4>
                  <div className="flex gap-3 justify-center">
                    {badges.map((badge, index) => (
                      <div 
                        key={index}
                        className={`w-14 h-14 rounded-full ${badge.bg} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}
                        title={badge.label}
                      >
                        <badge.icon className={`w-7 h-7 ${badge.color}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Badges</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Super Star</span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">Quick Learner</span>
                    <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs font-medium">Math Pro</span>
                    <span className="px-3 py-1 bg-chart-5/10 text-chart-5 rounded-full text-xs font-medium">Story Teller</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
