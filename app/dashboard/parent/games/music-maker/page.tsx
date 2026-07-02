"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  Play,
  Square,
  Trash2,
  Volume2
} from "lucide-react"

const notes = [
  { note: "C", frequency: 261.63, color: "bg-red-400" },
  { note: "D", frequency: 293.66, color: "bg-orange-400" },
  { note: "E", frequency: 329.63, color: "bg-yellow-400" },
  { note: "F", frequency: 349.23, color: "bg-green-400" },
  { note: "G", frequency: 392.00, color: "bg-cyan-400" },
  { note: "A", frequency: 440.00, color: "bg-blue-400" },
  { note: "B", frequency: 493.88, color: "bg-purple-400" },
  { note: "C2", frequency: 523.25, color: "bg-pink-400" },
]

const songs = [
  {
    name: "Twinkle Twinkle",
    notes: ["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C"]
  },
  {
    name: "Happy Birthday",
    notes: ["C", "C", "D", "C", "F", "E", "C", "C", "D", "C", "G", "F"]
  },
  {
    name: "Mary Had a Little Lamb",
    notes: ["E", "D", "C", "D", "E", "E", "E", "D", "D", "D", "E", "G", "G"]
  }
]

export default function MusicMakerGame() {
  const [composition, setComposition] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNote, setCurrentNote] = useState<number | null>(null)
  const [selectedSong, setSelectedSong] = useState<typeof songs[0] | null>(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playNote = (frequency: number, noteIndex: number) => {
    if (!audioContextRef.current) return
    
    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = "sine"
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 0.5)
    
    setCurrentNote(noteIndex)
    setTimeout(() => setCurrentNote(null), 200)
  }

  const handleKeyPress = (note: typeof notes[0], index: number) => {
    playNote(note.frequency, index)
    
    if (practiceMode && selectedSong) {
      if (note.note === selectedSong.notes[practiceIndex]) {
        setPracticeIndex(prev => {
          const next = prev + 1
          if (next >= selectedSong.notes.length) {
            setPracticeMode(false)
            return 0
          }
          return next
        })
      }
    } else {
      setComposition(prev => [...prev, note.note])
    }
  }

  const playComposition = async () => {
    if (composition.length === 0) return
    
    setIsPlaying(true)
    
    for (let i = 0; i < composition.length; i++) {
      const noteObj = notes.find(n => n.note === composition[i])
      if (noteObj) {
        const noteIndex = notes.findIndex(n => n.note === composition[i])
        playNote(noteObj.frequency, noteIndex)
        await new Promise(resolve => setTimeout(resolve, 400))
      }
    }
    
    setIsPlaying(false)
  }

  const playSong = async (song: typeof songs[0]) => {
    setIsPlaying(true)
    
    for (let i = 0; i < song.notes.length; i++) {
      const noteObj = notes.find(n => n.note === song.notes[i])
      if (noteObj) {
        const noteIndex = notes.findIndex(n => n.note === song.notes[i])
        playNote(noteObj.frequency, noteIndex)
        await new Promise(resolve => setTimeout(resolve, 400))
      }
    }
    
    setIsPlaying(false)
  }

  const startPractice = (song: typeof songs[0]) => {
    setSelectedSong(song)
    setPracticeMode(true)
    setPracticeIndex(0)
    setComposition([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-sky-50 to-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Games</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
            Music Maker
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-full flex items-center justify-center shadow-xl">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Make Music!</h2>
            <p className="text-muted-foreground">Press the keys to play notes and create your own songs!</p>
          </div>

          {/* Practice Mode Banner */}
          {practiceMode && selectedSong && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-yellow-100 to-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Practice: {selectedSong.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Next note: <span className="font-bold text-primary">{selectedSong.notes[practiceIndex]}</span>
                    {" "}({practiceIndex + 1}/{selectedSong.notes.length})
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setPracticeMode(false)
                    setSelectedSong(null)
                    setPracticeIndex(0)
                  }}
                >
                  Exit Practice
                </Button>
              </div>
            </Card>
          )}

          {/* Piano Keys */}
          <div className="flex justify-center gap-1 mb-8">
            {notes.map((note, index) => (
              <button
                key={note.note}
                onClick={() => handleKeyPress(note, index)}
                disabled={isPlaying}
                className={`relative w-12 md:w-16 h-32 md:h-40 rounded-b-lg shadow-lg transition-all ${note.color} ${
                  currentNote === index 
                    ? "scale-95 brightness-125" 
                    : "hover:brightness-110 hover:scale-[1.02]"
                } ${
                  practiceMode && selectedSong && selectedSong.notes[practiceIndex] === note.note
                    ? "ring-4 ring-yellow-400 animate-pulse"
                    : ""
                }`}
              >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-sm md:text-base">
                  {note.note}
                </span>
              </button>
            ))}
          </div>

          {/* Composition Display */}
          {!practiceMode && (
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Your Composition</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setComposition([])}
                    disabled={composition.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={playComposition}
                    disabled={composition.length === 0 || isPlaying}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="min-h-[60px] bg-gray-50 rounded-lg p-3 flex flex-wrap gap-2">
                {composition.length === 0 ? (
                  <span className="text-muted-foreground text-sm">Press keys to compose...</span>
                ) : (
                  composition.map((note, index) => {
                    const noteObj = notes.find(n => n.note === note)
                    return (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${noteObj?.color || "bg-gray-400"}`}
                      >
                        {note}
                      </span>
                    )
                  })
                )}
              </div>
            </Card>
          )}

          {/* Learn Songs */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Learn Songs
            </h3>
            <div className="grid gap-3">
              {songs.map((song) => (
                <div 
                  key={song.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <span className="font-medium text-foreground">{song.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => playSong(song)}
                      disabled={isPlaying}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Listen
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => startPractice(song)}
                      disabled={isPlaying}
                      className="bg-gradient-to-r from-cyan-500 to-sky-500"
                    >
                      Practice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
