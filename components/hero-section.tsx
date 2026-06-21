"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlayClick = () => {
    setIsPlaying(true)
    setIsFullscreen(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <>
      {/* Fullscreen Video Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close video"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <video
            ref={videoRef}
            className="w-full h-full object-contain max-w-6xl"
            controls
            autoPlay
            playsInline
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Hero Section */}
      <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden">
        {/* Background Video (muted, looping for atmosphere) */}
        <div className="absolute inset-0">
          {/* Gradient Background as fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400" />
          
          {/* Video Thumbnail with Professor Whiskers */}
          <div className="absolute inset-0">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers - GSTAT eLearning Platform"
              fill
              className="object-cover object-center opacity-20"
              priority
              loading="eager"
            />
          </div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-transparent to-orange-500/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-20">
          {/* Video Play Button */}
          <div className="mb-8 md:mb-12">
            <button
              onClick={handlePlayClick}
              className="group relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/50"
              aria-label="Play video"
            >
              {/* Animated rings */}
              <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              <span className="absolute inset-2 rounded-full border border-white/10 animate-pulse" />
              
              {/* Play icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-blue-600 ml-1" fill="currentColor" />
              </div>
            </button>
            <p className="text-center mt-4 text-white/80 text-sm md:text-base font-medium">
              Watch Introduction Video
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-5xl text-balance">
            Digital Education for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-400">
              Every African Child
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 md:mt-8 text-center text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl text-pretty">
            Customized eLearning Platforms for Schools
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link href="/book-demo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40"
              >
                Book a Demo
              </Button>
            </Link>
            <Link href="/free-trial">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white/20 hover:border-white rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold transition-all hover:scale-105"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
              <p className="text-sm md:text-base text-white/70">Schools</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">100K+</p>
              <p className="text-sm md:text-base text-white/70">Students</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">25+</p>
              <p className="text-sm md:text-base text-white/70">Countries</p>
            </div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-white/60 rounded-full animate-ping" />
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-blue-300/50 rounded-full animate-bounce" />
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-orange-300/60 rounded-full animate-pulse delay-300" />
      </section>
    </>
  )
}
