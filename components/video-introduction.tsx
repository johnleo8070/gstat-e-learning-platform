"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, X, Volume2, VolumeX, Maximize2, Pause } from "lucide-react"

export function VideoIntroduction() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(true)
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <>
      {/* Fullscreen Video Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-6 right-6 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
            aria-label="Close video"
          >
            <X className="w-7 h-7 text-white" />
          </button>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Video Introduction Section */}
      <section className="relative w-full bg-gradient-to-b from-background via-blue-950 to-blue-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-orange-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-20 h-20 border-4 border-blue-400 rounded-full animate-bounce" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-orange-400/20 rounded-full animate-ping" />
          <div className="absolute bottom-40 right-1/3 w-24 h-24 border-2 border-white/20 rounded-full" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6">
              <Play className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Watch Our Introduction</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Professor Whiskers</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto text-pretty">
              Let our friendly mascot show you how GSTAT transforms learning into an exciting adventure for every child
            </p>
          </div>

          {/* Video Container */}
          <div 
            ref={containerRef}
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(true)}
          >
            {/* Video Frame with Decorative Border */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/50 border-4 border-white/10">
              {/* Aspect Ratio Container - 16:9 */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-800 to-blue-900">
                {/* Classroom Background */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/classroom-background.jpg"
                    alt="Classroom background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Professor Whiskers on top of classroom */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/professor-whiskers-new.png"
                    alt="Professor Whiskers Introduction Video"
                    fill
                    className="object-contain p-8 md:p-16"
                    priority
                  />
                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button
                      onClick={handleFullscreen}
                      className="group relative"
                      aria-label="Play video"
                    >
                      {/* Outer pulsing ring */}
                      <span className="absolute inset-0 w-40 h-40 md:w-48 md:h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                      {/* Middle pulsing ring */}
                      <span className="absolute inset-0 w-36 h-36 md:w-44 md:h-44 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white/40 animate-pulse" />
                      {/* Inner glow ring */}
                      <span className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-white/60" />
                      
                      {/* Main play button */}
                      <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border-4 border-primary/20">
                        <Play className="w-12 h-12 md:w-16 md:h-16 text-primary ml-2" fill="currentColor" />
                      </div>
                      
                      {/* Click to play text */}
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="bg-white/95 text-blue-900 px-5 py-2.5 rounded-full text-sm md:text-base font-bold shadow-xl">
                          Click to Play Video
                        </span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Video Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg md:text-xl">Welcome to GSTAT eLearning</h3>
                      <p className="text-white/70 text-sm md:text-base">Professor Whiskers introduces your learning journey</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs md:text-sm font-medium rounded-full">
                        3:45
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                {showControls && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={handleFullscreen}
                      className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Fullscreen"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Elements around video */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-400 rounded-2xl rotate-12 opacity-80" />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-xl -rotate-12 opacity-80" />
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-yellow-400 rounded-xl rotate-6 opacity-80" />
            <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-pink-400 rounded-2xl -rotate-6 opacity-80" />
          </div>

          {/* Feature Highlights Below Video */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-white font-bold mb-2">For Schools</h4>
              <p className="text-white/60 text-sm">Custom eLearning solutions tailored for African schools</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="text-white font-bold mb-2">African Focused</h4>
              <p className="text-white/60 text-sm">Curriculum designed for African children and cultures</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-white font-bold mb-2">Digital Future</h4>
              <p className="text-white/60 text-sm">Preparing children for tomorrow with today&apos;s technology</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-full px-10 py-4 text-lg font-semibold shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              onClick={handleFullscreen}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Full Introduction
            </button>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100L48 90C96 80 192 60 288 55C384 50 480 60 576 65C672 70 768 70 864 65C960 60 1056 50 1152 50C1248 50 1344 60 1392 65L1440 70V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>
    </>
  )
}
