// Database types for GSTAT eLearning Platform

export type UserRole = 'parent' | 'admin'
export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'expired' | 'past_due'
export type SubscriptionTier = 'free_trial' | 'monthly' | 'annual'
export type LessonType = 'video' | 'quiz' | 'game' | 'activity'
export type AgeLevel = 'beginner' | 'foundation' | 'advanced'
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded'
export type AdminRole = 'admin' | 'payment_verifier' | 'analytics_viewer'

export interface School {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  address: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  school_id: string | null
  role: UserRole
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  grade_level: number | null
  description: string | null
  teacher_id: string | null
  academic_year: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  profile_id: string | null
  parent_id: string | null
  school_id: string | null
  class_id: string | null
  name: string | null
  avatar_url: string | null
  grade_level: number | null
  date_of_birth: string | null
  total_stars: number
  total_badges: number
  current_streak: number
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  grade_levels: number[] | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface LearningZone {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  gradient_from: string | null
  gradient_to: string | null
  tagline: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Unit {
  id: string
  subject_id: string
  title: string
  description: string | null
  unit_order: number
  age_level: AgeLevel
  is_active: boolean
  created_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  subject_id: string
  unit_id: string | null
  title: string
  slug: string
  description: string | null
  content: Record<string, unknown> | null
  video_url: string | null
  duration_minutes: number | null
  difficulty_level: number
  stars_reward: number
  unit_number: number
  lesson_order: number
  lesson_type: LessonType
  age_level: AgeLevel
  thumbnail_url: string | null
  is_locked: boolean
  unlock_requirement: string | null
  is_active: boolean
  created_at: string
}

export interface StudentProgress {
  id: string
  student_id: string
  lesson_id: string
  started_at: string
  completed_at: string | null
  score: number | null
  stars_earned: number
  attempts: number
  time_spent_seconds: number
}

export interface Achievement {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string | null
  requirement_type: string | null
  requirement_value: number | null
  stars_reward: number
  created_at: string
}

export interface StudentAchievement {
  id: string
  student_id: string
  achievement_id: string
  earned_at: string
}

export interface Subscription {
  id: string
  school_id: string | null
  profile_id: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface StudentWithProgress extends Student {
  profile?: Profile
  progress?: StudentProgress[]
  achievements?: StudentAchievement[]
}

export interface LessonWithSubject extends Lesson {
  subject?: Subject
}

export interface ProfileWithSchool extends Profile {
  school?: School
}

// Age-Based Curriculum Types
export type AgeGroupType = 'toddler' | 'preschool' | 'kindergarten' | 'primary_1' | 'primary_2'
export type AssessmentType = 'quiz' | 'drag_drop' | 'matching' | 'interactive' | 'oral'
export type ProficiencyLevel = 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mastery'
export type LearningObjectiveType = 'knowledge' | 'skill' | 'competency'

export interface AgeGroup {
  id: string
  name: string
  slug: AgeGroupType
  min_age_months: number
  max_age_months: number
  description: string | null
  curriculum_overview: string | null
  learning_outcomes: string[] | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CurriculumStandard {
  id: string
  age_group_id: string
  subject_id: string
  code: string
  title: string
  description: string | null
  skill_focus: string[] | null
  complexity_level: number
  is_active: boolean
  created_at: string
}

export interface LearningObjective {
  id: string
  curriculum_standard_id: string
  title: string
  description: string | null
  objective_type: LearningObjectiveType
  measurable_outcome: string | null
  proficiency_levels: Record<string, string> | null
  is_active: boolean
  created_at: string
}

export interface SkillProgression {
  id: string
  subject_id: string
  age_group_id: string
  skill_name: string
  skill_description: string | null
  proficiency_levels: ProficiencyLevel[]
  progression_path: Record<string, unknown> | null
  assessment_criteria: Record<string, unknown> | null
  is_active: boolean
  created_at: string
}

export interface Assessment {
  id: string
  lesson_id: string
  title: string
  description: string | null
  assessment_type: AssessmentType
  passing_score: number
  total_points: number
  time_limit_minutes: number | null
  question_pool: Record<string, unknown> | null
  content: Record<string, unknown> | null
  is_active: boolean
  created_at: string
}

export interface AssessmentAttempt {
  id: string
  student_id: string
  assessment_id: string
  started_at: string
  completed_at: string | null
  score: number | null
  total_points: number
  stars_earned: number
  feedback: string | null
  is_passed: boolean
  time_spent_seconds: number
  created_at: string
}

export interface SkillMastery {
  id: string
  student_id: string
  skill_progression_id: string
  current_proficiency_level: ProficiencyLevel
  mastery_percentage: number
  last_assessed_at: string | null
  total_assessments: number
  mastered_at: string | null
  is_mastered: boolean
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  student_id: string
  age_group_id: string
  subject_id: string | null
  certificate_type: string
  title: string
  description: string | null
  completion_date: string
  skills_mastered: string[] | null
  proficiency_summary: Record<string, unknown> | null
  is_digital_enabled: boolean
  is_printable: boolean
  certificate_url: string | null
  issued_at: string
  created_at: string
}

export interface RewardsTier {
  id: string
  name: string
  level: number
  min_stars: number
  max_stars: number
  badge_url: string | null
  unlocked_rewards: Record<string, unknown> | null
  description: string | null
  created_at: string
}

export interface StudentReward {
  id: string
  student_id: string
  reward_type: string
  stars_amount: number
  badges_amount: number
  coins_amount: number
  source_type: string
  source_id: string | null
  earned_at: string
  created_at: string
}

export interface AcademicTerm {
  id: string
  school_id: string | null
  academic_year: string
  term_number: number
  term_name: string
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
}

export interface LessonPlan {
  id: string
  teacher_id: string
  age_group_id: string
  subject_id: string
  academic_term_id: string
  week_number: number
  theme: string | null
  learning_objectives: string[] | null
  resources: Record<string, unknown> | null
  assessment_strategy: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Extended types with curriculum relations
export interface LessonWithAssessments extends Lesson {
  assessments?: Assessment[]
  curriculum_standard?: CurriculumStandard
}

export interface StudentWithSkillMastery extends Student {
  skill_mastery?: SkillMastery[]
  certificates?: Certificate[]
}

// Payment and Subscription Types
export interface SubscriptionPackage {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  max_children: number
  max_concurrent_learners: number
  features: Record<string, unknown>[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ParentSubscription {
  id: string
  parent_id: string
  package_id: string
  status: SubscriptionStatus
  start_date: string
  end_date: string | null
  auto_renew: boolean
  payment_method: string | null
  created_at: string
  updated_at: string
  package?: SubscriptionPackage
}

export interface Payment {
  id: string
  parent_id: string
  subscription_id: string | null
  amount: number
  currency: string
  payment_method: string
  status: PaymentStatus
  transaction_reference: string | null
  bank_name: string | null
  receipt_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  verified_at: string | null
  verified_by: string | null
}

export interface AdminRole {
  id: string
  admin_id: string
  role: AdminRole
  permissions: Record<string, boolean>
  assigned_at: string
}

// Extended profile with admin flag
export interface AdminProfile extends Profile {
  is_admin: boolean
}
