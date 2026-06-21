# Age-Based Curriculum Management System

## Overview

The age-based curriculum system provides a comprehensive framework for teaching children aged 1-9 years across 7 subjects. It includes structured learning progressions, skill mastery tracking, assessments, and digital certificates.

## Architecture

### Database Schema

The system uses 12 new tables to manage curriculum data:

#### Core Tables
- **age_groups**: Defines 5 age groups (Toddler, Preschool, Kindergarten, Primary 1, Primary 2)
- **curriculum_standards**: Learning standards aligned to age groups and subjects
- **learning_objectives**: Measurable outcomes for standards
- **skill_progressions**: Skills tracked across 5 proficiency levels

#### Assessment & Progress
- **assessments**: Quiz, drag-drop, matching, and interactive assessments
- **assessment_attempts**: Student assessment submissions and scores
- **skill_masteries**: Tracks student skill proficiency and mastery status
- **student_rewards**: Stars, badges, and coins earned through learning

#### Certificates & Planning
- **certificates**: Digital certificates for achievement
- **rewards_tiers**: 5-tier system from Novice to Genius
- **academic_terms**: School calendar organization
- **lesson_plans**: Teacher lesson planning by week and theme

### Data Types

Extended TypeScript types in `/lib/types/database.ts`:
- `AgeGroupType`: 'toddler' | 'preschool' | 'kindergarten' | 'primary_1' | 'primary_2'
- `ProficiencyLevel`: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mastery'
- `AssessmentType`: 'quiz' | 'drag_drop' | 'matching' | 'interactive' | 'oral'
- Related interfaces for all curriculum entities

## API Endpoints

### Age Groups
- `GET /api/curriculum/age-groups` - List all active age groups
- `POST /api/curriculum/age-groups` - Create new age group (admin only)

### Skills Management
- `GET /api/curriculum/skills?age_group_id=X&subject_id=Y` - Get skills for age group/subject
- `POST /api/curriculum/skills` - Create skill progression (teacher+)

### Student Skills
- `GET /api/curriculum/student-skills?student_id=X&subject_id=Y` - Get student skill mastery
- `POST /api/curriculum/student-skills` - Update skill proficiency

### Assessments
- `GET /api/curriculum/assessments?lesson_id=X` - Get lesson assessments
- `POST /api/curriculum/assessments` - Create assessment (teacher+)
- `POST /api/curriculum/assessment-attempts` - Submit assessment
- `GET /api/curriculum/assessment-attempts?student_id=X` - Get student attempts

### Certificates
- `GET /api/curriculum/certificates?student_id=X` - Get student certificates
- `POST /api/curriculum/certificates` - Issue certificate (teacher+)

### Seeding
- `POST /api/curriculum/seed` - Initialize curriculum data (admin only)

## Components

### Teacher Dashboard (`/app/dashboard/teacher/page.tsx`)
Allows teachers to:
- Select age group and view curriculum overview
- Create and manage lesson plans by week
- Define and track skills
- Create and manage assessments
- View student progress

Key tabs: Overview, Lesson Plans, Skills, Assessments, Students

### Interactive Lesson (`/components/student/interactive-lesson.tsx`)
5-step lesson flow:
1. **Intro**: Shows objectives and star rewards
2. **Content**: Plays video lesson with progress tracking
3. **Activity**: Interactive learning activity
4. **Assessment**: Quiz/matching questions
5. **Complete**: Shows score and stars earned

Features:
- Video progress tracking
- Multiple question types
- Automatic scoring and feedback
- Star rewards based on performance

### Lessons Browser (`/components/student/lessons-browser.tsx`)
Displays age-appropriate lessons with:
- Subject filtering
- Status filtering (all, available, completed)
- Difficulty indicators
- Stars reward preview
- Lock status for prerequisites

### Child Progress Tracker (`/components/parent/child-progress-tracker.tsx`)
Parents can view:
- **Skills Tab**: Individual skill mastery with levels and percentages
- **Certificates Tab**: Earned certificates with skills mastered
- **Analytics Tab**: Overall completion rate and learning trends
- Summary stats: Total stars, badges, streak, skills mastered

## Curriculum Structure

### Age Groups

1. **Toddlers (12-24 months)**
   - Focus: Sensory development, basic language, motor skills
   - Key Skills: Color recognition, sound awareness, physical coordination

2. **Preschool (24-36 months)**
   - Focus: Letters, numbers, social skills, creativity
   - Key Skills: Letter recognition, counting, emotion expression

3. **Kindergarten (36-60 months)**
   - Focus: Reading, writing, problem-solving
   - Key Skills: Phonemic awareness, basic math, science observation

4. **Primary 1 (60-84 months)**
   - Focus: Reading comprehension, arithmetic, STEM
   - Key Skills: Reading fluency, addition/subtraction, coding basics

5. **Primary 2 (84-108 months)**
   - Focus: Advanced academics, STEM, collaboration
   - Key Skills: Text analysis, multi-digit math, project work

### Subjects (7 Total)
1. English - Literacy and communication
2. Math - Numeracy and problem-solving
3. Science - Inquiry and observation
4. Coding - Logic and programming
5. Arts - Creative expression
6. Social Studies - Community and culture
7. Life Skills - Health and wellbeing

### Skill Proficiency Levels

All skills are tracked across 5 levels:

1. **Beginner** (0-20%)
   - Student shows initial understanding
   - Requires teacher support

2. **Developing** (21-40%)
   - Partial understanding emerging
   - Some independent application

3. **Proficient** (41-80%)
   - Consistent skill demonstration
   - Can apply in familiar contexts

4. **Advanced** (81-95%)
   - Expert application level
   - Can teach others
   - Applies in new contexts

5. **Mastery** (96-100%)
   - Complete command of skill
   - Expert-level proficiency

## Assessment Types

### Quiz
Traditional multiple-choice questions with instant scoring

### Drag-Drop
Interactive arrangement of items (e.g., matching shapes, sorting)

### Matching
Match items in two columns (vocabulary, concepts, images)

### Interactive
Activity-based assessment within a game or simulation

### Oral
Teacher-led or recorded speaking assessment

## Rewards System

### Stars
- Earned from completing lessons and assessments
- 10 stars for passing assessment (70%+)
- 5 stars for partial completion
- Tracked in student profile

### Badges
- Tier-based rewards: 1-15 badges depending on star count
- Unlock special achievements and titles

### Coins
- In-game currency (10-200 depending on tier)
- Can be used for rewards

### Tier Progression
1. **Novice** (0-50 stars) - 1 badge, 10 coins unlocked
2. **Explorer** (51-150 stars) - 3 badges, 30 coins unlocked
3. **Scholar** (151-300 stars) - 5 badges, 50 coins unlocked
4. **Master** (301-500 stars) - 10 badges, 100 coins unlocked
5. **Genius** (500+ stars) - 15 badges, 200 coins unlocked

## Certificates

### Types
- Subject Mastery: Issued when all skills in subject reach 90%+ proficiency
- Age Group Completion: Issued when progressing to next age group
- Skill Certification: Issued for individual skill mastery
- Achievement Certificate: Special certificates for milestones

### Features
- Digital and printable formats
- Includes skills mastered and proficiency summary
- Downloadable PDF format
- Shareable with parents

## Teacher Workflow

1. **Select Age Group** → Dashboard shows curriculum for that age
2. **View Overview** → See stats and quick actions
3. **Create Lesson Plan** → Define weekly themes and objectives
4. **Add Skills** → Select curriculum standards and skills to teach
5. **Create Assessment** → Design quiz or activity to measure learning
6. **Review Progress** → Track individual student performance
7. **Issue Certificates** → Award when milestones are achieved

## Student Workflow

1. **View Age-Appropriate Lessons** → See available lessons for their age
2. **Start Lesson** → Complete 5-step interactive lesson
3. **Take Assessment** → Test knowledge with questions
4. **Earn Rewards** → Gain stars and badges
5. **Track Progress** → View skills and certificates in profile

## Parent Workflow

1. **Select Child** → View one child's progress
2. **View Skills** → See mastery levels for each skill
3. **Check Certificates** → Review achievements
4. **Review Analytics** → Understand learning trends
5. **Download Report** → Export progress report

## Data Seeding

### Initial Data
Seed script creates:
- 5 age groups (Toddler through Primary 2)
- 8 key skills across subjects
- 5 reward tiers
- Academic term structure

### Running Seed
```bash
curl -X POST http://localhost:3000/api/curriculum/seed \
  -H "Content-Type: application/json"
```

Admin authentication required.

## Security

### Row Level Security (RLS)
All curriculum tables have RLS policies:
- Teachers: Can manage curriculum for their age groups
- Students: Can only view/access age-appropriate content
- Parents: Can view only their children's data
- Admins: Full access

### Access Control
- Age groups: Public read, admin write
- Skills: Public read, teacher/admin write
- Assessments: Student read/submit, teacher/admin write
- Certificates: Student read, teacher/admin write

## Performance Considerations

### Indexes
Optimized indexes on:
- age_group_id, subject_id
- student_id for quick lookups
- lesson_id for assessments
- teaching relationships

### Caching
Consider caching:
- Age groups (rarely changes)
- Skill progressions (per age group)
- Public curriculum standards

## Next Steps

1. **Implement Lesson Content**
   - Add lesson video URLs
   - Create assessment question pools
   - Build activity content

2. **Teacher Tools**
   - Bulk upload assessment questions
   - Lesson plan templates
   - Student performance reports

3. **Student Features**
   - Lesson recommendations based on skill gaps
   - Adaptive difficulty
   - Gamification elements

4. **Parent Features**
   - Email progress updates
   - Goal setting interface
   - Comparison analytics

5. **Advanced Analytics**
   - Learning analytics dashboard
   - Predictive skill development
   - Personalized learning paths
