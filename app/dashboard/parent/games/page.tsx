"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Calculator, 
  BookOpen, 
  Puzzle, 
  Palette, 
  Music, 
  Brain,
  Star,
  Trophy,
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Zap
} from "lucide-react"

const games = [
  {
    id: "number-blast",
    title: "Number Blast",
    description: "Solve math problems and blast the aliens!",
    icon: Calculator,
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-100",
    difficulty: "Easy",
    ageRange: "4-7",
    plays: "12.5K",
    rating: 4.8,
    href: "/dashboard/parent/games/number-blast",
  },
  {
    id: "word-builder",
    title: "Word Builder",
    description: "Build words from letters and earn stars!",
    icon: BookOpen,
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-100",
    difficulty: "Medium",
    ageRange: "5-8",
    plays: "9.8K",
    rating: 4.7,
    href: "/dashboard/parent/games/word-builder",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Find matching pairs and train your brain!",
    icon: Brain,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-100",
    difficulty: "Easy",
    ageRange: "3-6",
    plays: "15.2K",
    rating: 4.9,
    href: "/dashboard/parent/games/memory-match",
  },
  {
    id: "color-splash",
    title: "Color Splash",
    description: "Mix colors and create art masterpieces!",
    icon: Palette,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-100",
    difficulty: "Easy",
    ageRange: "3-5",
    plays: "8.3K",
    rating: 4.6,
    href: "/dashboard/parent/games/color-splash",
  },
  {
    id: "puzzle-world",
    title: "Puzzle World",
    description: "Solve puzzles and unlock new adventures!",
    icon: Puzzle,
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-100",
    difficulty: "Medium",
    ageRange: "5-8",
    plays: "7.1K",
    rating: 4.5,
    href: "/dashboard/parent/games/puzzle-world",
  },
  {
    id: "music-maker",
    title: "Music Maker",
    description: "Create songs and learn musical notes!",
    icon: Music,
    color: "from-cyan-400 to-sky-500",
    bgColor: "bg-cyan-100",
    difficulty: "Easy",
    ageRange: "4-7",
    plays: "6.4K",
    rating: 4.7,
    href: "/dashboard/parent/games/music-maker",
  },
]

export default function GamesPage() {
  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white/80 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: "1s" }} />
        </div>

        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full px-4 py-2 mb-6 shadow-md text-white">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-medium">Fun Learning Games</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Game Zone
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn while you play! Choose from our collection of fun educational games designed just for you.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">6+</p>
                <p className="text-sm text-muted-foreground">Games</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Plays</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section>
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const Icon = game.icon
              return (
                <Link key={game.id} href={game.href}>
                  <Card className="group relative overflow-hidden rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative p-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 ${game.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 bg-gradient-to-br ${game.color} bg-clip-text`} style={{ color: 'transparent', background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, WebkitBackgroundClip: 'text' }} />
                        <Icon className={`w-8 h-8 absolute`} style={{ color: game.color.includes('orange') ? '#f97316' : game.color.includes('blue') ? '#3b82f6' : game.color.includes('purple') ? '#8b5cf6' : game.color.includes('pink') ? '#ec4899' : game.color.includes('emerald') ? '#10b981' : '#06b6d4' }} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-2">{game.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{game.description}</p>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.bgColor} text-foreground`}>
                          {game.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-foreground">
                          Ages {game.ageRange}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-muted-foreground">{game.plays} plays</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium text-foreground">{game.rating}</span>
                        </div>
                      </div>

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                        <Button className={`bg-gradient-to-r ${game.color} text-white font-bold rounded-full px-8 py-6 shadow-xl`}>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Play Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
