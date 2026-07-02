"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Star, 
  Sparkles,
  RotateCcw,
  Trophy,
  Palette
} from "lucide-react"

const colors = [
  { name: "Red", hex: "#ef4444", rgb: "rgb(239, 68, 68)" },
  { name: "Blue", hex: "#3b82f6", rgb: "rgb(59, 130, 246)" },
  { name: "Yellow", hex: "#eab308", rgb: "rgb(234, 179, 8)" },
  { name: "Green", hex: "#22c55e", rgb: "rgb(34, 197, 94)" },
  { name: "Orange", hex: "#f97316", rgb: "rgb(249, 115, 22)" },
  { name: "Purple", hex: "#a855f7", rgb: "rgb(168, 85, 247)" },
  { name: "Pink", hex: "#ec4899", rgb: "rgb(236, 72, 153)" },
  { name: "Brown", hex: "#a16207", rgb: "rgb(161, 98, 7)" },
]

const mixingResults: Record<string, string> = {
  "Red+Blue": "Purple",
  "Blue+Red": "Purple",
  "Red+Yellow": "Orange",
  "Yellow+Red": "Orange",
  "Blue+Yellow": "Green",
  "Yellow+Blue": "Green",
  "Red+White": "Pink",
  "White+Red": "Pink",
}

type GameMode = "identify" | "mix"

export default function ColorSplashGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [gameMode, setGameMode] = useState<GameMode>("identify")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [currentColor, setCurrentColor] = useState<typeof colors[0] | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [streak, setStreak] = useState(0)

  // For mixing mode
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [mixResult, setMixResult] = useState<string | null>(null)
  const [targetColor, setTargetColor] = useState<string>("")

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setRound(1)
    setStreak(0)
    loadNewRound()
  }

  const loadNewRound = () => {
    setFeedback(null)
    setSelectedColors([])
    setMixResult(null)

    if (gameMode === "identify") {
      // Pick a random color
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setCurrentColor(randomColor)
      
      // Generate options including the correct answer
      const wrongOptions = colors
        .filter(c => c.name !== randomColor.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.name)
      
      setOptions(shuffleArray([randomColor.name, ...wrongOptions]))
    } else {
      // Mixing mode - pick a target mixed color
      const mixableColors = ["Purple", "Orange", "Green", "Pink"]
      const target = mixableColors[Math.floor(Math.random() * mixableColors.length)]
      setTargetColor(target)
    }
  }

  const handleIdentifyAnswer = (answer: string) => {
    if (feedback || !currentColor) return
    
    if (answer === currentColor.name) {
      setFeedback("correct")
      setScore(prev => prev + 10 + streak * 2)
      setStreak(prev => prev + 1)
    } else {
      setFeedback("wrong")
      setStreak(0)
    }
    
    setTimeout(() => {
      if (round >= 10) {
        setGameState("gameover")
      } else {
        setRound(prev => prev + 1)
        loadNewRound()
      }
    }, 1500)
  }

  const handleColorSelect = (colorName: string) => {
    if (selectedColors.length >= 2 || selectedColors.includes(colorName)) return
    
    const newSelected = [...selectedColors, colorName]
    setSelectedColors(newSelected)
    
    if (newSelected.length === 2) {
      // Check the mix result
      const mixKey = `${newSelected[0]}+${newSelected[1]}`
      const result = mixingResults[mixKey]
      
      if (result) {
        setMixResult(result)
        
        setTimeout(() => {
          if (result === targetColor) {
            setFeedback("correct")
            setScore(prev => prev + 15)
            setStreak(prev => prev + 1)
          } else {
            setFeedback("wrong")
            setStreak(0)
          }
          
          setTimeout(() => {
            if (round >= 10) {
              setGameState("gameover")
            } else {
              setRound(prev => prev + 1)
              loadNewRound()
            }
          }, 1500)
        }, 1000)
      } else {
        setMixResult("No mix possible")
        setTimeout(() => {
          setSelectedColors([])
          setMixResult(null)
        }, 1000)
      }
    }
  }

  const getMixableColors = () => ["Red", "Blue", "Yellow", "White"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-orange-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Color Splash
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl">
              <Palette className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Color Splash!</h2>
            <p className="text-muted-foreground mb-8">
              Learn colors and how to mix them! Choose a game mode to start.
            </p>
            
            {/* Mode Selection */}
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-4">Choose Mode:</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGameMode("identify")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    gameMode === "identify"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <div className="text-3xl mb-2">🎨</div>
                  <p className="font-medium text-foreground">Identify Colors</p>
                  <p className="text-xs text-muted-foreground">Name the color shown</p>
                </button>
                <button
                  onClick={() => setGameMode("mix")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    gameMode === "mix"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >
                  <div className="text-3xl mb-2">🧪</div>
                  <p className="font-medium text-foreground">Mix Colors</p>
                  <p className="text-xs text-muted-foreground">Create new colors</p>
                </button>
              </div>
            </Card>
            
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {/* Playing Screen - Identify Mode */}
        {gameState === "playing" && gameMode === "identify" && currentColor && (
          <div className="max-w-lg mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">{score}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Round {round} of 10
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Streak: {streak}</span>
              </div>
            </div>

            {/* Color Display */}
            <Card className={`p-8 mb-8 text-center shadow-xl transition-all ${
              feedback === "correct" ? "ring-4 ring-green-500" :
              feedback === "wrong" ? "ring-4 ring-red-500" :
              ""
            }`}>
              <p className="text-muted-foreground mb-4">What color is this?</p>
              <div 
                className="w-40 h-40 mx-auto rounded-3xl shadow-xl mb-4"
                style={{ backgroundColor: currentColor.hex }}
              />
              {feedback && (
                <p className={`text-lg font-bold ${
                  feedback === "correct" ? "text-green-600" : "text-red-600"
                }`}>
                  {feedback === "correct" ? "Correct!" : `It's ${currentColor.name}!`}
                </p>
              )}
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option) => {
                const color = colors.find(c => c.name === option)
                return (
                  <button
                    key={option}
                    onClick={() => handleIdentifyAnswer(option)}
                    disabled={feedback !== null}
                    className={`p-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 ${
                      feedback && option === currentColor.name
                        ? "bg-green-500 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: color?.hex }}
                    />
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Playing Screen - Mix Mode */}
        {gameState === "playing" && gameMode === "mix" && (
          <div className="max-w-lg mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">{score}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Round {round} of 10
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Streak: {streak}</span>
              </div>
            </div>

            {/* Target Color */}
            <Card className={`p-6 mb-6 text-center shadow-xl ${
              feedback === "correct" ? "ring-4 ring-green-500" :
              feedback === "wrong" ? "ring-4 ring-red-500" :
              ""
            }`}>
              <p className="text-muted-foreground mb-2">Mix colors to make:</p>
              <p className="text-3xl font-bold text-foreground">{targetColor}</p>
              {feedback && (
                <p className={`mt-2 text-lg font-bold ${
                  feedback === "correct" ? "text-green-600" : "text-red-600"
                }`}>
                  {feedback === "correct" ? "Perfect mix!" : "Wrong combination!"}
                </p>
              )}
            </Card>

            {/* Mixing Area */}
            <Card className="p-6 mb-6 shadow-xl">
              <div className="flex items-center justify-center gap-4">
                <div className={`w-20 h-20 rounded-2xl border-4 border-dashed flex items-center justify-center ${
                  selectedColors[0] ? "" : "border-gray-300"
                }`} style={{ 
                  backgroundColor: selectedColors[0] ? colors.find(c => c.name === selectedColors[0])?.hex : "transparent"
                }}>
                  {!selectedColors[0] && <span className="text-gray-400">?</span>}
                </div>
                <span className="text-2xl font-bold text-muted-foreground">+</span>
                <div className={`w-20 h-20 rounded-2xl border-4 border-dashed flex items-center justify-center ${
                  selectedColors[1] ? "" : "border-gray-300"
                }`} style={{ 
                  backgroundColor: selectedColors[1] ? colors.find(c => c.name === selectedColors[1])?.hex : "transparent"
                }}>
                  {!selectedColors[1] && <span className="text-gray-400">?</span>}
                </div>
                <span className="text-2xl font-bold text-muted-foreground">=</span>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                  mixResult && mixResult !== "No mix possible" ? "" : "bg-gray-100"
                }`} style={{
                  backgroundColor: mixResult && mixResult !== "No mix possible" 
                    ? colors.find(c => c.name === mixResult)?.hex 
                    : undefined
                }}>
                  {!mixResult && <span className="text-gray-400">?</span>}
                  {mixResult === "No mix possible" && <span className="text-xs text-red-500">No mix</span>}
                </div>
              </div>
            </Card>

            {/* Color Palette */}
            <div className="grid grid-cols-4 gap-3">
              {getMixableColors().map((colorName) => {
                const color = colorName === "White" 
                  ? { name: "White", hex: "#ffffff" }
                  : colors.find(c => c.name === colorName)
                return (
                  <button
                    key={colorName}
                    onClick={() => handleColorSelect(colorName)}
                    disabled={selectedColors.includes(colorName) || feedback !== null}
                    className={`aspect-square rounded-2xl shadow-lg transition-all hover:scale-110 disabled:opacity-50 border-2 ${
                      selectedColors.includes(colorName) ? "border-primary" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color?.hex }}
                  >
                    <span className={`text-xs font-medium ${colorName === "White" || colorName === "Yellow" ? "text-gray-800" : "text-white"}`}>
                      {colorName}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Reset Button */}
            {selectedColors.length > 0 && !feedback && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedColors([])
                    setMixResult(null)
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Amazing!</h2>
            <p className="text-muted-foreground mb-6">You completed the color challenge!</p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-500">{score}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full px-8 py-6"
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
