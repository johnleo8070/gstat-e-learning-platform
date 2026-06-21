"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  X, Send, Sparkles, Star, MessageCircle, 
  Minimize2, Maximize2, Volume2, VolumeX 
} from "lucide-react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Quick suggestion buttons for kids - mousey themed!
const quickSuggestions = [
  { text: "Help me, Whiskers!", icon: "?" },
  { text: "What should I learn today?", icon: "book" },
  { text: "Tell me something cool!", icon: "star" },
  { text: "I need a hint!", icon: "help" },
]

// Animated states for Professor Whiskers
type WhiskersState = "idle" | "thinking" | "happy" | "celebrating" | "waving"

export function ProfessorWhiskersAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [whiskersState, setWhiskersState] = useState<WhiskersState>("idle")
  const [speechBubble, setSpeechBubble] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [studentData, setStudentData] = useState<{
    name: string
    stars: number
    streak: number
  } | null>(null)
  
  const pathname = usePathname()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Determine current context from pathname
  const currentSubject = pathname.includes('/curriculum/') 
    ? pathname.split('/curriculum/')[1]?.split('/')[0] 
    : undefined
  const currentLesson = pathname.includes('/lesson/') 
    ? pathname.split('/lesson/')[1]?.split('/').pop() 
    : undefined

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/ai-assistant',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          id,
          messages,
          context: {
            currentPage: pathname,
            currentSubject,
            currentLesson,
            studentName: studentData?.name,
            studentStars: studentData?.stars,
            studentStreak: studentData?.streak,
          }
        }
      })
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Load student data
  useEffect(() => {
    async function loadStudentData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          const { data: student } = await supabase
            .from('students')
            .select('total_stars, current_streak')
            .eq('profile_id', profile.id)
            .single()

          setStudentData({
            name: profile.first_name || 'friend',
            stars: student?.total_stars || 0,
            streak: student?.current_streak || 0,
          })
        }
      }
    }
    loadStudentData()
  }, [])

  // Show greeting based on time - mousey style!
  useEffect(() => {
    const hour = new Date().getHours()
    let greeting = ""
    
    if (hour < 12) greeting = "Squeak squeak! Good morning"
    else if (hour < 17) greeting = "Eee-hee! Good afternoon"
    else greeting = "Oh boy! Good evening"

    const name = studentData?.name || "little friend"
    
    // Show speech bubble greeting with mousey personality
    setTimeout(() => {
      setSpeechBubble(`${greeting}, ${name}! Ready for an adventure?`)
      setWhiskersState("waving")
      
      setTimeout(() => {
        setSpeechBubble(null)
        setWhiskersState("idle")
      }, 4000)
    }, 2000)
  }, [studentData])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update Whiskers state based on chat status
  useEffect(() => {
    if (isLoading) {
      setWhiskersState("thinking")
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        // Check for celebration triggers - mousey expressions
        const text = getMessageText(lastMessage)
        if (text.toLowerCase().includes("squeak") || 
            text.toLowerCase().includes("cheese") ||
            text.toLowerCase().includes("yippee") ||
            text.toLowerCase().includes("super duper") ||
            text.toLowerCase().includes("amazing")) {
          setWhiskersState("celebrating")
          setTimeout(() => setWhiskersState("happy"), 2000)
        } else {
          setWhiskersState("happy")
        }
        setTimeout(() => setWhiskersState("idle"), 3000)
      }
    }
  }, [isLoading, messages])

  // Text-to-speech for responses - squeaky mouse voice!
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0 // Normal speed, mousey and energetic
      utterance.pitch = 1.4 // Higher pitch for squeaky mouse voice!
      
      // Try to find a friendly, higher-pitched voice
      const voices = window.speechSynthesis.getVoices()
      const friendlyVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') ||
        v.name.includes('Zira') ||
        v.lang.startsWith('en')
      )
      if (friendlyVoice) utterance.voice = friendlyVoice
      
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesisRef.current = utterance
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Helper to extract text from message parts
  function getMessageText(message: typeof messages[0]): string {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickSuggestion = (text: string) => {
    sendMessage({ text })
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <>
      {/* Floating Mascot Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Speech Bubble */}
        {speechBubble && !isOpen && (
          <div className="absolute bottom-full right-0 mb-2 animate-bounce-slow">
            <div className="bg-white rounded-2xl shadow-xl px-4 py-2 max-w-[200px] relative">
              <p className="text-sm font-medium text-foreground">{speechBubble}</p>
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white" />
            </div>
          </div>
        )}

        {/* Professor Whiskers Avatar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl transition-all duration-300 hover:scale-110 ${
            whiskersState === "celebrating" ? "animate-bounce" : ""
          } ${whiskersState === "thinking" ? "animate-pulse" : ""}`}
        >
          <div className="absolute inset-1 rounded-full overflow-hidden bg-white">
            <Image
              src="/images/professor-whiskers-new.png"
              alt="Professor Whiskers"
              fill
              className="object-cover"
            />
          </div>
          
          {/* State indicators */}
          {whiskersState === "thinking" && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin-slow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          {whiskersState === "celebrating" && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          )}
          
          {/* Notification badge */}
          {!isOpen && messages.length > 0 && (
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {messages.length}
            </div>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <Card className={`fixed z-50 bg-white shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 ${
          isMinimized 
            ? "bottom-4 right-28 w-64 h-16" 
            : "bottom-4 right-4 w-[360px] h-[500px] max-h-[80vh]"
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5">
                <Image
                  src="/images/professor-whiskers-new.png"
                  alt="Professor Whiskers"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Professor Whiskers</h3>
                <p className="text-blue-100 text-xs">
                  {isLoading ? "*wiggles whiskers* Thinking..." : "Your Tiny Mouse Friend!"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 h-[320px] bg-gradient-to-b from-blue-50 to-white">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-blue-100 p-2">
                      <Image
                        src="/images/professor-whiskers-new.png"
                        alt="Professor Whiskers"
                        width={96}
                        height={96}
                        className="rounded-full"
                      />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">Squeak squeak! Hi there!</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      I&apos;m Professor Whiskers, your tiny mouse friend! *wiggles whiskers* Ask me anything!
                    </p>
                    
                    {/* Quick suggestions */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickSuggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickSuggestion(suggestion.text)}
                          className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-full text-sm text-blue-700 transition-colors"
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const text = getMessageText(message)
                      return (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 mr-2 shrink-0">
                              <Image
                                src="/images/professor-whiskers-new.png"
                                alt="Professor Whiskers"
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              message.role === "user"
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-white shadow-md text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{text}</p>
                            {message.role === "assistant" && text && (
                              <button
                                onClick={() => isSpeaking ? stopSpeaking() : speakMessage(text)}
                                className="mt-1 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                {isSpeaking ? (
                                  <><VolumeX className="w-3 h-3" /> Stop</>
                                ) : (
                                  <><Volume2 className="w-3 h-3" /> Listen</>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 mr-2">
                          <Image
                            src="/images/professor-whiskers-new.png"
                            alt="Professor Whiskers"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div className="bg-white shadow-md px-4 py-3 rounded-2xl rounded-bl-md">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-blue-500 hover:bg-blue-600"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear conversation
                  </button>
                )}
              </div>
            </>
          )}
        </Card>
      )}

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  )
}
