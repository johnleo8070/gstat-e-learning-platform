-- RLS Policies for Student-Parent Data Isolation

-- Students table RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Students can only see their own record
CREATE POLICY "students_select_own"
  ON students FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = students.profile_id
  ));

-- Students can only update their own record
CREATE POLICY "students_update_own"
  ON students FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = students.profile_id
  ));

-- Parents can see all their linked children
CREATE POLICY "parents_select_children"
  ON students FOR SELECT
  USING (parent_id = auth.uid());

-- Profiles table RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Student Progress RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Students can only see their own progress
CREATE POLICY "progress_select_own"
  ON student_progress FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

-- Parents can see their children's progress
CREATE POLICY "progress_parents_view"
  ON student_progress FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE parent_id = auth.uid()
  ));

-- Lessons and Subjects are public (read-only for students)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons_select_all"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "subjects_select_all"
  ON subjects FOR SELECT
  USING (true);
