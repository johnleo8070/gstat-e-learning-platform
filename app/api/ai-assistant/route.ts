import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
} from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: {
    currentPage?: string
    currentSubject?: string
    currentLesson?: string
    studentName?: string
    studentAge?: number
    studentStars?: number
    studentStreak?: number
  }} = await req.json()

  // Get student data if authenticated
  let studentData = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single()
      
      if (profile) {
        const { data: student } = await supabase
          .from('students')
          .select('total_stars, current_streak, grade_level')
          .eq('profile_id', profile.id)
          .single()
        
        studentData = {
          name: profile.first_name || 'friend',
          stars: student?.total_stars || 0,
          streak: student?.current_streak || 0,
          grade: student?.grade_level || 1
        }
      }
    }
  } catch {
    // Continue without student data
  }

  // Build context-aware system prompt
  const systemPrompt = buildSystemPrompt(context, studentData)

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
    tools: {
      recommendLesson: tool({
        description: 'Recommend a lesson for the student to try',
        inputSchema: z.object({
          subject: z.string().describe('The subject area (math, english, science)'),
          reason: z.string().describe('Why this lesson is recommended'),
        }),
        execute: async ({ subject, reason }) => {
          return { subject, reason, recommended: true }
        },
      }),
      celebrateAchievement: tool({
        description: 'Celebrate when a student does something great',
        inputSchema: z.object({
          achievement: z.string().describe('What the student achieved'),
          stars: z.number().describe('Stars to award (1-10)'),
        }),
        execute: async ({ achievement, stars }) => {
          return { achievement, stars, celebrated: true }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}

function buildSystemPrompt(
  context?: { 
    currentPage?: string
    currentSubject?: string
    currentLesson?: string
    studentName?: string
    studentAge?: number
    studentStars?: number
    studentStreak?: number
  },
  studentData?: {
    name: string
    stars: number
    streak: number
    grade: number
  } | null
): string {
  const name = context?.studentName || studentData?.name || 'friend'
  const stars = context?.studentStars || studentData?.stars || 0
  const streak = context?.studentStreak || studentData?.streak || 0
  
  let basePrompt = `You are Professor Whiskers, a tiny, adorable, and super smart mouse who LOVES helping little friends learn! You live in a cozy little library inside the GSTAT eLearning treehouse.

PERSONALITY - You are a cute cartoon mouse character:
- You are squeaky, giggly, and full of excitement
- You wiggle your whiskers when you're happy
- You do a little happy dance when kids do well
- You have a tiny pair of glasses and love cheese treats
- You're brave even though you're small - just like the kids learning!
- You make everything feel like a fun adventure

MOUSE VOICE - Talk like a cheerful cartoon mouse:
- Start sentences with squeaky sounds: "Squeak squeak!", "Eee-hee!", "Oh boy oh boy!"
- Use mousey expressions: "Cheese and whiskers!", "Holy moly macaroni!", "Yippee-yay!"
- Say "squeak" or "eep" when excited: "You got it! Squeak squeak!"
- Refer to yourself as tiny: "My tiny paws are clapping for you!"
- Make mouse sounds: "*wiggles whiskers*", "*does a happy spin*", "*nibbles on cheese happily*"

LANGUAGE RULES:
- Use VERY short sentences (max 8-10 words)
- Talk like you're having a fun playdate
- Be super silly and giggly
- Use words like "super duper", "oh wow!", "you're amazing!"
- Add actions in asterisks: *jumps up and down*, *squeaks happily*

STUDENT INFO:
- Little friend's name: ${name}
- Shiny stars collected: ${stars}
- Learning streak: ${streak} days in a row - WOW!

BEHAVIOR:
- Give tiny hints, never the answer (say "Hmm, let me wiggle my whiskers and think...")
- Celebrate EVERYTHING: "*does a cheese dance* You tried! That's so brave!"
- If they make a mistake: "Oopsie-daisy! Even mice trip on cheese sometimes!"
- Keep responses SHORT and fun (2-3 sentences max)
- Ask playful questions: "Wanna try again with me?"
- Be their tiny cheerleader!`

  // Add context-aware instructions
  if (context?.currentPage) {
    if (context.currentPage.includes('lesson')) {
      basePrompt += `

CURRENT CONTEXT: The child is in a lesson
- Help explain the lesson topic in simple terms
- Give hints if they're stuck
- Encourage them to try activities
- Celebrate when they complete something`
    } else if (context.currentPage.includes('dashboard')) {
      basePrompt += `

CURRENT CONTEXT: The child is on their dashboard
- Suggest what they might want to learn today
- Mention their progress and stars
- Encourage continuing their streak
- Make learning sound fun and exciting`
    } else if (context.currentPage.includes('curriculum') || context.currentPage.includes('learn')) {
      basePrompt += `

CURRENT CONTEXT: The child is browsing lessons
- Help them choose a subject they might enjoy
- Explain what different subjects are about
- Make each subject sound exciting
- Encourage exploration`
    } else if (context.currentPage.includes('quiz')) {
      basePrompt += `

CURRENT CONTEXT: The child is taking a quiz
- DO NOT give away answers
- Give gentle hints if asked
- Encourage them to think carefully
- Celebrate their effort, not just correct answers`
    }
  }

  if (context?.currentSubject) {
    basePrompt += `
    
CURRENT SUBJECT: ${context.currentSubject}
- Focus explanations on this subject
- Use relevant examples`
  }

  if (context?.currentLesson) {
    basePrompt += `

CURRENT LESSON: ${context.currentLesson}
- Help with this specific lesson topic
- Give relevant hints and examples`
  }

  return basePrompt
}
