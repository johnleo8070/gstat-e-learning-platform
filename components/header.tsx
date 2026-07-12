"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/gstat-logo.png"
              alt="GSTAT eLearning Platform"
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors ${scrolled ? "text-primary hover:text-primary/80" : "text-white hover:text-white/80"}`}>
              Home
            </Link>
            <Link href="/book-demo" className={`text-sm font-medium transition-colors ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Book a Demo
            </Link>
            <Link href="/login/parent" className={`text-sm font-medium transition-colors ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Parent Zone
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className={scrolled ? "text-foreground" : "text-white hover:bg-white/10"}>
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
                Sign Up
              </Button>
            </Link>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${scrolled ? "bg-muted" : "bg-white/20"}`}>
              <User className={`w-5 h-5 ${scrolled ? "text-muted-foreground" : "text-white"}`} />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${scrolled ? "border-border bg-card" : "border-white/20 bg-blue-900/95 backdrop-blur"}`}>
            <nav className="flex flex-col gap-4">
              <Link href="/" className={`text-sm font-medium ${scrolled ? "text-primary" : "text-white"}`}>Home</Link>
              <Link href="/demo" className={`text-sm font-medium ${scrolled ? "text-foreground" : "text-white/90"}`}>Book a Demo</Link>
              <Link href="/login/parent" className={`text-sm font-medium ${scrolled ? "text-foreground" : "text-white/90"}`}>Parent Zone</Link>
              <div className={`flex gap-3 pt-4 border-t ${scrolled ? "border-border" : "border-white/20"}`}>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className={scrolled ? "" : "text-white hover:bg-white/10"}>Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground rounded-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
