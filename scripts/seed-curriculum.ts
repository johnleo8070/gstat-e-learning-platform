import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';

// Load environment variables from .env.local or .env using Next.js built-in loader
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

// We need the service role key to bypass RLS when seeding
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🌱 Starting curriculum seed...');

  // Read JSON
  const filePath = path.join(process.cwd(), 'curriculum_sample.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  try {
    // 1. Seed Age Groups
    console.log('Inserting Age Groups...');
    for (const ageGroup of data.ageGroups) {
      const { error } = await supabase
        .from('age_groups')
        .upsert(ageGroup, { onConflict: 'slug' });
      if (error) throw new Error(`Age Group Error: ${error.message}`);
    }

    // 2. Seed Subjects
    console.log('Inserting Subjects...');
    for (const subject of data.subjects) {
      const { error } = await supabase
        .from('subjects')
        .upsert(subject, { onConflict: 'slug' });
      if (error) throw new Error(`Subject Error: ${error.message}`);
    }

    // 3. Seed Units
    console.log('Inserting Units...');
    // Get subject mappings
    const { data: dbSubjects } = await supabase.from('subjects').select('id, slug');
    const subjectMap = new Map(dbSubjects?.map(s => [s.slug, s.id]));

    for (const unit of data.units) {
      const subject_id = subjectMap.get(unit.subject_slug);
      if (!subject_id) throw new Error(`Subject not found for slug: ${unit.subject_slug}`);
      
      const unitData = {
        title: unit.title,
        description: unit.description,
        subject_id,
        unit_order: unit.unit_order
      };

      // Since units don't have a slug in the schema, we just insert.
      // In a real idempotent script, you'd check by title + subject_id.
      const { data: existingUnit } = await supabase
        .from('units')
        .select('id')
        .eq('title', unit.title)
        .eq('subject_id', subject_id)
        .single();

      if (!existingUnit) {
        const { error } = await supabase.from('units').insert(unitData);
        if (error) throw new Error(`Unit Error: ${error.message}`);
      }
    }

    // 4. Seed Achievements
    console.log('Inserting Achievements...');
    for (const achievement of data.achievements) {
      const { data: existingAchv } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievement.name)
        .single();

      if (!existingAchv) {
        const { error } = await supabase.from('achievements').insert(achievement);
        if (error) throw new Error(`Achievement Error: ${error.message}`);
      }
    }

    // 5. Seed Lessons
    console.log('Inserting Lessons...');
    const { data: dbUnits } = await supabase.from('units').select('id, title, subject_id');

    for (const lesson of data.lessons) {
      const subject_id = subjectMap.get(lesson.subject_slug);
      if (!subject_id) throw new Error(`Subject not found for slug: ${lesson.subject_slug}`);

      const unit = dbUnits?.find(u => u.title === lesson.unit_title && u.subject_id === subject_id);
      if (!unit) throw new Error(`Unit not found for title: ${lesson.unit_title}`);

      const lessonData = {
        subject_id,
        unit_id: unit.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        duration_minutes: lesson.duration_minutes,
        difficulty_level: lesson.difficulty_level,
        stars_reward: lesson.stars_reward,
        lesson_order: lesson.lesson_order,
        lesson_type: lesson.lesson_type,
        content: lesson.content // JSONB containing quiz and interactive activity
      };

      const { data: existingLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('slug', lesson.slug)
        .single();

      if (existingLesson) {
        const { error } = await supabase.from('lessons').update(lessonData).eq('id', existingLesson.id);
        if (error) throw new Error(`Lesson Update Error: ${error.message}`);
      } else {
        const { error } = await supabase.from('lessons').insert(lessonData);
        if (error) throw new Error(`Lesson Insert Error: ${error.message}`);
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

main();
