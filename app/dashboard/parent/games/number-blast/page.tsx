"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Zap, 
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react"

type Problem = {
  num1: number
  num2: number
  operator: "+" | "-"
  answer: number
  options: number[]
}

const generateProblem = (level: number): Problem => {
  const maxNum = Math.min(5 + level * 2, 20)
  const useSubtraction = level > 2 && Math.random() > 0.5
  
  let num1: number, num2: number, answer: number
  const operator = useSubtraction ? "-" : "+"
  
  if (useSubtraction) {
    num1 = Math.floor(Math.random() * maxNum) + 1
    num2 = Math.floor(Math.random() * num1) + 1
    answer = num1 - num2
  } else {
    num1 = Math.floor(Math.random() * maxNum) + 1
    num2 = Math.floor(Math.random() * maxNum) + 1
    answer = num1 + num2
  }
  
  // Generate wrong options
  const wrongOptions = new Set<number>()
  while (wrongOptions.size < 3) {
    const wrong = answer + Math.floor(Math.random() * 10) - 5
    if (wrong !== answer && wrong >= 0) {
      wrongOptions.add(wrong)
    }
  }
  
  const options = [...wrongOptions, answer].sort(() => Math.random() - 0.5)
  
  return { num1, num2, operator, answer, options }
}

export default function NumberBlastGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [highScore, setHighScore] = useState(0)

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setLives(3)
    setLevel(1)
    setStreak(0)
    setTimeLeft(10)
    setProblem(generateProblem(1))
    setFeedback(null)
  }

  const handleAnswer = useCallback((selected: number) => {
    if (!problem || feedback) return
    
    if (selected === problem.answer) {
      setFeedback("correct")
      const points = 10 + streak * 5 + (timeLeft > 5 ? 5 : 0)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      
      // Level up every 5 correct answers
      if ((score + points) % 50 === 0 || streak > 0 && streak % 5 === 0) {
        setLevel(prev => Math.min(prev + 1, 10))
      }
    } else {
      setFeedback("wrong")
      setLives(prev => prev - 1)
      setStreak(0)
    }
    
    setTimeout(() => {
      if (lives <= 1 && selected !== problem.answer) {
        setGameState("gameover")
        if (score > highScore) {
          setHighScore(score)
        }
      } else {
        setProblem(generateProblem(level))
        setFeedback(null)
        setTimeLeft(Math.max(10 - level, 5))
      }
    }, 1000)
  }, [problem, feedback, streak, timeLeft, score, lives, level, highScore])

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || feedback) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1) // Wrong answer on timeout
          return 10
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState, feedback, handleAnswer])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-50 to-yellow-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Number Blast
          </h1>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Number Blast!</h2>
            <p className="text-muted-foreground mb-8">
              Solve math problems as fast as you can! Answer correctly to earn points and keep your streak going.
            </p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-4">How to Play:</h3>
              <ul className="text-left text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Look at the math problem and pick the correct answer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>You have 3 lives - wrong answers cost 1 life</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Answer quickly for bonus points!</span>
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Build streaks for even more points</span>
                </li>
              </ul>
            </Card>

            {highScore > 0 && (
              <p className="text-muted-foreground mb-4">
                High Score: <span className="font-bold text-amber-500">{highScore}</span>
              </p>
            )}
            
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && problem && (
          <div className="max-w-lg mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-6 h-6 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="font-medium">x{streak}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Level {level}
              </div>
            </div>

            {/* Timer Bar */}
            <div className="mb-8">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${
                    timeLeft > 5 ? "bg-green-500" : timeLeft > 3 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Problem Card */}
            <Card className={`p-8 mb-8 text-center shadow-xl transition-all duration-300 ${
              feedback === "correct" ? "bg-green-100 border-green-500" : 
              feedback === "wrong" ? "bg-red-100 border-red-500" : 
              "bg-white"
            }`}>
              <div className="text-6xl md:text-7xl font-bold text-foreground mb-2">
                {problem.num1} {problem.operator} {problem.num2}
              </div>
              <div className="text-2xl text-muted-foreground">= ?</div>
              
              {feedback && (
                <div className={`mt-4 text-xl font-bold ${
                  feedback === "correct" ? "text-green-600" : "text-red-600"
                }`}>
                  {feedback === "correct" ? "Correct! +Points" : `Wrong! Answer: ${problem.answer}`}
                </div>
              )}
            </Card>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {problem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className={`p-6 text-3xl font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    feedback && option === problem.answer 
                      ? "bg-green-500 text-white" 
                      : feedback && option !== problem.answer 
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Game Over!</h2>
            <p className="text-muted-foreground mb-6">Great effort! Keep practicing to improve!</p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-amber-500">{score}</p>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-500">{level}</p>
                  <p className="text-sm text-muted-foreground">Level Reached</p>
                </div>
              </div>
              {score >= highScore && score > 0 && (
                <div className="mt-4 py-2 px-4 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full inline-flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-700">New High Score!</span>
                </div>
              )}
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full px-8 py-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Link href="/games">
                <Button variant="outline" className="rounded-full px-8 py-6 w-full sm:w-auto">
                  More Games
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
