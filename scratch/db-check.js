const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error('Error loading env file', e);
}

async function check() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('--- SUPABASE DATABASE CHECK ---');
  
  // 1. Check subjects
  const { data: subjects, error: subjErr } = await supabase.from('subjects').select('id, name, slug');
  if (subjErr) console.error('Error subjects:', subjErr);
  else console.log('Subjects:', subjects);

  // 2. Check units
  const { data: units, error: unitErr } = await supabase.from('units').select('id, title, subject_id');
  if (unitErr) console.error('Error units:', unitErr);
  else console.log(`Total Units: ${units?.length || 0}`);

  // 3. Check lessons
  const { data: lessons, error: lessErr } = await supabase.from('lessons').select('id, title, subject_id');
  if (lessErr) console.error('Error lessons:', lessErr);
  else console.log(`Total Lessons: ${lessons?.length || 0}`);

  // 4. Check students
  const { data: students, error: studErr } = await supabase.from('students').select('id, name, parent_id');
  if (studErr) console.error('Error students:', studErr);
  else console.log('Students:', students);
}

check();
