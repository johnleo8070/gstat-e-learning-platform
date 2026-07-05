"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Rocket, 
  Calculator, 
  Cog, 
  BookOpen, 
  Music, 
  Puzzle, 
  Apple, 
  Shapes, 
  BookText, 
  Piano,
  Play,
  Lock
} from "lucide-react"

const stories = [
  {
    id: 1,
    title: "The Rocket That Wouldn't Launch",
    description: "Help Robot fix the rocket with coding commands!",
    subject: "Coding",
    icon: Rocket,
    color: "bg-[oklch(0.7_0.18_300)]",
    unlocked: true,
    completed: true,
  },
  {
    id: 2,
    title: "Dino Lost His Numbers",
    description: "Help Dino arrange the number blocks in order!",
    subject: "Maths",
    icon: Calculator,
    color: "bg-[oklch(0.65_0.22_250)]",
    unlocked: true,
    completed: false,
  },
  {
    id: 3,
    title: "The Sleepy Robot",
    description: "Fix the robot's code sequence to wake it up!",
    subject: "Coding",
    icon: Cog,
    color: "bg-[oklch(0.7_0.18_300)]",
    unlocked: true,
    completed: false,
  },
  {
    id: 4,
    title: "The Missing Letter Mystery",
    description: "Find the missing letters to complete words!",
    subject: "English",
    icon: BookOpen,
    color: "bg-[oklch(0.7_0.2_25)]",
    unlocked: true,
    completed: false,
  },
  {
    id: 5,
    title: "The Music Band Practice",
    description: "Tap the correct rhythm for the band!",
    subject: "Music",
    icon: Music,
    color: "bg-[oklch(0.8_0.15_60)]",
    unlocked: false,
    completed: false,
  },
  {
    id: 6,
    title: "The Bridge Puzzle",
    description: "Build a bridge for the toy cars to cross!",
    subject: "Coding & Logic",
    icon: Puzzle,
    color: "bg-[oklch(0.75_0.18_145)]",
    unlocked: false,
    completed: false,
  },
  {
    id: 7,
    title: "Dino's Snack Time",
    description: "Help Dino count his apples!",
    subject: "Maths",
    icon: Apple,
    color: "bg-[oklch(0.65_0.22_250)]",
    unlocked: false,
    completed: false,
  },
  {
    id: 8,
    title: "The Shape Treasure Hunt",
    description: "Find shapes to unlock the treasure chest!",
    subject: "Maths",
    icon: Shapes,
    color: "bg-[oklch(0.65_0.22_250)]",
    unlocked: false,
    completed: false,
  },
  {
    id: 9,
    title: "The Talking Storybook",
    description: "Match words with pictures to read the story!",
    subject: "English",
    icon: BookText,
    color: "bg-[oklch(0.7_0.2_25)]",
    unlocked: false,
    completed: false,
  },
  {
    id: 10,
    title: "The Magic Music Machine",
    description: "Play the notes in order to make music!",
    subject: "Music",
    icon: Piano,
    color: "bg-[oklch(0.8_0.15_60)]",
    unlocked: false,
    completed: false,
  },
]

export function StoriesSection() {
  return (
    <section id="stories" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <Image 
                src="/images/professor-whiskers-new.png" 
                alt="Professor Whiskers"
                fill
                className="object-contain drop-shadow-xl animate-bounce-slow"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Professor Whiskers' Toy Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Join exciting adventures with toys and learn Coding, Maths, English, and Music along the way!
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <Link 
              key={story.id}
              href={story.unlocked ? `/stories/${story.id}` : "#"}
              className={cn(
                "block animate-slide-up",
                !story.unlocked && "cursor-not-allowed"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={(e) => !story.unlocked && e.preventDefault()}
            >
              <div className={cn(
                "bg-card rounded-3xl overflow-hidden shadow-playful transition-all duration-300 h-full",
                story.unlocked && "hover:shadow-playful-lg hover:-translate-y-1",
                !story.unlocked && "opacity-60"
              )}>
                {/* Story Header */}
                <div className={cn(
                  "p-6 relative overflow-hidden",
                  story.color
                )}>
                  {/* Decorative circles */}
                  <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center">
                      <story.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {story.completed && (
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {!story.unlocked && (
                        <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-white/90 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
                        Episode {story.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-bold mb-3",
                    story.color,
                    "text-white"
                  )}>
                    {story.subject}
                  </span>
                  <h3 className="text-xl font-display font-bold text-card-foreground mb-2">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {story.description}
                  </p>
                  
                  {story.unlocked ? (
                    <Button className="w-full rounded-full font-bold">
                      <Play className="w-4 h-4 mr-2" />
                      {story.completed ? "Play Again" : "Start Story"}
                    </Button>
                  ) : (
                    <Button disabled className="w-full rounded-full font-bold" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Previous
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
