import { createClient } from '@/lib/supabase/server'
import { AgeGroup, CurriculumStandard, SkillProgression } from '@/lib/types/database'

export const ageGroupsData = [
  {
    name: 'Toddlers',
    slug: 'toddler',
    min_age_months: 12,
    max_age_months: 24,
    description: 'Exploring basics through play and sensory experiences',
    curriculum_overview: 'Focus on sensory development, basic language, and motor skills',
    learning_outcomes: ['Develop fine motor skills', 'Recognize colors and shapes', 'Understand basic sounds'],
    display_order: 1
  },
  {
    name: 'Preschool',
    slug: 'preschool',
    min_age_months: 24,
    max_age_months: 36,
    description: 'Building foundational skills through interactive activities',
    curriculum_overview: 'Introduce letters, numbers, social skills, and creative expression',
    learning_outcomes: ['Recognize letters A-Z', 'Count to 10', 'Express emotions', 'Follow instructions'],
    display_order: 2
  },
  {
    name: 'Kindergarten',
    slug: 'kindergarten',
    min_age_months: 36,
    max_age_months: 60,
    description: 'Developing reading, writing, and problem-solving skills',
    curriculum_overview: 'Early literacy, basic numeracy, science exploration, social development',
    learning_outcomes: ['Read simple words', 'Write letters', 'Solve basic math problems', 'Understand science concepts'],
    display_order: 3
  },
  {
    name: 'Primary 1',
    slug: 'primary_1',
    min_age_months: 60,
    max_age_months: 84,
    description: 'Mastering fundamental academic and social skills',
    curriculum_overview: 'Reading comprehension, arithmetic, science, arts, coding basics',
    learning_outcomes: ['Read and comprehend stories', 'Solve addition/subtraction', 'Scientific inquiry', 'Basic coding'],
    display_order: 4
  },
  {
    name: 'Primary 2',
    slug: 'primary_2',
    min_age_months: 84,
    max_age_months: 108,
    description: 'Advanced academics with project-based learning',
    curriculum_overview: 'Advanced literacy, multi-digit math, STEM, collaborative projects',
    learning_outcomes: ['Analyze texts', 'Complex problem-solving', 'STEM projects', 'Leadership skills'],
    display_order: 5
  }
]

export const skillsData = [
  // English Skills
  {
    skill_name: 'Letter Recognition',
    skill_description: 'Ability to identify and name individual letters',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'English',
    age_group: 'kindergarten'
  },
  {
    skill_name: 'Phonemic Awareness',
    skill_description: 'Understanding sounds that make up words',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'English',
    age_group: 'kindergarten'
  },
  {
    skill_name: 'Reading Comprehension',
    skill_description: 'Ability to understand and recall information from texts',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'English',
    age_group: 'primary_1'
  },
  // Math Skills
  {
    skill_name: 'Number Recognition',
    skill_description: 'Recognizing and naming numbers 0-10',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'Math',
    age_group: 'kindergarten'
  },
  {
    skill_name: 'Basic Addition',
    skill_description: 'Adding numbers up to 10',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'Math',
    age_group: 'primary_1'
  },
  {
    skill_name: 'Basic Subtraction',
    skill_description: 'Subtracting numbers up to 10',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'Math',
    age_group: 'primary_1'
  },
  // Science Skills
  {
    skill_name: 'Observation Skills',
    skill_description: 'Ability to observe and describe natural phenomena',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'Science',
    age_group: 'kindergarten'
  },
  {
    skill_name: 'Scientific Inquiry',
    skill_description: 'Asking questions and testing hypotheses',
    proficiency_levels: ['beginner', 'developing', 'proficient', 'advanced', 'mastery'],
    subject: 'Science',
    age_group: 'primary_1'
  }
]

export async function seedCurriculumData() {
  const supabase = createClient()

  try {
    console.log('[v0] Starting curriculum data seed...')

    // Seed Age Groups
    console.log('[v0] Seeding age groups...')
    const { data: ageGroups, error: ageGroupError } = await supabase
      .from('age_groups')
      .insert(ageGroupsData)
      .select()

    if (ageGroupError) {
      console.error('[v0] Error seeding age groups:', ageGroupError)
      return { success: false, error: ageGroupError.message }
    }

    console.log('[v0] Age groups seeded:', ageGroups?.length)

    // Get subjects to link with skills
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, name')
      .limit(10)

    const subjectMap = subjects?.reduce((acc, s) => {
      acc[s.name.toLowerCase()] = s.id
      return acc
    }, {} as Record<string, string>) || {}

    // Seed Skills
    console.log('[v0] Seeding skills...')
    const skillsWithIds = skillsData.map(skill => {
      const ageGroup = ageGroups?.find(ag => ag.slug === skill.age_group)
      const subject = Object.entries(subjectMap).find(
        ([name]) => name === skill.subject.toLowerCase()
      )

      return {
        ...skill,
        subject_id: subject?.[1],
        age_group_id: ageGroup?.id,
        skill_name: skill.skill_name,
        skill_description: skill.skill_description,
        proficiency_levels: skill.proficiency_levels,
        progression_path: {
          beginner: 'Introduction to the skill',
          developing: 'Starting to master the skill',
          proficient: 'Consistently demonstrates skill',
          advanced: 'Can apply in new contexts',
          mastery: 'Expert level proficiency'
        },
        assessment_criteria: {
          beginner: 'Can identify and name basic elements',
          developing: 'Shows partial understanding',
          proficient: 'Demonstrates consistent application',
          advanced: 'Applies creatively and independently',
          mastery: 'Teaches and models for others'
        }
      }
    }).filter(s => s.subject_id && s.age_group_id)

    if (skillsWithIds.length > 0) {
      const { data: createdSkills, error: skillsError } = await supabase
        .from('skill_progressions')
        .insert(skillsWithIds)
        .select()

      if (skillsError) {
        console.error('[v0] Error seeding skills:', skillsError)
        return { success: false, error: skillsError.message }
      }

      console.log('[v0] Skills seeded:', createdSkills?.length)
    }

    // Seed Rewards Tiers
    console.log('[v0] Seeding rewards tiers...')
    const rewardsTiers = [
      {
        name: 'Novice',
        level: 1,
        min_stars: 0,
        max_stars: 50,
        description: 'Just starting your learning journey',
        unlocked_rewards: { badges: 1, coins: 10 }
      },
      {
        name: 'Explorer',
        level: 2,
        min_stars: 51,
        max_stars: 150,
        description: 'Exploring different subjects',
        unlocked_rewards: { badges: 3, coins: 30 }
      },
      {
        name: 'Scholar',
        level: 3,
        min_stars: 151,
        max_stars: 300,
        description: 'Building expertise in subjects',
        unlocked_rewards: { badges: 5, coins: 50 }
      },
      {
        name: 'Master',
        level: 4,
        min_stars: 301,
        max_stars: 500,
        description: 'Demonstrating mastery',
        unlocked_rewards: { badges: 10, coins: 100 }
      },
      {
        name: 'Genius',
        level: 5,
        min_stars: 501,
        max_stars: 1000,
        description: 'Expert level achievement',
        unlocked_rewards: { badges: 15, coins: 200 }
      }
    ]

    const { data: tiers, error: tiersError } = await supabase
      .from('rewards_tiers')
      .insert(rewardsTiers)
      .select()

    if (tiersError) {
      console.error('[v0] Error seeding rewards tiers:', tiersError)
      return { success: false, error: tiersError.message }
    }

    console.log('[v0] Rewards tiers seeded:', tiers?.length)

    return {
      success: true,
      data: {
        age_groups: ageGroups?.length || 0,
        skills: skillsWithIds.length,
        rewards_tiers: tiers?.length || 0
      }
    }
  } catch (error) {
    console.error('[v0] Unexpected error during seed:', error)
    return { success: false, error: String(error) }
  }
}
