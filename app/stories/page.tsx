"use client"

import { Header } from "@/components/header"
import { StoriesSection } from "@/components/stories-section"

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <StoriesSection />
      </main>
    </div>
  )
}

