"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, X, Volume2, Sparkles, Loader2 } from "lucide-react"

export function ProfessorSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reset video state when modal opens
  useEffect(() => {
    if (isVideoOpen) {
      setVideoError(false)
      setVideoLoading(true)
    }
  }, [isVideoOpen])

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 relative overflow-hidden">
      {/* Floating Kids Attractions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stars */}
        <div className="absolute top-12 left-8 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>⭐</div>
        <div className="absolute top-24 right-16 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute bottom-40 left-12 text-2xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>✨</div>
        
        {/* Books and Learning */}
        <div className="absolute top-36 left-[12%] text-5xl animate-float" style={{ animationDuration: '4s' }}>📚</div>
        <div className="absolute top-20 right-[8%] text-4xl animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>📖</div>
        <div className="absolute bottom-24 right-[12%] text-4xl animate-float" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>✏️</div>
        
        {/* Fun Elements */}
        <div className="absolute top-44 right-[22%] text-5xl animate-wiggle" style={{ animationDuration: '2s' }}>🎈</div>
        <div className="absolute bottom-48 left-[18%] text-4xl animate-wiggle" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>🎨</div>
        <div className="absolute top-1/2 left-6 text-5xl animate-float" style={{ animationDuration: '5s' }}>🚀</div>
        
        {/* ABC Blocks */}
        <div className="absolute bottom-32 right-[28%] text-4xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.7s' }}>🔤</div>
        <div className="absolute top-28 left-[28%] text-3xl animate-float" style={{ animationDuration: '4s', animationDelay: '1.2s' }}>🎯</div>
        
        {/* Music and Games */}
        <div className="absolute bottom-20 left-[38%] text-4xl animate-wiggle" style={{ animationDuration: '2.2s' }}>🎵</div>
        <div className="absolute top-16 left-[48%] text-5xl animate-float" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>🎮</div>
        
        {/* Trophies and Gifts */}
        <div className="absolute bottom-36 right-6 text-4xl animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.4s' }}>🏆</div>
        <div className="absolute top-40 right-[38%] text-3xl animate-float" style={{ animationDuration: '4.2s' }}>🎁</div>
        
        {/* Hearts and Rainbows */}
        <div className="absolute top-8 left-[60%] text-4xl animate-wiggle" style={{ animationDuration: '2.3s' }}>❤️</div>
        <div className="absolute bottom-16 right-[45%] text-3xl animate-float" style={{ animationDuration: '4.8s', animationDelay: '0.6s' }}>🌈</div>
        
        {/* Clouds */}
        <div className="absolute top-6 left-[35%] text-6xl opacity-40 animate-float" style={{ animationDuration: '6s' }}>☁️</div>
        <div className="absolute top-2 right-[30%] text-5xl opacity-30 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>☁️</div>
        <div className="absolute bottom-12 left-[55%] text-4xl opacity-35 animate-float" style={{ animationDuration: '5.5s', animationDelay: '2s' }}>☁️</div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Meet Your Guide</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Professor Whiskers Introduces
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Watch Professor Whiskers explain how GSTAT eLearning Platform transforms education for schools across Africa
          </p>
        </div>

        {/* Full Screen Video Container */}
        <div className="w-full">
          <div className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden shadow-2xl group cursor-pointer"
               onClick={() => setIsVideoOpen(true)}>
            {/* Classroom Background */}
            <Image
              src="/images/classroom-background.jpg"
              alt="Classroom background"
              fill
              className="object-cover"
              loading="eager"
            />
            {/* Video Thumbnail - Professor Whiskers */}
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers - Click to watch introduction video"
              fill
              className="object-contain p-4 md:p-8 relative z-10"
              loading="eager"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 -m-8 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                {/* Middle pulsing ring */}
                <div className="absolute inset-0 -m-5 bg-white/40 rounded-full animate-pulse" />
                {/* Inner glow ring */}
                <div className="absolute inset-0 -m-2 bg-white/60 rounded-full" />
                {/* Play button */}
                <button className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-primary/20">
                  <Play className="w-10 h-10 md:w-14 md:h-14 text-primary fill-primary ml-2" />
                </button>
                {/* Click to play text */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-white/90 text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Click to Play Video
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-blue-900/90 to-transparent">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-lg md:text-xl">Welcome to GSTAT eLearning</h3>
                  <p className="text-white/80 text-sm">An introduction for schools and educators</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/80">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">3:45</span>
                </div>
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Watch Video
            </div>
          </div>

          {/* Video Features */}
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-xl border-2 border-white/50 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">For Schools</h4>
              <p className="text-sm text-blue-700">Customized learning platforms for every institution</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-xl border-2 border-white/50 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">African Focused</h4>
              <p className="text-sm text-blue-700">Content designed for African children and contexts</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-xl border-2 border-white/50 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Digital Future</h4>
              <p className="text-sm text-blue-700">Preparing students for tomorrow&apos;s opportunities</p>
            </div>
          </div>

          {/* CTA */}
          <div className="container mx-auto px-4 text-center mt-10">
            <Link href="/book-demo">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shadow-lg shadow-primary/25"
              >
                Book a School Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Loading State */}
          {videoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p>Loading video...</p>
              </div>
            </div>
          )}

          {/* Video Player - Using YouTube embed for demo */}
          {!videoError && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <iframe
                className="w-full max-w-5xl aspect-video rounded-lg shadow-2xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                title="Professor Whiskers Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
                onError={() => {
                  setVideoError(true)
                  setVideoLoading(false)
                }}
              />
            </div>
          )}

          {/* Fallback message if video fails to load */}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Image
                    src="/images/professor-whiskers-new.png"
                    alt="Professor Whiskers"
                    fill
                    className="object-contain"
                    loading="eager"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Video Coming Soon!</h3>
                <p className="text-white/80 mb-4">
                  Professor Whiskers is preparing an exciting introduction video for schools. 
                  Contact us to schedule a live demo instead!
                </p>
                <Link href="/book-demo">
                  <Button 
                    onClick={() => setIsVideoOpen(false)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Close & Book Demo
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
