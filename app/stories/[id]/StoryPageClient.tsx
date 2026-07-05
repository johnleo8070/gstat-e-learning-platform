"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ProfessorPanda } from "@/components/professor-panda"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  Home,
  RotateCcw,
  Volume2
} from "lucide-react"

// Story data for episodes
const storyData: Record<string, {
  title: string
  subject: string
  color: string
  intro: string
  character: string
  steps: {
    type: "intro" | "activity" | "result"
    content: string
    options?: { id: string; label: string; correct?: boolean; icon?: string }[]
    correctAnswer?: string
    successMessage?: string
    failMessage?: string
  }[]
}> = {
  "1": {
    title: "The Rocket That Wouldn't Launch",
    subject: "Coding",
    color: "bg-[oklch(0.7_0.18_300)]",
    intro: "Oh no! Robot built a rocket, but it won't start! We need to give Robot the right commands to reach the launch button.",
    character: "🤖",
    steps: [
      {
        type: "intro",
        content: "Robot needs to reach the big red button to launch the rocket! What command should Robot do first?"
      },
      {
        type: "activity",
        content: "The button is straight ahead! What should Robot do?",
        options: [
          { id: "forward", label: "Move Forward", icon: "➡️", correct: true },
          { id: "left", label: "Turn Left", icon: "↩️" },
          { id: "jump", label: "Jump", icon: "⬆️" },
        ],
        correctAnswer: "forward",
        successMessage: "Great! Robot moved forward!",
        failMessage: "Hmm, try moving forward instead!"
      },
      {
        type: "activity",
        content: "Robot is getting closer! Keep going!",
        options: [
          { id: "forward", label: "Move Forward", icon: "➡️", correct: true },
          { id: "stop", label: "Stop", icon: "🛑" },
          { id: "back", label: "Go Back", icon: "⬅️" },
        ],
        correctAnswer: "forward",
        successMessage: "Perfect! Almost there!",
        failMessage: "We need to keep moving forward!"
      },
      {
        type: "activity",
        content: "Robot is at the button! What now?",
        options: [
          { id: "push", label: "Push Button", icon: "🔴", correct: true },
          { id: "dance", label: "Dance", icon: "💃" },
          { id: "sleep", label: "Sleep", icon: "😴" },
        ],
        correctAnswer: "push",
        successMessage: "BLAST OFF! 🚀 The rocket launches into space!",
        failMessage: "Try pushing the button!"
      },
      {
        type: "result",
        content: "Amazing job! You helped Robot launch the rocket using coding commands!"
      }
    ]
  },
  "2": {
    title: "Dino Lost His Numbers",
    subject: "Maths",
    color: "bg-[oklch(0.65_0.22_250)]",
    intro: "Oh dear! Dinosaur dropped all his number blocks and they got mixed up! Can you help put them back in order?",
    character: "🦕",
    steps: [
      {
        type: "intro",
        content: "Dino needs the numbers 1, 2, 3 in the right order. Let's start!"
      },
      {
        type: "activity",
        content: "Which number comes FIRST?",
        options: [
          { id: "3", label: "3", icon: "3️⃣" },
          { id: "1", label: "1", icon: "1️⃣", correct: true },
          { id: "2", label: "2", icon: "2️⃣" },
        ],
        correctAnswer: "1",
        successMessage: "Yes! 1 comes first!",
        failMessage: "Remember, we start counting from 1!"
      },
      {
        type: "activity",
        content: "Great! What number comes after 1?",
        options: [
          { id: "2", label: "2", icon: "2️⃣", correct: true },
          { id: "3", label: "3", icon: "3️⃣" },
          { id: "5", label: "5", icon: "5️⃣" },
        ],
        correctAnswer: "2",
        successMessage: "Wonderful! 1, 2...",
        failMessage: "After 1 comes 2!"
      },
      {
        type: "activity",
        content: "Almost done! What number comes last?",
        options: [
          { id: "1", label: "1", icon: "1️⃣" },
          { id: "2", label: "2", icon: "2️⃣" },
          { id: "3", label: "3", icon: "3️⃣", correct: true },
        ],
        correctAnswer: "3",
        successMessage: "1, 2, 3! Perfect counting!",
        failMessage: "The last number is 3!"
      },
      {
        type: "result",
        content: "Hooray! Dino is so happy! You helped put all the numbers in order: 1, 2, 3!"
      }
    ]
  },
  "3": {
    title: "The Sleepy Robot",
    subject: "Coding",
    color: "bg-[oklch(0.7_0.18_300)]",
    intro: "Robot is sleeping because his code sequence got mixed up! We need to fix it so Robot can wake up and dance!",
    character: "🤖",
    steps: [
      {
        type: "intro",
        content: "Robot needs these commands in the right order: Wake Up → Stand Up → Dance! What comes first?"
      },
      {
        type: "activity",
        content: "What should Robot do FIRST?",
        options: [
          { id: "dance", label: "Dance", icon: "💃" },
          { id: "wake", label: "Wake Up", icon: "👀", correct: true },
          { id: "stand", label: "Stand Up", icon: "🧍" },
        ],
        correctAnswer: "wake",
        successMessage: "Robot opens his eyes! What's next?",
        failMessage: "Robot needs to wake up first!"
      },
      {
        type: "activity",
        content: "Robot is awake! What should Robot do next?",
        options: [
          { id: "stand", label: "Stand Up", icon: "🧍", correct: true },
          { id: "sleep", label: "Go to Sleep", icon: "😴" },
          { id: "dance", label: "Dance", icon: "💃" },
        ],
        correctAnswer: "stand",
        successMessage: "Robot stands up tall!",
        failMessage: "Robot should stand up before dancing!"
      },
      {
        type: "activity",
        content: "Robot is standing! Now what?",
        options: [
          { id: "sit", label: "Sit Down", icon: "🪑" },
          { id: "dance", label: "Dance", icon: "💃", correct: true },
          { id: "sleep", label: "Sleep", icon: "😴" },
        ],
        correctAnswer: "dance",
        successMessage: "Robot does a happy dance! 🎉",
        failMessage: "It's time to dance!"
      },
      {
        type: "result",
        content: "You fixed the sequence! Wake Up → Stand Up → Dance! Robot is so happy he's dancing!"
      }
    ]
  },
  "4": {
    title: "The Missing Letter Mystery",
    subject: "English",
    color: "bg-[oklch(0.7_0.2_25)]",
    intro: "Some letters disappeared from words! Can you find the missing letters to complete the words?",
    character: "🔍",
    steps: [
      {
        type: "intro",
        content: "Let's solve the mystery of the missing letters! Look at each word carefully."
      },
      {
        type: "activity",
        content: "What letter is missing? C _ T (a furry pet that says meow)",
        options: [
          { id: "A", label: "A", correct: true },
          { id: "O", label: "O" },
          { id: "U", label: "U" },
        ],
        correctAnswer: "A",
        successMessage: "Yes! C-A-T spells CAT! 🐱",
        failMessage: "Think about a furry pet that says meow!"
      },
      {
        type: "activity",
        content: "What letter is missing? D _ G (a pet that barks)",
        options: [
          { id: "O", label: "O", correct: true },
          { id: "I", label: "I" },
          { id: "A", label: "A" },
        ],
        correctAnswer: "O",
        successMessage: "Correct! D-O-G spells DOG! 🐕",
        failMessage: "This pet barks and loves to play fetch!"
      },
      {
        type: "activity",
        content: "What letter is missing? S _ N (it shines in the sky)",
        options: [
          { id: "A", label: "A" },
          { id: "U", label: "U", correct: true },
          { id: "I", label: "I" },
        ],
        correctAnswer: "U",
        successMessage: "Amazing! S-U-N spells SUN! ☀️",
        failMessage: "This shines bright in the sky during the day!"
      },
      {
        type: "result",
        content: "Mystery solved! You found all the missing letters: CAT, DOG, SUN! You're a word detective!"
      }
    ]
  }
}

export function generateStaticParams() {
  return Object.keys(storyData).map((id) => ({
    id: id,
  }))
}

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [pandaMessage, setPandaMessage] = useState("")

  const story = storyData[storyId]

  useEffect(() => {
    if (story) {
      setPandaMessage(story.intro)
      const questions = story.steps.filter(s => s.type === "activity").length
      setTotalQuestions(questions)
    }
  }, [story])

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Story not found</h1>
          <Link href="/stories">
            <Button className="rounded-full">Back to Stories</Button>
          </Link>
        </div>
      </div>
    )
  }

  const step = story.steps[currentStep]
  const progress = ((currentStep + 1) / story.steps.length) * 100

  const handleAnswer = (answerId: string) => {
    if (isCorrect !== null) return
    setSelectedAnswer(answerId)
  }

  const checkAnswer = () => {
    if (!step.correctAnswer || !selectedAnswer) return

    const correct = selectedAnswer === step.correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setPandaMessage(step.successMessage || "Great job!")
    } else {
      setPandaMessage(step.failMessage || "Try again!")
    }
  }

  const nextStep = () => {
    if (currentStep < story.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      const nextStepData = story.steps[currentStep + 1]
      setPandaMessage(nextStepData.content)
    }
  }

  const restartStory = () => {
    setCurrentStep(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setScore(0)
    setPandaMessage(story.intro)
  }

  const stars = Math.ceil((score / totalQuestions) * 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className={cn("py-4 px-4 sticky top-0 z-40", story.color)}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/stories">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-32">
        <div className="max-w-2xl w-full">
          {/* Character and Panda */}
          <div className="flex justify-center items-end gap-4 mb-6">
            <div className="text-6xl animate-bounce-gentle">{story.character}</div>
            <ProfessorPanda
              size="md"
              mood={isCorrect === true ? "excited" : isCorrect === false ? "thinking" : "happy"}
              showSpeechBubble
              message={pandaMessage}
            />
          </div>

          {/* Story Title */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-6">
            {story.title}
          </h1>

          {/* Step Content */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-playful">
            {step.type === "intro" && (
              <div className="text-center">
                <p className="text-lg text-card-foreground mb-6">{step.content}</p>
                <Button
                  size="lg"
                  className="rounded-full font-bold"
                  onClick={nextStep}
                >
                  Let&apos;s Start! <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {step.type === "activity" && step.options && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-card-foreground">
                    {step.content}
                  </h2>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {step.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={isCorrect !== null}
                      className={cn(
                        "p-6 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-2",
                        selectedAnswer === option.id
                          ? isCorrect === true
                            ? "border-accent bg-accent/10"
                            : isCorrect === false
                              ? "border-destructive bg-destructive/10"
                              : "border-primary bg-primary/10"
                          : "border-transparent bg-muted hover:border-primary/50",
                        isCorrect !== null && option.correct && "border-accent bg-accent/10"
                      )}
                    >
                      <span className="text-4xl">{option.icon}</span>
                      <span className="font-display font-bold text-card-foreground">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.type === "result" && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-display font-bold text-card-foreground mb-4">
                  Story Complete!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">{step.content}</p>

                <StarRating earned={stars} total={3} size="lg" animated className="justify-center mb-6" />

                <p className="text-muted-foreground mb-6">
                  You got {score} out of {totalQuestions} correct!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="rounded-full font-bold"
                    onClick={() => router.push('/stories')}
                  >
                    More Stories
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full font-bold"
                    onClick={restartStory}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      {step.type === "activity" && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="max-w-2xl mx-auto flex justify-center gap-4">
            {isCorrect === null ? (
              <Button
                size="lg"
                className="rounded-full px-12 font-bold"
                onClick={checkAnswer}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            ) : (
              <Button
                size="lg"
                className="rounded-full px-12 font-bold"
                onClick={nextStep}
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
