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
  Lightbulb,
  X
} from "lucide-react"

const wordList = [
  { word: "CAT", hint: "A furry pet that says meow" },
  { word: "DOG", hint: "A loyal pet that barks" },
  { word: "SUN", hint: "Shines bright in the sky" },
  { word: "HAT", hint: "You wear it on your head" },
  { word: "BED", hint: "Where you sleep at night" },
  { word: "CUP", hint: "You drink from it" },
  { word: "PIG", hint: "A pink farm animal" },
  { word: "BUS", hint: "A big vehicle for passengers" },
  { word: "RED", hint: "Color of apples and fire trucks" },
  { word: "BOX", hint: "You put things inside it" },
  { word: "FISH", hint: "Swims in water" },
  { word: "BIRD", hint: "Has wings and can fly" },
  { word: "TREE", hint: "Tall plant with leaves" },
  { word: "STAR", hint: "Twinkles in the night sky" },
  { word: "MOON", hint: "Shines at night" },
  { word: "BOOK", hint: "You read stories from it" },
  { word: "BALL", hint: "Round toy you can throw" },
  { word: "CAKE", hint: "Sweet dessert for birthdays" },
  { word: "FROG", hint: "Green animal that jumps" },
  { word: "RAIN", hint: "Water falling from clouds" },
]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function WordBuilderGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [usedWords, setUsedWords] = useState<number[]>([])

  const currentWord = wordList[currentWordIndex]
  const builtWord = selectedLetters.map(i => shuffledLetters[i]).join("")

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setWordsCompleted(0)
    setUsedWords([])
    loadNewWord()
  }

  const loadNewWord = () => {
    // Find an unused word
    let availableIndices = wordList.map((_, i) => i).filter(i => !usedWords.includes(i))
    if (availableIndices.length === 0) {
      // All words completed!
      setGameState("gameover")
      return
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setCurrentWordIndex(randomIndex)
    setUsedWords(prev => [...prev, randomIndex])
    
    const word = wordList[randomIndex].word
    // Add some extra random letters to make it harder
    const extraLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const extras = Array(Math.min(2, 6 - word.length))
      .fill(0)
      .map(() => extraLetters[Math.floor(Math.random() * extraLetters.length)])
    
    setShuffledLetters(shuffleArray([...word.split(""), ...extras]))
    setSelectedLetters([])
    setShowHint(false)
    setFeedback(null)
  }

  const selectLetter = (index: number) => {
    if (selectedLetters.includes(index)) return
    setSelectedLetters(prev => [...prev, index])
  }

  const removeLetter = (position: number) => {
    setSelectedLetters(prev => prev.filter((_, i) => i !== position))
  }

  const clearSelection = () => {
    setSelectedLetters([])
  }

  const checkWord = () => {
    if (builtWord === currentWord.word) {
      setFeedback("correct")
      const points = showHint ? 5 : 10
      setScore(prev => prev + points)
      setWordsCompleted(prev => prev + 1)
      
      setTimeout(() => {
        if (wordsCompleted + 1 >= 10) {
          setGameState("gameover")
        } else {
          loadNewWord()
        }
      }, 1500)
    } else {
      setFeedback("wrong")
      setTimeout(() => {
        setFeedback(null)
        setSelectedLetters([])
      }, 1000)
    }
  }

  useEffect(() => {
    if (builtWord.length === currentWord?.word.length && gameState === "playing" && !feedback) {
      checkWord()
    }
  }, [builtWord, currentWord, gameState, feedback])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Word Builder
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Start Screen */}
        {gameState === "start" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-5xl font-bold text-white">ABC</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Word Builder</h2>
            <p className="text-muted-foreground mb-8">
              Build words from scrambled letters! Use the hints if you get stuck.
            </p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-4">How to Play:</h3>
              <ul className="text-left text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Tap letters to build the hidden word</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Use hints if you need help (fewer points)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Complete 10 words to finish the game</span>
                </li>
              </ul>
            </Card>
            
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg rounded-full px-12 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && currentWord && (
          <div className="max-w-lg mx-auto">
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">{score}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Word {wordsCompleted + 1} of 10
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="text-yellow-600"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Hint
              </Button>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="mb-6 p-4 bg-yellow-100 rounded-2xl text-center">
                <p className="text-yellow-800 font-medium">Hint: {currentWord.hint}</p>
              </div>
            )}

            {/* Word Slots */}
            <Card className={`p-6 mb-6 text-center shadow-xl transition-all ${
              feedback === "correct" ? "bg-green-100 border-green-500" :
              feedback === "wrong" ? "bg-red-100 border-red-500 animate-shake" :
              "bg-white"
            }`}>
              <p className="text-sm text-muted-foreground mb-4">Build the word:</p>
              <div className="flex justify-center gap-2 mb-4">
                {currentWord.word.split("").map((_, index) => (
                  <div
                    key={index}
                    onClick={() => selectedLetters[index] !== undefined && removeLetter(index)}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
                      selectedLetters[index] !== undefined
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-gray-100 border-dashed border-gray-300"
                    }`}
                  >
                    {selectedLetters[index] !== undefined ? shuffledLetters[selectedLetters[index]] : ""}
                  </div>
                ))}
              </div>
              
              {feedback === "correct" && (
                <p className="text-green-600 font-bold text-lg">Correct!</p>
              )}
              {feedback === "wrong" && (
                <p className="text-red-600 font-bold text-lg">Try again!</p>
              )}
            </Card>

            {/* Letter Tiles */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {shuffledLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => selectLetter(index)}
                  disabled={selectedLetters.includes(index) || feedback !== null}
                  className={`w-14 h-14 rounded-xl text-2xl font-bold shadow-lg transition-all hover:scale-110 ${
                    selectedLetters.includes(index)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-100 text-foreground"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={selectedLetters.length === 0 || feedback !== null}
                className="rounded-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Great Job!</h2>
            <p className="text-muted-foreground mb-6">You completed the word challenge!</p>
            
            <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-500">{score}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-500">{wordsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Words Built</p>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full px-8 py-6"
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
