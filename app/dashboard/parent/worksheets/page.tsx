"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText, Lock, Loader2, Sparkles, BookOpen, Calculator, Printer } from "lucide-react"

interface Worksheet {
  id: string
  title: string
  description: string | null
  file_url: string
  is_premium: boolean
  age_group_slugs?: string[]
  subject?: {
    name: string
    slug: string
  }
}

const getSubjectColor = (slug: string) => {
  if (slug.includes('english')) return 'bg-red-400 text-white'
  if (slug.includes('math')) return 'bg-blue-500 text-white'
  if (slug.includes('science')) return 'bg-purple-500 text-white'
  if (slug.includes('coding')) return 'bg-green-500 text-white'
  return 'bg-amber-400 text-white'
}

const getSubjectIcon = (slug: string) => {
  if (slug.includes('english')) return <BookOpen className="w-6 h-6" />
  if (slug.includes('math')) return <Calculator className="w-6 h-6" />
  return <FileText className="w-6 h-6" />
}

export default function WorksheetsPage() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWorksheets() {
      try {
        const res = await fetch("/api/parent/worksheets")
        if (res.ok) {
          const data = await res.json()
          setWorksheets(data.worksheets || [])
        }
      } catch (e) {
        console.error("[v0] Error loading worksheets:", e)
      }
      setLoading(false)
    }
    loadWorksheets()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh] bg-[#FAF8F5]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading worksheets...</p>
        </div>
      </div>
    )
  }

  // Group worksheets by subject
  const groupedWorksheets = worksheets.reduce((acc, ws) => {
    const subjectName = ws.subject?.name || "General"
    if (!acc[subjectName]) acc[subjectName] = []
    acc[subjectName].push(ws)
    return acc
  }, {} as Record<string, Worksheet[]>)

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen bg-[#FAF8F5]">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-[#1a1a2e]">Printable Worksheets</h1>
        <p className="text-[#6b7280] text-lg">
          Download and print fun learning activities for offline practice. Perfect for home or classroom use!
        </p>
      </div>

      {worksheets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No worksheets yet</h3>
          <p className="text-gray-500">Please check back later for exciting new activities.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(groupedWorksheets).map(([subjectName, subjectWorksheets]) => {
            const firstWs = subjectWorksheets[0]
            const slug = firstWs.subject?.slug || 'general'
            const subjectColor = getSubjectColor(slug)

            return (
              <div key={subjectName} className="space-y-6">
                {/* Subject Header */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${subjectColor} shadow-sm`}>
                    {getSubjectIcon(slug)}
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a1a2e]">{subjectName}</h2>
                </div>

                {/* Worksheets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectWorksheets.map((ws) => {
                    const isPremium = ws.is_premium
                    const isBeginner = ws.age_group_slugs?.includes('toddler') || ws.age_group_slugs?.includes('preschool')
                    const levelText = isBeginner ? 'Beginner' : 'Intermediate'
                    const levelColor = isBeginner ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#e8f0fe] text-[#1967d2]'
                    const pages = Math.floor(Math.random() * 20) + 5 // Mocking pages count since it's not in DB

                    return (
                      <div key={ws.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 transition-transform hover:scale-[1.02] hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${subjectColor} opacity-90`}>
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#1a1a2e] text-lg leading-tight mb-2">
                              {ws.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColor}`}>
                                {levelText}
                              </span>
                              <span className="text-sm text-gray-500 font-medium">
                                {pages} pages
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 mt-auto pt-2">
                          <Button 
                            className={`flex-1 rounded-full h-11 font-bold ${
                              isPremium 
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white' 
                                : 'bg-[#0084ff] hover:bg-[#0070d9] text-white'
                            }`}
                            onClick={() => {
                              if (isPremium) {
                                alert("This worksheet requires an Annual Subscription.")
                              } else {
                                // Download real DOCX file
                                const link = document.createElement('a')
                                link.href = `/api/worksheets/${ws.id}/download`
                                link.download = `${ws.title.replace(/\s+/g, '_')}.docx`
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }
                            }}
                          >
                            {isPremium ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Unlock Premium
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                          {!isPremium && (
                            <Button 
                              variant="outline" 
                              className="w-11 h-11 rounded-full p-0 shrink-0 border-gray-200 text-gray-600 hover:bg-gray-50"
                              title="Print worksheet (opens printable page)"
                              onClick={() => window.open(`/worksheets/print/${ws.id}`, "_blank")}
                            >
                              <Printer className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
