import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VideoIntroduction } from "@/components/video-introduction"
import { WhyChooseSection } from "@/components/why-choose-section"
import { CurriculumSection } from "@/components/curriculum-section"
import { ProfessorSection } from "@/components/professor-section"
import { SubscriptionSection } from "@/components/subscription-section"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <VideoIntroduction />
        <WhyChooseSection />
        <ProfessorSection />
        <CurriculumSection />
        {/* Stories CTA */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📖 Professor Whiskers' Toy Stories</h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
              Join exciting adventures and learn Coding, Maths, English, and Music through fun interactive stories!
            </p>
            <Link href="/stories">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore All Stories
              </Button>
            </Link>
          </div>
        </section>
        <SubscriptionSection />
      </main>
      <Footer />
    </div>
  )
}
