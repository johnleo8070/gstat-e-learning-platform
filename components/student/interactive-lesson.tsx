"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Check, X, Volume2, Pause, Play } from "lucide-react"

interface InteractiveLessonProps {
  lessonId: string
  title: string
  description: string
  videoUrl?: string
  duration: number
  objectives: string[]
  starsReward: number
  content: any
  onComplete: (score: number, starsEarned: number) => void
}

type LessonStep = 'intro' | 'content' | 'activity' | 'assessment' | 'complete'

export function InteractiveLesson({
  lessonId,
  title,
  description,
  videoUrl,
  duration,
  objectives,
  starsReward,
  content,
  onComplete
}: InteractiveLessonProps) {
  const [step, setStep] = useState<LessonStep>('intro')
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState(0)
  const [starsEarned, setStarsEarned] = useState(0)

  const handleStartLesson = () => {
    setStep('content')
  }

  const handleVideoComplete = () => {
    setVideoProgress(100)
    setTimeout(() => setStep('activity'), 1000)
  }

  const handleActivityComplete = () => {
    setStep('assessment')
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmitAssessment = () => {
    // Calculate score based on correct answers
    let correctCount = 0
    const totalQuestions = content?.assessment?.questions?.length || 1

    if (content?.assessment?.questions) {
      content.assessment.questions.forEach((q: any, idx: number) => {
        if (selectedAnswers[idx] === q.correct_answer) {
          correctCount++
        }
      })
    }

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100)
    const earned = calculatedScore >= 70 ? starsReward : Math.floor(starsReward * 0.5)

    setScore(calculatedScore)
    setStarsEarned(earned)
    setStep('complete')
  }

  return (
    <div className="space-y-4">
      {/* Intro Step */}
      {step === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{description}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900">Learning Objectives:</p>
              <ul className="space-y-1">
                {objectives.map((obj, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex gap-2">
                    <span className="text-blue-600">✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-sm font-medium text-amber-900">
                Complete this lesson to earn {starsReward} stars
              </span>
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            </div>

            <Button onClick={handleStartLesson} className="w-full" size="lg">
              Start Lesson
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Step */}
      {step === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle>Video Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {videoUrl ? (
              <div className="space-y-3">
                <div className="bg-black rounded-lg w-full aspect-video flex items-center justify-center relative overflow-hidden">
                  <img
                    src={videoUrl}
                    alt="Lesson video"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white" />
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(videoProgress)}%</span>
                  </div>
                  <Progress value={videoProgress} />
                  <div className="text-xs text-muted-foreground text-center">
                    Duration: {duration} minutes
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No video content available for this lesson
              </div>
            )}

            <Button
              onClick={() => {
                setVideoProgress(100)
                handleVideoComplete()
              }}
              className="w-full"
              variant="outline"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Activity Step */}
      {step === 'activity' && content?.activity && (
        <Card>
          <CardHeader>
            <CardTitle>Interactive Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <p className="text-center text-lg font-semibold text-blue-900 mb-4">
                {content.activity.title}
              </p>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{content.activity.description}</p>
                <div className="bg-white rounded-lg p-4 mb-4 min-h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Interactive activity space
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleActivityComplete} className="w-full">
              Activity Complete
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assessment Step */}
      {step === 'assessment' && content?.assessment && (
        <Card>
          <CardHeader>
            <CardTitle>Lesson Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.assessment.questions?.map((question: any, idx: number) => (
              <div key={idx} className="border-b pb-4 last:border-b-0">
                <p className="font-medium mb-3">{question.question}</p>
                <div className="space-y-2">
                  {question.options?.map((option: string, optIdx: number) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={selectedAnswers[idx] === option}
                        onChange={(e) => handleAnswerSelect(idx, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button onClick={handleSubmitAssessment} className="w-full" size="lg">
              Submit Assessment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-8 space-y-6 text-center">
            <div className="flex justify-center">
              <Check className="w-16 h-16 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Lesson Complete!</h3>
              <p className="text-green-700">Great job! You've finished this lesson.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-foreground">{score}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stars Earned</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-amber-600">{starsEarned}</p>
                  <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {score >= 90 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-900">🎉 Outstanding! You achieved mastery!</p>
                </div>
              )}
              {score >= 70 && score < 90 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">Good work! Keep practicing to improve!</p>
                </div>
              )}
              {score < 70 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-900">Nice try! Review the lesson and try again.</p>
                </div>
              )}
            </div>

            <Button
              onClick={() => onComplete(score, starsEarned)}
              className="w-full"
              size="lg"
            >
              Back to Lessons
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
