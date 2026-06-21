"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, X, ChevronRight } from "lucide-react"

const features = [
  {
    icon: "🏫",
    title: "My Own Learning Space",
    description: "I get my own school platform!",
    fullDescription: "Every child gets a personalized learning dashboard where they can access their lessons, track progress, and see their achievements. It's like having your own virtual classroom that's always open!",
    highlights: ["Personalized dashboard", "Progress tracking", "Custom avatars", "My own profile"],
    bgColor: "bg-blue-400",
    hoverColor: "hover:bg-blue-500",
    borderColor: "border-blue-300",
  },
  {
    icon: "🎮",
    title: "Learning is Fun!",
    description: "Games, quizzes, and rewards!",
    fullDescription: "Turn learning into an adventure with exciting educational games! Solve puzzles, complete challenges, and earn rewards while mastering new skills. Learning has never been this exciting!",
    highlights: ["50+ educational games", "Interactive quizzes", "Fun challenges", "Instant feedback"],
    bgColor: "bg-green-400",
    hoverColor: "hover:bg-green-500",
    borderColor: "border-green-300",
  },
  {
    icon: "🎬",
    title: "Cool Lessons",
    description: "Watch fun animated videos!",
    fullDescription: "Engaging animated lessons bring concepts to life! Watch Professor Whiskers explain everything from counting to science experiments in fun, easy-to-understand videos.",
    highlights: ["Animated videos", "Step-by-step lessons", "Visual learning", "Replay anytime"],
    bgColor: "bg-orange-400",
    hoverColor: "hover:bg-orange-500",
    borderColor: "border-orange-300",
  },
  {
    icon: "⭐",
    title: "Earn Stars & Badges",
    description: "Track my progress and achievements!",
    fullDescription: "Collect stars for completing lessons, earn badges for achievements, and watch your trophy collection grow! Every accomplishment is celebrated to keep kids motivated.",
    highlights: ["Star rewards", "Achievement badges", "Trophy collection", "Leaderboards"],
    bgColor: "bg-yellow-400",
    hoverColor: "hover:bg-yellow-500",
    borderColor: "border-yellow-300",
  },
  {
    icon: "🐭",
    title: "Meet Professor Whiskers",
    description: "My friendly learning guide!",
    fullDescription: "Professor Whiskers is your child's friendly companion throughout their learning journey. He guides, encourages, and celebrates every milestone with fun interactions and helpful tips!",
    highlights: ["Friendly guide", "Helpful tips", "Encouragement", "Fun interactions"],
    bgColor: "bg-pink-400",
    hoverColor: "hover:bg-pink-500",
    borderColor: "border-pink-300",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Easy for Everyone",
    description: "Teachers and parents can help me learn!",
    fullDescription: "Parents and teachers get their own dashboard to monitor progress, set learning goals, and provide support. Stay connected with your child's educational journey every step of the way.",
    highlights: ["Parent dashboard", "Progress reports", "Teacher tools", "Family sharing"],
    bgColor: "bg-purple-400",
    hoverColor: "hover:bg-purple-500",
    borderColor: "border-purple-300",
  },
]

export function WhyChooseSection() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Sky Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100" />

      {/* Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-[5%] animate-cloud-drift">
          <svg width="140" height="70" viewBox="0 0 140 70" className="text-white drop-shadow-lg">
            <ellipse cx="70" cy="45" rx="55" ry="22" fill="currentColor" />
            <ellipse cx="35" cy="40" rx="28" ry="18" fill="currentColor" />
            <ellipse cx="100" cy="42" rx="24" ry="14" fill="currentColor" />
            <ellipse cx="65" cy="30" rx="35" ry="20" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-16 right-[8%] animate-cloud-drift-reverse">
          <svg width="120" height="60" viewBox="0 0 120 60" className="text-white drop-shadow-lg">
            <ellipse cx="60" cy="40" rx="48" ry="18" fill="currentColor" />
            <ellipse cx="28" cy="35" rx="22" ry="14" fill="currentColor" />
            <ellipse cx="88" cy="37" rx="20" ry="12" fill="currentColor" />
            <ellipse cx="55" cy="25" rx="30" ry="16" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-[12%] animate-cloud-drift-slow">
          <svg width="100" height="50" viewBox="0 0 100 50" className="text-white/90 drop-shadow-md">
            <ellipse cx="50" cy="32" rx="40" ry="15" fill="currentColor" />
            <ellipse cx="22" cy="28" rx="18" ry="12" fill="currentColor" />
            <ellipse cx="75" cy="30" rx="16" ry="10" fill="currentColor" />
            <ellipse cx="45" cy="20" rx="26" ry="14" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Floating Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${10 + (i * 12) % 60}%`,
              left: `${5 + (i * 15) % 90}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <svg
              width={16 + (i % 3) * 6}
              height={16 + (i % 3) * 6}
              viewBox="0 0 24 24"
              className="text-yellow-400 fill-current drop-shadow-md"
            >
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Floating Doodles - Books, Pencils, etc */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[4%] text-5xl animate-float-bounce" style={{ animationDelay: "0s" }}>📚</div>
        <div className="absolute bottom-32 left-[6%] text-4xl animate-float-bounce" style={{ animationDelay: "0.5s" }}>✏️</div>
        <div className="absolute top-36 left-[4%] text-4xl animate-float-bounce" style={{ animationDelay: "1s" }}>🎨</div>
        <div className="absolute bottom-48 right-[5%] text-4xl animate-float-bounce" style={{ animationDelay: "1.5s" }}>🔬</div>
        <div className="absolute top-52 right-[15%] text-3xl animate-float-bounce" style={{ animationDelay: "0.8s" }}>🎵</div>
        <div className="absolute bottom-60 left-[15%] text-3xl animate-float-bounce" style={{ animationDelay: "1.2s" }}>🌈</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-xl border-4 border-dashed border-yellow-400">
            <span className="text-3xl animate-wiggle">🌟</span>
            <span className="text-base md:text-lg font-extrabold text-blue-600 uppercase tracking-wider">Super Duper Fun</span>
            <span className="text-3xl animate-wiggle" style={{ animationDelay: "0.2s" }}>🌟</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5">
            <span className="text-blue-600">Why Kids Love </span>
            <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 bg-clip-text text-transparent">GSTAT eLEARNING PLATFORM!</span>
          </h2>
          <p className="text-sm text-blue-500 font-semibold mb-2">Click on any card to learn more</p>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            The coolest way to learn new things every day!
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setSelectedFeature(index)}
              className={`group relative ${feature.bgColor} ${feature.hoverColor} rounded-3xl p-6 md:p-8 border-4 border-white shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 hover:scale-105 hover:rotate-1`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Sparkle Badge */}
              <div className="absolute -top-4 -right-4 w-14 h-14 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce-badge">
                <span className="text-2xl">✨</span>
              </div>

              {/* Click indicator */}
              <div className="absolute -bottom-2 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for more <ChevronRight className="w-3 h-3" />
              </div>

              {/* Shine Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-60" />

              {/* Icon Circle */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-5 shadow-lg mx-auto group-hover:animate-wiggle border-4 border-white/50">
                <span className="text-4xl md:text-5xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <div className="relative text-center">
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 drop-shadow-md">{feature.title}</h3>
                <p className="text-white/90 text-base md:text-lg font-medium">{feature.description}</p>
              </div>

              {/* Corner Dots Decoration */}
              <div className="absolute bottom-4 left-4 flex gap-1 opacity-40">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Feature Detail Modal */}
        {selectedFeature !== null && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFeature(null)}
          >
            <div 
              className={`relative ${features[selectedFeature].bgColor} rounded-3xl p-8 md:p-10 max-w-lg w-full border-4 border-white shadow-2xl transform animate-bounce-in`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Icon */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl mx-auto border-4 border-white/50">
                <span className="text-5xl">{features[selectedFeature].icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
                {features[selectedFeature].title}
              </h3>

              {/* Full Description */}
              <p className="text-white/95 text-center text-lg mb-6 leading-relaxed">
                {features[selectedFeature].fullDescription}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features[selectedFeature].highlights.map((highlight, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
                    <span className="text-white font-bold text-sm">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href="/signup" className="block">
                <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 font-bold py-6 rounded-full text-lg shadow-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try It Now!
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Professor Whiskers Mascot Section */}
        <div className="relative bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-white overflow-hidden">
          {/* Background Dots Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Floating Confetti */}
          <div className="absolute top-4 left-6 text-3xl animate-float-bounce">🎉</div>
          <div className="absolute top-6 right-8 text-3xl animate-float-bounce" style={{ animationDelay: "0.3s" }}>🎈</div>
          <div className="absolute bottom-6 left-10 text-2xl animate-float-bounce" style={{ animationDelay: "0.6s" }}>🌟</div>
          <div className="absolute bottom-8 right-12 text-2xl animate-float-bounce" style={{ animationDelay: "0.9s" }}>🎊</div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Professor Whiskers Image */}
            <div className="relative flex-shrink-0">
              <div className="w-44 h-44 md:w-60 md:h-60 relative">
                <div className="absolute inset-0 bg-white rounded-full shadow-2xl border-4 border-yellow-400" />
                <Image
                  src="/images/professor-whiskers-new.png"
                  alt="Professor Whiskers"
                  fill
                  className="object-cover rounded-full p-3"
                  loading="eager"
                />
              </div>
              {/* Speech Bubble */}
              <div className="absolute -top-2 -right-6 md:-right-10 bg-yellow-400 text-gray-800 px-5 py-3 rounded-3xl rounded-bl-none shadow-xl font-bold text-base md:text-lg animate-bounce-slow border-2 border-white">
                {"Let's learn together!"}
              </div>
            </div>

            {/* Message Content */}
            <div className="text-center lg:text-left flex-1">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                {"Hi, I'm Professor Whiskers!"}
              </h3>
              <p className="text-white/95 text-lg md:text-xl mb-8 max-w-xl font-medium leading-relaxed">
                {"I'm your super fun learning buddy! Together we'll go on amazing adventures through numbers, letters, science, and so much more! Are you ready?"}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <span className="inline-flex items-center gap-2 bg-white/25 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-bold border-2 border-white/30">
                  <span>🏆</span> Fun Rewards
                </span>
                <span className="inline-flex items-center gap-2 bg-white/25 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-bold border-2 border-white/30">
                  <span>🎮</span> Cool Games
                </span>
                <span className="inline-flex items-center gap-2 bg-white/25 backdrop-blur text-white px-5 py-2.5 rounded-full text-sm font-bold border-2 border-white/30">
                  <span>📖</span> Great Stories
                </span>
              </div>

              {/* CTA Button */}
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-white"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Learning Now!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(30px); }
        }
        @keyframes cloud-drift-reverse {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25px); }
        }
        @keyframes cloud-drift-slow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.4; transform: scale(0.7) rotate(15deg); }
        }
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(5deg); }
          75% { transform: translateY(-8px) rotate(-5deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes bounce-badge {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.1); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-cloud-drift { animation: cloud-drift 12s ease-in-out infinite; }
        .animate-cloud-drift-reverse { animation: cloud-drift-reverse 10s ease-in-out infinite; }
        .animate-cloud-drift-slow { animation: cloud-drift-slow 14s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        .animate-float-bounce { animation: float-bounce 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-bounce-badge { animation: bounce-badge 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out forwards; }
      `}</style>
    </section>
  )
}
