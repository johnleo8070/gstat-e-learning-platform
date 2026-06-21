"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Calculator, BookOpen, Rocket, Code, Music, Palette, Star, Sparkles, Play } from "lucide-react"

const subjects = [
  {
    title: "Math Adventure",
    description: "Solve puzzles and become a number hero!",
    icon: Calculator,
    color: "bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300",
    shadowColor: "shadow-orange-300/50",
    stars: 3,
    progress: 65,
    levels: 20,
    href: "/signup",
  },
  {
    title: "English Quest",
    description: "Discover words and write amazing stories!",
    icon: BookOpen,
    color: "bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400",
    shadowColor: "shadow-blue-300/50",
    stars: 2,
    progress: 40,
    levels: 25,
    href: "/signup",
  },
  {
    title: "Science Lab",
    description: "Explore the universe and do cool experiments!",
    icon: Rocket,
    color: "bg-gradient-to-br from-purple-400 via-violet-400 to-fuchsia-400",
    shadowColor: "shadow-purple-300/50",
    stars: 3,
    progress: 80,
    levels: 18,
    href: "/signup",
  },
  {
    title: "Coding Fun",
    description: "Build games and become a tech wizard!",
    icon: Code,
    color: "bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400",
    shadowColor: "shadow-green-300/50",
    stars: 1,
    progress: 25,
    levels: 15,
    href: "/signup",
  },
  {
    title: "Music World",
    description: "Sing, dance, and make beautiful sounds!",
    icon: Music,
    color: "bg-gradient-to-br from-pink-400 via-rose-400 to-red-400",
    shadowColor: "shadow-pink-300/50",
    stars: 2,
    progress: 55,
    levels: 22,
    href: "/signup",
  },
  {
    title: "Creative Art",
    description: "Paint, draw, and let your imagination fly!",
    icon: Palette,
    color: "bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400",
    shadowColor: "shadow-cyan-300/50",
    stars: 3,
    progress: 90,
    levels: 16,
    href: "/signup",
  },
]

export function CurriculumSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="curriculum" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50" />
      
      {/* Animated Clouds */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-80 animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute top-20 right-20 w-40 h-20 bg-white rounded-full opacity-70 animate-[float_10s_ease-in-out_infinite_1s]" />
      <div className="absolute top-32 left-1/3 w-24 h-12 bg-white rounded-full opacity-60 animate-[float_7s_ease-in-out_infinite_2s]" />
      
      {/* Floating Stars */}
      <div className="absolute top-16 right-1/4 text-yellow-400 animate-[pulse_2s_ease-in-out_infinite]">
        <Star className="w-6 h-6 fill-current" />
      </div>
      <div className="absolute top-40 left-1/4 text-yellow-400 animate-[pulse_2s_ease-in-out_infinite_0.5s]">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-40 right-1/3 text-yellow-400 animate-[pulse_2s_ease-in-out_infinite_1s]">
        <Star className="w-4 h-4 fill-current" />
      </div>

      {/* Doodle Elements */}
      <div className="absolute bottom-20 left-10 w-8 h-8 bg-orange-300 rounded-lg rotate-12 opacity-40 animate-[bounce_3s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 right-10 w-6 h-6 bg-purple-300 rounded-full opacity-40 animate-[bounce_4s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-32 right-20 w-10 h-10 bg-green-300 rounded-lg rotate-45 opacity-30 animate-[bounce_3.5s_ease-in-out_infinite_0.5s]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-foreground">Learning Worlds</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Explore Your Learning
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
              Adventure!
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your favorite subject and start an amazing journey of discovery!
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {subjects.map((subject, index) => {
            const Icon = subject.icon
            const isHovered = hoveredIndex === index
            
            return (
              <Link
                key={index}
                href={subject.href}
                className={`group relative cursor-pointer transition-all duration-300 block ${isHovered ? 'scale-105 -translate-y-2' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card */}
                <div className={`relative ${subject.color} rounded-3xl p-6 shadow-xl ${subject.shadowColor} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Sparkle Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">NEW</span>
                  </div>

                  {/* Decorative circles */}
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -top-4 -right-12 w-20 h-20 bg-white/10 rounded-full" />

                  {/* Icon Container */}
                  <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-gray-700" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">
                      {subject.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base mb-4 drop-shadow">
                      {subject.description}
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                            star <= subject.stars
                              ? 'text-yellow-300 fill-yellow-300 drop-shadow-lg'
                              : 'text-white/40'
                          } ${isHovered ? 'animate-[bounce_0.5s_ease-in-out]' : ''}`}
                          style={{ animationDelay: `${star * 0.1}s` }}
                        />
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-white/30 rounded-full overflow-hidden mb-3">
                      <div
                        className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-500"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <p className="text-white/80 text-xs">
                      {subject.levels} Levels - {subject.progress}% Complete
                    </p>

                    {/* Play Button */}
                    <div className={`mt-4 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <Button className="bg-white text-gray-800 hover:bg-white/90 rounded-full px-6 shadow-lg font-semibold">
                        <Play className="w-4 h-4 mr-2 fill-current" />
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Professor Whiskers Section */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Professor Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full animate-pulse" />
              <Image
                src="/images/professor-whiskers-new.png"
                alt="Professor Whiskers"
                fill
                className="object-contain p-2"
                loading="eager"
              />
            </div>

            {/* Speech Bubble */}
            <div className="relative flex-1">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-100 rotate-45 hidden md:block" />
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4 md:p-6">
                <p className="text-lg md:text-xl font-bold text-foreground mb-2">
                  "Pick a subject and start your adventure!"
                </p>
                <p className="text-muted-foreground text-sm md:text-base">
                  Each world is full of fun games, exciting challenges, and amazing things to learn. Ready to explore?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white text-lg md:text-xl font-bold rounded-full px-8 md:px-12 py-6 md:py-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-[bounce_2s_ease-in-out_infinite]"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Start Learning Now!
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#fff"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  )
}
