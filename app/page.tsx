import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VideoIntroduction } from "@/components/video-introduction"
import { WhyChooseSection } from "@/components/why-choose-section"
import { CurriculumSection } from "@/components/curriculum-section"
import { ProfessorSection } from "@/components/professor-section"
import { SubscriptionSection } from "@/components/subscription-section"
import { Footer } from "@/components/footer"

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
        <SubscriptionSection />
      </main>
      <Footer />
    </div>
  )
}
