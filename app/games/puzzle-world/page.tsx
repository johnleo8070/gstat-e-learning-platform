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
  Clock
} from "lucide-react"

const puzzleImages = [
  { id: 1, name: "Cat", emoji: "🐱" },
  { id: 2, name: "Dog", emoji: "🐕" },
  { id: 3, name: "Star", emoji: "⭐" },
  { id: 4, name: "Heart", emoji: "❤️" },
  { id: 5, name: "Sun", emoji: "☀️" },
  { id: 6, name: "Moon", emoji: "🌙" },
]

type Tile = {
  id: number
  position: number
  isCorrect: boolean
}

export default function PuzzleWorldGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [gridSize, setGridSize] = useState(3)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [emptyPosition, setEmptyPosition] = useState(8)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [selectedPuzzle, setSelectedPuzzle] = useState(puzzleImages[0])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const isSolvable = (arr: number[]): boolean => {
    let inversions = 0
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j] && arr[i] !== gridSize * gridSize - 1 && arr[j] !== gridSize * gridSize - 1) {
          inversions++
        }
      }
    }
    return inversions % 2 === 0
  }

  const startGame = () => {
    const totalTiles = gridSize * gridSize
    let positions: number[]
    
    do {
      positions = shuffleArray([...Array(totalTiles - 1).keys()])
    } while (!isSolvable(positions))
    
    const newTiles: Tile[] = positions.map((id, index) => ({
      id,
      position: index,
      isCorrect: id === index
    }))
    
    setTiles(newTiles)
    setEmptyPosition(totalTiles - 1)
    setMoves(0)
    setTime(0)
    setGameState("playing")
  }

  const canMove = (position: number): boolean => {
    const row = Math.floor(position / gridSize)
    const col = position % gridSize
    const emptyRow = Math.floor(emptyPosition / gridSize)
    const emptyCol = emptyPosition % gridSize
    
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    )
  }

  const moveTile = (tileIndex: number) => {
    const tile = tiles[tileIndex]
    if (!canMove(tile.position)) return
    
    const newTiles = tiles.map((t, i) => {
      if (i === tileIndex) {
        return { ...t, position: emptyPosition, isCorrect: t.id === emptyPosition }
      }
      return t
    })
    
    setEmptyPosition(tile.position)
    setTiles(newTiles)
    setMoves(prev => prev + 1)
  }

  const checkWin = (): boolean => {
    return tiles.every((tile, index) => tile.position === tile.id)
  }

  useEffect(() => {
    if (gameState === "playing" && tiles.length > 0 && checkWin()) {
      setGameState("gameover")
    }
  }, [tiles, gameState])

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

  const getTileStyle = (position: number) => {
    const row = Math.floor(position / gridSize)
    const col = position % gridSize
    const size = 100 / gridSize
    return {
      top: `${row * size}%`,
      left: `${col * size}%`,
      width: `${size}%`,
      height: `${size}%`,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 via-teal-50 to-cyan-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Puzzle World
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-5xl">🧩</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Puzzle World</h2>
            <p className="text-muted-foreground mb-8">
              Slide the tiles to solve the puzzle! Move pieces to put them in order.
            </p>
            
            {/* Grid Size Selection */}
            <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-4">Select Difficulty:</h3>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      gridSize === size
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-foreground"
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </Card>
            
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (
          <div className="max-w-md mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="font-bold">{formatTime(time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Moves: {moves}</span>
              </div>
            </div>

            {/* Puzzle Grid */}
            <div 
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden mx-auto"
              style={{ 
                width: "min(100%, 350px)", 
                aspectRatio: "1/1" 
              }}
            >
              {tiles.map((tile, index) => (
                <button
                  key={tile.id}
                  onClick={() => moveTile(index)}
                  disabled={!canMove(tile.position)}
                  className={`absolute flex items-center justify-center text-3xl font-bold transition-all duration-200 ${
                    canMove(tile.position) 
                      ? "cursor-pointer hover:scale-95" 
                      : "cursor-default"
                  } ${
                    tile.isCorrect 
                      ? "bg-emerald-200" 
                      : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                  }`}
                  style={{
                    ...getTileStyle(tile.position),
                    border: "2px solid white",
                    borderRadius: "8px",
                  }}
                >
                  {tile.id + 1}
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Puzzle Solved!</h2>
            <p className="text-muted-foreground mb-6">Great job!</p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-emerald-500">{formatTime(time)}</p>
                  <p className="text-sm text-muted-foreground">Time</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-500">{moves}</p>
                  <p className="text-sm text-muted-foreground">Moves</p>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full px-8 py-6"
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
