-- Age-Based Curriculum Schema Migration for GSTAT eLearning Platform
-- This migration creates all tables needed for comprehensive age-based curriculum management

-- Age Groups Table
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  min_age_months INTEGER NOT NULL,
  max_age_months INTEGER NOT NULL,
  description TEXT,
  curriculum_overview TEXT,
  learning_outcomes JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Curriculum Standards Table
CREATE TABLE IF NOT EXISTS curriculum_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skill_focus JSONB,
  complexity_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(age_group_id, subject_id, code)
);

-- Learning Objectives Table
CREATE TABLE IF NOT EXISTS learning_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_standard_id UUID NOT NULL REFERENCES curriculum_standards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objective_type VARCHAR(50) NOT NULL,
  measurable_outcome TEXT,
  proficiency_levels JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skill Progression Table
CREATE TABLE IF NOT EXISTS skill_progressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  skill_description TEXT,
  proficiency_levels JSONB NOT NULL DEFAULT '["beginner", "developing", "proficient", "advanced", "mastery"]'::jsonb,
  progression_path JSONB,
  assessment_criteria JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assessment_type VARCHAR(50) NOT NULL,
  passing_score INTEGER DEFAULT 70,
  total_points INTEGER DEFAULT 100,
  time_limit_minutes INTEGER,
  question_pool JSONB,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  score INTEGER,
  total_points INTEGER,
  stars_earned INTEGER DEFAULT 0,
  feedback TEXT,
  is_passed BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skill Mastery Table
CREATE TABLE IF NOT EXISTS skill_masteries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_progression_id UUID NOT NULL REFERENCES skill_progressions(id) ON DELETE CASCADE,
  current_proficiency_level VARCHAR(50) DEFAULT 'beginner',
  mastery_percentage INTEGER DEFAULT 0,
  last_assessed_at TIMESTAMP,
  total_assessments INTEGER DEFAULT 0,
  mastered_at TIMESTAMP,
  is_mastered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, skill_progression_id)
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  certificate_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completion_date DATE NOT NULL,
  skills_mastered JSONB,
  proficiency_summary JSONB,
  is_digital_enabled BOOLEAN DEFAULT true,
  is_printable BOOLEAN DEFAULT true,
  certificate_url VARCHAR(500),
  issued_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards Tiers Table
CREATE TABLE IF NOT EXISTS rewards_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL UNIQUE,
  min_stars INTEGER NOT NULL,
  max_stars INTEGER NOT NULL,
  badge_url VARCHAR(500),
  unlocked_rewards JSONB,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student Rewards Table
CREATE TABLE IF NOT EXISTS student_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  reward_type VARCHAR(50) NOT NULL,
  stars_amount INTEGER DEFAULT 0,
  badges_amount INTEGER DEFAULT 0,
  coins_amount INTEGER DEFAULT 0,
  source_type VARCHAR(100),
  source_id UUID,
  earned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Academic Terms Table
CREATE TABLE IF NOT EXISTS academic_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  academic_year VARCHAR(20) NOT NULL,
  term_number INTEGER NOT NULL,
  term_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(academic_year, term_number)
);

-- Lesson Plans Table
CREATE TABLE IF NOT EXISTS lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_term_id UUID NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  theme VARCHAR(255),
  learning_objectives JSONB,
  resources JSONB,
  assessment_strategy TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_age_groups_slug ON age_groups(slug);
CREATE INDEX idx_curriculum_standards_age_group ON curriculum_standards(age_group_id);
CREATE INDEX idx_curriculum_standards_subject ON curriculum_standards(subject_id);
CREATE INDEX idx_skill_progressions_subject ON skill_progressions(subject_id);
CREATE INDEX idx_skill_progressions_age_group ON skill_progressions(age_group_id);
CREATE INDEX idx_assessments_lesson ON assessments(lesson_id);
CREATE INDEX idx_assessment_attempts_student ON assessment_attempts(student_id);
CREATE INDEX idx_assessment_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX idx_skill_masteries_student ON skill_masteries(student_id);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_age_group ON certificates(age_group_id);
CREATE INDEX idx_student_rewards_student ON student_rewards(student_id);
CREATE INDEX idx_lesson_plans_teacher ON lesson_plans(teacher_id);
CREATE INDEX idx_lesson_plans_term ON lesson_plans(academic_term_id);

-- Enable RLS (Row Level Security)
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_masteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
