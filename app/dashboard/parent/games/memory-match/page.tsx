"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Star, 
  Sparkles,
  RotateCcw,
  Trophy,
  Clock,
  Zap
} from "lucide-react"

const cardSymbols = [
  { symbol: "🐶", name: "Dog" },
  { symbol: "🐱", name: "Cat" },
  { symbol: "🐰", name: "Rabbit" },
  { symbol: "🦊", name: "Fox" },
  { symbol: "🐻", name: "Bear" },
  { symbol: "🐼", name: "Panda" },
  { symbol: "🦁", name: "Lion" },
  { symbol: "🐯", name: "Tiger" },
  { symbol: "🐸", name: "Frog" },
  { symbol: "🐵", name: "Monkey" },
  { symbol: "🦋", name: "Butterfly" },
  { symbol: "🌸", name: "Flower" },
]

type CardType = {
  id: number
  symbol: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function MemoryMatchGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [time, setTime] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)

  const getPairCount = () => {
    switch (difficulty) {
      case "easy": return 6
      case "medium": return 8
      case "hard": return 12
    }
  }

  const getGridCols = () => {
    switch (difficulty) {
      case "easy": return "grid-cols-3"
      case "medium": return "grid-cols-4"
      case "hard": return "grid-cols-4 md:grid-cols-6"
    }
  }

  const startGame = () => {
    const pairCount = getPairCount()
    const selectedSymbols = shuffleArray(cardSymbols).slice(0, pairCount)
    const gameCards: CardType[] = []
    
    selectedSymbols.forEach((item, index) => {
      gameCards.push(
        { id: index * 2, symbol: item.symbol, name: item.name, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol: item.symbol, name: item.name, isFlipped: false, isMatched: false }
      )
    })
    
    setCards(shuffleArray(gameCards))
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTime(0)
    setGameState("playing")
  }

  const flipCard = (id: number) => {
    if (flippedCards.length >= 2) return
    
    const card = cards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return
    
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ))
    setFlippedCards(prev => [...prev, id])
  }

  // Check for matches
  useEffect(() => {
    if (flippedCards.length !== 2) return
    
    setMoves(prev => prev + 1)
    
    const [first, second] = flippedCards
    const firstCard = cards.find(c => c.id === first)
    const secondCard = cards.find(c => c.id === second)
    
    if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
      // Match found!
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === first || c.id === second ? { ...c, isMatched: true } : c
        ))
        setMatches(prev => prev + 1)
        setFlippedCards([])
      }, 500)
    } else {
      // No match - flip back
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === first || c.id === second ? { ...c, isFlipped: false } : c
        ))
        setFlippedCards([])
      }, 1000)
    }
  }, [flippedCards, cards])

  // Check win condition
  useEffect(() => {
    if (matches === getPairCount() && gameState === "playing") {
      setGameState("gameover")
      if (!bestTime || time < bestTime) {
        setBestTime(time)
      }
    }
  }, [matches, gameState, time, bestTime])

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return
    
    const timer = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-violet-50 to-pink-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
            Memory Match
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-5xl">🧠</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Memory Match</h2>
            <p className="text-muted-foreground mb-8">
              Find all the matching pairs! Train your memory and have fun!
            </p>
            
            {/* Difficulty Selection */}
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-4">Select Difficulty:</h3>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all capitalize ${
                      difficulty === level
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-foreground"
                    }`}
                  >
                    {level}
                    <span className="block text-xs opacity-75">
                      {level === "easy" ? "6 pairs" : level === "medium" ? "8 pairs" : "12 pairs"}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {bestTime && (
              <p className="text-muted-foreground mb-4">
                Best Time: <span className="font-bold text-purple-500">{formatTime(bestTime)}</span>
              </p>
            )}
            
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (
          <div className="max-w-2xl mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-lg">{formatTime(time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{moves} moves</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-500" />
                <span className="font-medium">{matches}/{getPairCount()}</span>
              </div>
            </div>

            {/* Card Grid */}
            <div className={`grid ${getGridCols()} gap-3 md:gap-4`}>
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  disabled={card.isFlipped || card.isMatched}
                  className={`aspect-square rounded-xl text-4xl md:text-5xl font-bold transition-all duration-300 transform ${
                    card.isMatched
                      ? "bg-green-200 scale-95 opacity-75"
                      : card.isFlipped
                      ? "bg-white shadow-lg scale-105"
                      : "bg-gradient-to-br from-purple-400 to-violet-500 hover:scale-105 cursor-pointer shadow-lg"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {(card.isFlipped || card.isMatched) ? card.symbol : "?"}
                </button>
              ))}
            </div>

            {/* Restart Button */}
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={startGame}
                className="rounded-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">You Did It!</h2>
            <p className="text-muted-foreground mb-6">All pairs matched!</p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-purple-500">{formatTime(time)}</p>
                  <p className="text-sm text-muted-foreground">Time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-500">{moves}</p>
                  <p className="text-sm text-muted-foreground">Moves</p>
                </div>
              </div>
              {bestTime === time && (
                <div className="mt-4 py-2 px-4 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full inline-flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-700">New Best Time!</span>
                </div>
              )}
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-full px-8 py-6"
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
