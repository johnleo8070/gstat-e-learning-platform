"use client"

import { useEffect } from "react"
import Image from "next/image"

interface Worksheet {
  id: string
  title: string
  description: string | null
  is_premium: boolean
  age_group_slugs?: string[]
  subject?: { name: string; slug: string }
}

function getWorksheetContent(worksheet: Worksheet) {
  const slug = worksheet.subject?.slug || ''
  const title = worksheet.title.toLowerCase()

  if (slug.includes('math') || slug.includes('maths')) {
    if (title.includes('count') || title.includes('number')) {
      return <MathCountingContent title={worksheet.title} />
    }
    if (title.includes('addition') || title.includes('add')) {
      return <MathAdditionContent title={worksheet.title} />
    }
    if (title.includes('shape')) {
      return <MathShapesContent title={worksheet.title} />
    }
    return <MathCountingContent title={worksheet.title} />
  }

  if (slug.includes('english')) {
    if (title.includes('alphabet') || title.includes('letter') || title.includes('tracing')) {
      return <EnglishAlphabetContent title={worksheet.title} />
    }
    if (title.includes('word') || title.includes('sight') || title.includes('match')) {
      return <EnglishWordsContent title={worksheet.title} />
    }
    return <EnglishAlphabetContent title={worksheet.title} />
  }

  if (slug.includes('science')) {
    return <ScienceContent title={worksheet.title} />
  }

  if (slug.includes('coding')) {
    return <CodingContent title={worksheet.title} />
  }

  return <GenericContent title={worksheet.title} description={worksheet.description} />
}

function MathCountingContent({ title }: { title: string }) {
  const items = [
    { emoji: "🍎", count: 1 },
    { emoji: "🌟", count: 2 },
    { emoji: "🐶", count: 3 },
    { emoji: "🏠", count: 4 },
    { emoji: "🌈", count: 5 },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Count each group of objects and write the number in the box!</p>
      <div className="grid grid-cols-1 gap-8">
        {items.map((item) => (
          <div key={item.count} className="flex items-center gap-6 border-2 border-dashed border-gray-200 rounded-2xl p-4">
            <div className="flex gap-2 flex-wrap min-w-[200px]">
              {Array.from({ length: item.count }).map((_, i) => (
                <span key={i} className="text-4xl">{item.emoji}</span>
              ))}
            </div>
            <div className="text-gray-400 text-lg font-medium">→</div>
            <div className="w-20 h-20 border-4 border-blue-300 rounded-xl flex items-center justify-center text-3xl font-bold text-blue-200">
              {item.count}
            </div>
            <div className="text-gray-400 italic text-lg ml-2">
              {["one", "two", "three", "four", "five"][item.count - 1]}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gray-100 pt-6">
        <p className="font-bold text-gray-700 mb-4">🎯 Trace the numbers 1-5:</p>
        <div className="flex gap-6">
          {[1,2,3,4,5].map(n => (
            <div key={n} className="w-16 h-16 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-100">
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MathAdditionContent({ title }: { title: string }) {
  const problems = [
    { a: 1, b: 1 }, { a: 2, b: 1 }, { a: 1, b: 3 }, { a: 2, b: 2 },
    { a: 3, b: 1 }, { a: 1, b: 4 }, { a: 2, b: 3 }, { a: 4, b: 1 },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Solve each addition problem. Write the answer in the box! 🌟</p>
      <div className="grid grid-cols-2 gap-6">
        {problems.map((p, i) => (
          <div key={i} className="border-2 border-dashed border-orange-200 rounded-2xl p-5 text-center">
            <div className="text-5xl font-bold text-gray-700">
              {p.a} + {p.b} = <span className="inline-block w-16 border-b-4 border-orange-300 text-orange-100">{p.a + p.b}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gray-100 pt-6">
        <p className="font-bold text-gray-700 mb-3">🎨 Color the correct number of stars:</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-3xl text-gray-200">⭐</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MathShapesContent({ title }: { title: string }) {
  const shapes = [
    { name: "Circle", emoji: "⭕", sides: "0 sides" },
    { name: "Square", emoji: "⬛", sides: "4 equal sides" },
    { name: "Triangle", emoji: "🔺", sides: "3 sides" },
    { name: "Rectangle", emoji: "▬", sides: "4 sides" },
    { name: "Star", emoji: "⭐", sides: "5 points" },
    { name: "Heart", emoji: "❤️", sides: "curved" },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Learn about shapes! Trace each shape and write its name.</p>
      <div className="grid grid-cols-3 gap-6">
        {shapes.map((s) => (
          <div key={s.name} className="border-2 border-dashed border-purple-200 rounded-2xl p-5 text-center space-y-2">
            <div className="text-6xl">{s.emoji}</div>
            <p className="font-bold text-gray-700 text-lg">{s.name}</p>
            <p className="text-gray-400 text-sm">{s.sides}</p>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gray-100 pt-6">
        <p className="font-bold text-gray-700 mb-3">🔍 Find and circle all the squares around your house!</p>
      </div>
    </div>
  )
}

function EnglishAlphabetContent({ title }: { title: string }) {
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const subset = title.toLowerCase().includes('a-e') ? letters.slice(0, 5)
    : title.toLowerCase().includes('a-z') ? letters.slice(0, 10)
    : letters.slice(0, 8)

  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Trace each letter carefully. First the big letter, then the small one!</p>
      <div className="grid grid-cols-2 gap-6">
        {subset.map((letter) => (
          <div key={letter} className="border-2 border-dashed border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-6 mb-4">
              <div className="text-7xl font-bold text-red-100">{letter}</div>
              <div className="text-5xl font-bold text-red-100">{letter.toLowerCase()}</div>
            </div>
            <div className="border-b-2 border-dashed border-gray-200 h-12 rounded" />
            <p className="text-gray-400 text-sm mt-2 italic">Trace and write the letter</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnglishWordsContent({ title }: { title: string }) {
  const words = [
    { word: "CAT", emoji: "🐱", match: "A fluffy pet that says meow" },
    { word: "DOG", emoji: "🐶", match: "A loyal pet that wags its tail" },
    { word: "SUN", emoji: "☀️", match: "It shines bright in the sky" },
    { word: "TREE", emoji: "🌳", match: "It has leaves and branches" },
    { word: "BALL", emoji: "⚽", match: "Round and bouncy to play with" },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Match each word to its picture! Draw a line to connect them.</p>
      <div className="grid grid-cols-1 gap-5">
        {words.map((item) => (
          <div key={item.word} className="flex items-center gap-6 border-2 border-dashed border-blue-200 rounded-2xl p-4">
            <div className="text-2xl font-bold text-gray-700 w-24">{item.word}</div>
            <div className="flex-1 border-b-2 border-dotted border-gray-200 mx-2" />
            <div className="text-4xl">{item.emoji}</div>
            <p className="text-gray-400 text-sm w-40 italic">{item.match}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScienceContent({ title }: { title: string }) {
  const items = [
    { emoji: "🌱", label: "Plant", fact: "Plants need sun and water to grow" },
    { emoji: "🌍", label: "Earth", fact: "Our planet is covered in water" },
    { emoji: "🌧️", label: "Rain", fact: "Water falls from clouds as rain" },
    { emoji: "🌞", label: "Sun", fact: "The sun gives us light and warmth" },
    { emoji: "🦋", label: "Butterfly", fact: "Butterflies start life as caterpillars" },
    { emoji: "🐝", label: "Bee", fact: "Bees make honey and help flowers grow" },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Learn about nature! Read each fun fact and draw your own picture. 🔬</p>
      <div className="grid grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.label} className="border-2 border-dashed border-purple-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-xl font-bold text-gray-700">{item.label}</span>
            </div>
            <p className="text-gray-500 text-sm mb-3">{item.fact}</p>
            <div className="border-2 border-dashed border-gray-100 rounded-xl h-16 flex items-center justify-center text-gray-200 text-sm">
              Draw here!
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CodingContent({ title }: { title: string }) {
  const steps = [
    { step: 1, emoji: "🔴", label: "START", desc: "Begin your journey" },
    { step: 2, emoji: "➡️", label: "MOVE RIGHT", desc: "Go one step to the right" },
    { step: 3, emoji: "⬆️", label: "MOVE UP", desc: "Go one step up" },
    { step: 4, emoji: "➡️", label: "MOVE RIGHT", desc: "Go one step to the right" },
    { step: 5, emoji: "⭐", label: "FINISH", desc: "You reached the star!" },
  ]
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">Help the robot find its way! Follow the steps and draw the path on the grid. 🤖</p>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.step} className="flex items-center gap-4 border-2 border-dashed border-green-200 rounded-2xl p-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">{s.step}</div>
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <p className="font-bold text-gray-700">{s.label}</p>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gray-100 pt-6">
        <p className="font-bold text-gray-700 mb-3">🗺️ Draw the robot's path on this grid:</p>
        <div className="grid grid-cols-6 gap-1 w-fit">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-12 h-12 border border-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

function GenericContent({ title, description }: { title: string; description: string | null }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{description || "Complete the activities below!"}</p>
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="border-2 border-dashed border-gray-200 rounded-2xl p-5">
            <p className="text-gray-500 font-medium mb-3">Question {n}:</p>
            <div className="border-b-2 border-dashed border-gray-100 h-10 mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PrintableWorksheet({ worksheet }: { worksheet: Worksheet }) {
  useEffect(() => {
    document.title = `Worksheet: ${worksheet.title} | GSTAT Learning`
  }, [worksheet.title])

  const subjectColors: Record<string, string> = {
    math: 'bg-blue-500',
    maths: 'bg-blue-500',
    english: 'bg-red-400',
    science: 'bg-purple-500',
    coding: 'bg-green-500',
  }
  const slug = worksheet.subject?.slug || 'general'
  const headerColor = Object.entries(subjectColors).find(([k]) => slug.includes(k))?.[1] || 'bg-amber-400'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print controls - hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600 text-sm">{worksheet.subject?.name} Worksheet</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Worksheet Content */}
      <div className="max-w-3xl mx-auto p-6 print:p-0 print:max-w-none">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden print:shadow-none print:rounded-none">
          {/* Header */}
          <div className={`${headerColor} text-white px-8 py-6`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wide">
                  {worksheet.subject?.name} Worksheet
                </div>
                <h1 className="text-3xl font-extrabold mb-1">{worksheet.title}</h1>
                {worksheet.description && (
                  <p className="text-white/80 text-base">{worksheet.description}</p>
                )}
              </div>
              <div className="text-5xl">
                {slug.includes('math') ? '🔢' : slug.includes('english') ? '📖' : slug.includes('science') ? '🔬' : slug.includes('coding') ? '💻' : '📝'}
              </div>
            </div>
          </div>

          {/* Student Name + Date */}
          <div className="px-8 py-5 bg-gray-50 border-b border-gray-100 flex items-center gap-8">
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Student Name</p>
              <div className="border-b-2 border-gray-300 h-8 w-full" />
            </div>
            <div className="w-40">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Date</p>
              <div className="border-b-2 border-gray-300 h-8 w-full" />
            </div>
            <div className="w-24">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Score</p>
              <div className="border-b-2 border-gray-300 h-8 w-full" />
            </div>
          </div>

          {/* Main Activities */}
          <div className="px-8 py-8">
            {getWorksheetContent(worksheet)}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🎓</span>
              </div>
              <span className="text-gray-400 text-sm font-medium">GSTAT e-Learning Platform</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 border-2 border-dashed border-amber-200 rounded-full flex items-center justify-center text-xs text-amber-200">
                  ⭐
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  )
}
