"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, ArrowRight, Star, CheckCircle, Play, Pause,
  Volume2, VolumeX, RotateCcw, Trophy, Sparkles, Home,
  Calculator, BookOpen, Rocket, Code, Music, Palette, Loader2
} from "lucide-react"

// Sample lesson content based on subject
const lessonContent: Record<string, Record<string, {
  title: string
  steps: Array<{
    type: "intro" | "content" | "quiz" | "activity" | "complete"
    title: string
    content?: string
    image?: string
    question?: string
    options?: string[]
    correctAnswer?: number
    activity?: string
  }>
}>> = {
  math: {
    "1": {
      title: "Counting 1-10",
      steps: [
        { type: "intro", title: "Let's Learn to Count!", content: "Today we'll learn to count from 1 to 10. Are you ready for this adventure?" },
        { type: "content", title: "Numbers 1 to 5", content: "Let's start with the first five numbers:\n\n1 - ONE (like one sun)\n2 - TWO (like two eyes)\n3 - THREE (like three wishes)\n4 - FOUR (like four seasons)\n5 - FIVE (like five fingers)" },
        { type: "activity", title: "Count Along!", activity: "count", content: "Tap each number as you count!" },
        { type: "content", title: "Numbers 6 to 10", content: "Great job! Now let's learn more:\n\n6 - SIX\n7 - SEVEN\n8 - EIGHT\n9 - NINE\n10 - TEN" },
        { type: "quiz", title: "Quick Quiz!", question: "How many apples do you see? 🍎🍎🍎", options: ["2", "3", "4", "5"], correctAnswer: 1 },
        { type: "quiz", title: "Another Question!", question: "What number comes after 7?", options: ["6", "8", "9", "5"], correctAnswer: 1 },
        { type: "complete", title: "Amazing Job!", content: "You've completed the lesson! You earned 3 stars!" }
      ]
    },
    "2": {
      title: "Counting 11-20",
      steps: [
        { type: "intro", title: "Numbers 11 to 20!", content: "You already know 1-10. Now let's learn the teen numbers!" },
        { type: "content", title: "Teen Numbers", content: "11 - ELEVEN\n12 - TWELVE\n13 - THIRTEEN\n14 - FOURTEEN\n15 - FIFTEEN" },
        { type: "content", title: "More Teen Numbers", content: "16 - SIXTEEN\n17 - SEVENTEEN\n18 - EIGHTEEN\n19 - NINETEEN\n20 - TWENTY" },
        { type: "quiz", title: "Quiz Time!", question: "What number comes after 15?", options: ["14", "16", "17", "13"], correctAnswer: 1 },
        { type: "complete", title: "Fantastic!", content: "You've mastered teen numbers! Keep going!" }
      ]
    }
  },
  english: {
    "1": {
      title: "Learning ABCs",
      steps: [
        { type: "intro", title: "The Alphabet Adventure!", content: "Let's learn the alphabet together! There are 26 letters." },
        { type: "content", title: "Letters A to E", content: "A - Apple 🍎\nB - Ball ⚽\nC - Cat 🐱\nD - Dog 🐕\nE - Elephant 🐘" },
        { type: "activity", title: "Trace the Letters!", activity: "trace", content: "Use your finger to trace the letters!" },
        { type: "quiz", title: "Letter Quiz!", question: "What letter does 'Apple' start with?", options: ["B", "A", "C", "D"], correctAnswer: 1 },
        { type: "complete", title: "Great Work!", content: "You're learning the alphabet! Keep practicing!" }
      ]
    }
  },
  science: {
    "1": {
      title: "Our Solar System",
      steps: [
        { type: "intro", title: "Journey to Space!", content: "Let's explore the planets in our solar system!" },
        { type: "content", title: "The Sun", content: "The Sun is a giant star at the center of our solar system. It gives us light and warmth! ☀️" },
        { type: "content", title: "The Planets", content: "There are 8 planets:\n\n1. Mercury\n2. Venus\n3. Earth (that's us!)\n4. Mars\n5. Jupiter\n6. Saturn\n7. Uranus\n8. Neptune" },
        { type: "quiz", title: "Space Quiz!", question: "Which planet do we live on?", options: ["Mars", "Jupiter", "Earth", "Venus"], correctAnswer: 2 },
        { type: "complete", title: "You're a Space Explorer!", content: "Amazing! You learned about our solar system!" }
      ]
    }
  },
  coding: {
    "1": {
      title: "What is Coding?",
      steps: [
        { type: "intro", title: "Welcome to Coding!", content: "Coding is how we tell computers what to do. It's like giving instructions!" },
        { type: "content", title: "Instructions", content: "Imagine you're giving directions to a robot:\n\n1. Move forward\n2. Turn left\n3. Move forward\n4. Pick up the apple\n\nThat's coding!" },
        { type: "activity", title: "Give Instructions!", activity: "code", content: "Help the robot reach the star!" },
        { type: "quiz", title: "Coding Quiz!", question: "What is coding?", options: ["Drawing pictures", "Giving instructions to computers", "Playing games", "Reading books"], correctAnswer: 1 },
        { type: "complete", title: "You're a Coder!", content: "You understand the basics of coding! Keep learning!" }
      ]
    }
  },
  music: {
    "1": {
      title: "Musical Notes",
      steps: [
        { type: "intro", title: "Let's Make Music!", content: "Music is made of different sounds called notes. Let's learn about them!" },
        { type: "content", title: "The Musical Scale", content: "The basic notes are:\n\nDo - Re - Mi - Fa - Sol - La - Ti - Do\n\n🎵 Each note has a different sound!" },
        { type: "activity", title: "Play the Notes!", activity: "music", content: "Tap each note to hear the sound!" },
        { type: "quiz", title: "Music Quiz!", question: "What comes after 'Do'?", options: ["Mi", "Re", "Fa", "Sol"], correctAnswer: 1 },
        { type: "complete", title: "You're Musical!", content: "Great job learning about musical notes!" }
      ]
    }
  },
  art: {
    "1": {
      title: "Primary Colors",
      steps: [
        { type: "intro", title: "Color Magic!", content: "Let's learn about colors! There are three special colors called primary colors." },
        { type: "content", title: "Primary Colors", content: "The three primary colors are:\n\n🔴 RED\n🔵 BLUE\n🟡 YELLOW\n\nWith these three colors, you can make any other color!" },
        { type: "content", title: "Mixing Colors", content: "Red + Blue = Purple 💜\nBlue + Yellow = Green 💚\nRed + Yellow = Orange 🧡" },
        { type: "quiz", title: "Color Quiz!", question: "What do you get when you mix red and blue?", options: ["Green", "Orange", "Purple", "Yellow"], correctAnswer: 2 },
        { type: "complete", title: "You're an Artist!", content: "Now you know about colors! Time to create!" }
      ]
    }
  }
}

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  english: BookOpen,
  science: Rocket,
  coding: Code,
  music: Music,
  art: Palette
}

const subjectColors: Record<string, { from: string; to: string }> = {
  math: { from: "from-orange-400", to: "to-amber-400" },
  english: { from: "from-blue-400", to: "to-indigo-400" },
  science: { from: "from-purple-400", to: "to-violet-400" },
  coding: { from: "from-green-400", to: "to-emerald-400" },
  music: { from: "from-pink-400", to: "to-rose-400" },
  art: { from: "from-cyan-400", to: "to-teal-400" }
}

function LessonPlayerContent() {
  const params = useParams()
  const router = useRouter()
  const subject = params.subject as string
  const lessonId = params.lessonId as string
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [countNumbers, setCountNumbers] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dbLesson, setDbLesson] = useState<{ id: string, title: string, description: string | null } | null>(null)
  
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId')

  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch(`/api/curriculum/lessons/${subject}`)
        const data = await res.json()
        let found = null
        if (data.units) {
          for (const unit of data.units) {
            for (const l of unit.lessons) {
              if (l.id === lessonId) {
                found = l
                break
              }
            }
            if (found) break
          }
        }
        setDbLesson(found)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadLesson()
  }, [subject, lessonId])
  
  // Get lesson data or use default based on subject and title
  const getLessonContentData = () => {
    const title = dbLesson?.title || "Interactive Lesson"
    const description = dbLesson?.description || "Let's learn something new!"
    
    // Check specific static content by title
    for (const key in lessonContent[subject] || {}) {
      if (title.toLowerCase().includes(lessonContent[subject][key].title.toLowerCase())) {
        return lessonContent[subject][key]
      }
    }
    
    // Subject-specific dynamic content
    if (subject === 'math') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Let's Learn ${title}!`, content: description },
          { type: "content" as const, title: "Math is Fun", content: "Numbers and shapes help us understand the world!" },
          { type: "activity" as const, title: "Count Along!", activity: "count", content: "Tap the numbers to practice!" },
          { type: "quiz" as const, title: "Math Quiz!", question: "What is 2 + 2?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
          { type: "complete" as const, title: "Math Master!", content: "You earned your stars!" }
        ]
      }
    }
    if (subject === 'english') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Story Time: ${title}`, content: description },
          { type: "content" as const, title: "Words are Magic", content: "Reading helps us go on adventures in our minds!" },
          { type: "activity" as const, title: "Practice Letters!", activity: "trace", content: "Let's practice our letters!" },
          { type: "quiz" as const, title: "Word Quiz!", question: "Which word starts with the letter 'B'?", options: ["Apple", "Cat", "Dog", "Ball"], correctAnswer: 3 },
          { type: "complete" as const, title: "Great Reader!", content: "You completed the English lesson!" }
        ]
      }
    }
    if (subject === 'science') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Science Explorer: ${title}`, content: description },
          { type: "content" as const, title: "How Things Work", content: "Science helps us discover how the universe works!" },
          { type: "quiz" as const, title: "Science Quiz!", question: "What do plants need to grow?", options: ["Candy", "Sunlight & Water", "Toys", "Blankets"], correctAnswer: 1 },
          { type: "complete" as const, title: "Super Scientist!", content: "You made a great discovery!" }
        ]
      }
    }
    if (subject === 'coding') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Code Builder: ${title}`, content: description },
          { type: "content" as const, title: "Talking to Computers", content: "Coding is how we give instructions to computers." },
          { type: "activity" as const, title: "Give Instructions!", activity: "code", content: "Help the robot reach the star!" },
          { type: "quiz" as const, title: "Coding Quiz!", question: "What is a bug in coding?", options: ["An insect", "A mistake in the code", "A fast computer", "A video game"], correctAnswer: 1 },
          { type: "complete" as const, title: "Awesome Coder!", content: "Your code ran perfectly!" }
        ]
      }
    }
    if (subject === 'music') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Music Maker: ${title}`, content: description },
          { type: "content" as const, title: "Feel the Rhythm", content: "Music is made of sounds and silence." },
          { type: "activity" as const, title: "Play the Notes!", activity: "music", content: "Tap each note to hear the sound!" },
          { type: "quiz" as const, title: "Music Quiz!", question: "Which of these is a musical instrument?", options: ["Table", "Shoe", "Piano", "Apple"], correctAnswer: 2 },
          { type: "complete" as const, title: "Great Musician!", content: "That sounded beautiful!" }
        ]
      }
    }
    if (subject === 'art') {
      return {
        title,
        steps: [
          { type: "intro" as const, title: `Art Creator: ${title}`, content: description },
          { type: "content" as const, title: "Colors and Shapes", content: "Art lets you express your imagination!" },
          { type: "quiz" as const, title: "Art Quiz!", question: "What tool do we use to paint?", options: ["Spoon", "Brush", "Hammer", "Comb"], correctAnswer: 1 },
          { type: "complete" as const, title: "Creative Artist!", content: "Your artwork is amazing!" }
        ]
      }
    }

    // Default fallback
    return {
      title,
      steps: [
        { type: "intro" as const, title: `Welcome to ${title}!`, content: description },
        { type: "content" as const, title: "Learning Time", content: "This lesson is full of fun activities and quizzes!" },
        { type: "quiz" as const, title: "Quiz!", question: "Are you having fun?", options: ["Yes!", "Absolutely!", "Let's go!", "I'm excited!"], correctAnswer: 0 },
        { type: "complete" as const, title: "Great Job!", content: "You completed this lesson!" }
      ]
    }
  }

  const lesson = getLessonContentData()
  
  const currentStepData = lesson.steps[currentStep]
  const Icon = subjectIcons[subject] || Calculator
  const colors = subjectColors[subject] || { from: "from-primary", to: "to-orange-400" }
  const progress = ((currentStep + 1) / lesson.steps.length) * 100

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const correct = index === currentStepData.correctAnswer
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 10)
    }
  }

  const handleComplete = async () => {
    if (saving) return
    setSaving(true)
    
    try {
      if (lessonId && childId) {
        // Save progress to database using the existing lessonId from the URL
        const starsEarned = 3 // Fixed reward per lesson
        await fetch('/api/curriculum/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lessonId,
            studentId: childId,
            score,
            starsEarned,
            timeSpentSeconds: 0,
            completed: true
          })
        })
      }
    } catch (error) {
      console.error('[v0] Error saving progress:', error)
    }
    
    setSaving(false)
    router.push(`/dashboard/parent/curriculum/${subject}${childId ? `?childId=${childId}` : ''}`)
  }

  const handleCountNumber = (num: number) => {
    if (!countNumbers.includes(num)) {
      setCountNumbers([...countNumbers, num])
      setScore(score + 5)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center`}>
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 opacity-80" />
          <p className="font-medium opacity-90">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.from} ${colors.to}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/parent/curriculum/${subject}${childId ? `?childId=${childId}` : ''}`} className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${colors.from} ${colors.to} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-foreground">{lesson.title}</h1>
                  <p className="text-xs text-muted-foreground capitalize">{subject} Lesson</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Score */}
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-yellow-700">{score}</span>
              </div>
              
              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Home */}
              <Link href="/dashboard/student" className="p-2 hover:bg-muted rounded-full transition-colors">
                <Home className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Step Content */}
              <div className="p-6 md:p-10">
                {/* Intro Step */}
                {currentStepData.type === "intro" && (
                  <div className="text-center py-8">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <Image
                        src="/images/professor-whiskers-new.png"
                        alt="Professor Whiskers"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{currentStepData.title}</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">{currentStepData.content}</p>
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className={`mt-8 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-full px-8`}
                    >
                      Let's Start! <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Content Step */}
                {currentStepData.type === "content" && (
                  <div className="py-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">{currentStepData.title}</h2>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8">
                      <p className="text-lg md:text-xl leading-relaxed whitespace-pre-line text-foreground">
                        {currentStepData.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Activity Step */}
                {currentStepData.type === "activity" && (
                  <div className="py-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{currentStepData.title}</h2>
                    <p className="text-muted-foreground mb-8">{currentStepData.content}</p>
                    
                    {currentStepData.activity === "count" && (
                      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <button
                            key={num}
                            onClick={() => handleCountNumber(num)}
                            className={`w-14 h-14 rounded-2xl text-xl font-bold transition-all transform hover:scale-110 ${
                              countNumbers.includes(num)
                                ? "bg-green-500 text-white scale-105"
                                : `bg-gradient-to-br ${colors.from} ${colors.to} text-white`
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentStepData.activity === "trace" && (
                      <div className="bg-muted rounded-2xl p-8 max-w-md mx-auto">
                        <p className="text-6xl font-bold text-primary">A B C D E</p>
                        <p className="text-sm text-muted-foreground mt-4">Touch and trace each letter!</p>
                      </div>
                    )}

                    {currentStepData.activity === "music" && (
                      <div className="flex justify-center gap-2">
                        {["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti"].map((note, i) => (
                          <button
                            key={note}
                            onClick={() => setScore(score + 2)}
                            className={`w-12 h-24 rounded-lg bg-gradient-to-b from-white to-gray-100 border-2 border-gray-300 hover:from-primary hover:to-orange-400 hover:text-white transition-all transform hover:scale-105 flex items-end justify-center pb-2 text-xs font-bold shadow-lg`}
                          >
                            {note}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentStepData.activity === "code" && (
                      <div className="bg-gray-900 rounded-2xl p-6 max-w-md mx-auto text-left">
                        <div className="flex gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <pre className="text-green-400 font-mono text-sm">
{`function moveRobot() {
  moveForward();
  turnLeft();
  moveForward();
  pickUp("star");
}`}
                        </pre>
                        <Button onClick={() => setScore(score + 15)} className="mt-4 bg-green-500 hover:bg-green-600">
                          <Play className="w-4 h-4 mr-2" /> Run Code
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Step */}
                {currentStepData.type === "quiz" && (
                  <div className="py-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{currentStepData.title}</h2>
                    <p className="text-xl text-foreground mb-8">{currentStepData.question}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                      {currentStepData.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 ${
                            selectedAnswer === null
                              ? "bg-white border-2 border-gray-200 hover:border-primary"
                              : selectedAnswer === index
                              ? isCorrect
                                ? "bg-green-500 text-white border-2 border-green-500"
                                : "bg-red-500 text-white border-2 border-red-500"
                              : index === currentStepData.correctAnswer && selectedAnswer !== null
                              ? "bg-green-500 text-white border-2 border-green-500"
                              : "bg-gray-100 border-2 border-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {selectedAnswer !== null && (
                      <div className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                        <p className={`font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {isCorrect ? "Correct! Great job! +10 points" : "Oops! That's not right. Try the next one!"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete Step */}
                {currentStepData.type === "complete" && (
                  <div className="py-8 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 relative animate-bounce">
                      <Trophy className="w-full h-full text-yellow-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{currentStepData.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{currentStepData.content}</p>
                    
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 max-w-sm mx-auto mb-8">
                      <p className="text-sm text-muted-foreground mb-2">Total Score</p>
                      <p className="text-4xl font-bold text-primary">{score} points</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => {
                          setCurrentStep(0)
                          setScore(0)
                          setCountNumbers([])
                        }}
                        variant="outline"
                        className="rounded-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                      </Button>
                      <Button
                        onClick={handleComplete}
                        disabled={saving}
                        className={`bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-full`}
                      >
                        {saving ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                        ) : (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Complete Lesson</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              {currentStepData.type !== "intro" && currentStepData.type !== "complete" && (
                <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-gray-50">
                  <Button
                    onClick={handlePrev}
                    variant="ghost"
                    disabled={currentStep === 0}
                    className="rounded-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {lesson.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                            ? `bg-gradient-to-r ${colors.from} ${colors.to} w-6`
                            : index < currentStep
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    className={`bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-full`}
                    disabled={currentStepData.type === "quiz" && selectedAnswer === null}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function LessonPlayer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonPlayerContent />
    </Suspense>
  )
}
