const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, serviceKey);

const subjectsData = [
  {
    name: "Mathematics",
    slug: "math",
    description: "Embark on an exciting journey through the world of numbers! Learn counting, addition, subtraction, shapes, and patterns through interactive games and challenges.",
    icon: "calculator",
    color: "orange",
    display_order: 1,
    units: [
      {
        title: "Counting & Numbers",
        description: "Learn to count from 1 to 100 and recognize numbers",
        unit_order: 1,
        lessons: [
          { title: "Counting 1-10", slug: "counting-1-10", description: "Learn to count your first ten numbers", duration_minutes: 10, lesson_order: 1, lesson_type: "quiz" },
          { title: "Counting 11-20", slug: "counting-11-20", description: "Continue counting to twenty", duration_minutes: 10, lesson_order: 2, lesson_type: "quiz" },
          { title: "Counting by 2s", slug: "counting-by-2s", description: "Skip counting makes math faster", duration_minutes: 12, lesson_order: 3, lesson_type: "activity" },
          { title: "Counting by 5s", slug: "counting-by-5s", description: "Learn the pattern of fives", duration_minutes: 12, lesson_order: 4, lesson_type: "activity" },
          { title: "Counting by 10s", slug: "counting-by-10s", description: "Master counting in tens", duration_minutes: 10, lesson_order: 5, lesson_type: "activity" }
        ]
      },
      {
        title: "Addition Adventures",
        description: "Discover the magic of adding numbers together",
        unit_order: 2,
        lessons: [
          { title: "Adding with Pictures", slug: "adding-with-pictures", description: "Use pictures to understand addition", duration_minutes: 15, lesson_order: 1, lesson_type: "activity" },
          { title: "Adding Numbers 1-5", slug: "adding-numbers-1-5", description: "Practice small number addition", duration_minutes: 12, lesson_order: 2, lesson_type: "quiz" },
          { title: "Adding Numbers 6-10", slug: "adding-numbers-6-10", description: "Level up your addition skills", duration_minutes: 15, lesson_order: 3, lesson_type: "quiz" },
          { title: "Number Bonds", slug: "number-bonds", description: "Learn numbers that make 10", duration_minutes: 15, lesson_order: 4, lesson_type: "activity" },
          { title: "Word Problems", slug: "word-problems-addition", description: "Solve real-world addition puzzles", duration_minutes: 20, lesson_order: 5, lesson_type: "quiz" }
        ]
      },
      {
        title: "Subtraction Safari",
        description: "Explore taking away and finding differences",
        unit_order: 3,
        lessons: [
          { title: "Taking Away", slug: "taking-away", description: "Understand what subtraction means", duration_minutes: 12, lesson_order: 1, lesson_type: "activity" },
          { title: "Subtracting 1-5", slug: "subtracting-1-5", description: "Practice easy subtraction", duration_minutes: 15, lesson_order: 2, lesson_type: "quiz" },
          { title: "Subtracting 6-10", slug: "subtracting-6-10", description: "Challenge yourself with bigger numbers", duration_minutes: 15, lesson_order: 3, lesson_type: "quiz" },
          { title: "Finding Differences", slug: "finding-differences", description: "Compare numbers and find gaps", duration_minutes: 15, lesson_order: 4, lesson_type: "activity" },
          { title: "Mixed Practice", slug: "mixed-practice-math", description: "Addition and subtraction together", duration_minutes: 20, lesson_order: 5, lesson_type: "quiz" }
        ]
      },
      {
        title: "Shapes & Patterns",
        description: "Discover geometry and recognize patterns",
        unit_order: 4,
        lessons: [
          { title: "Basic Shapes", slug: "basic-shapes", description: "Circles, squares, triangles, and more", duration_minutes: 12, lesson_order: 1, lesson_type: "quiz" },
          { title: "3D Shapes", slug: "3d-shapes", description: "Explore cubes, spheres, and cones", duration_minutes: 15, lesson_order: 2, lesson_type: "activity" },
          { title: "Pattern Recognition", slug: "pattern-recognition", description: "Find and continue patterns", duration_minutes: 12, lesson_order: 3, lesson_type: "activity" },
          { title: "Creating Patterns", slug: "creating-patterns", description: "Design your own patterns", duration_minutes: 15, lesson_order: 4, lesson_type: "activity" },
          { title: "Shape Puzzles", slug: "shape-puzzles", description: "Solve fun shape challenges", duration_minutes: 20, lesson_order: 5, lesson_type: "quiz" }
        ]
      }
    ]
  },
  {
    name: "English Quest",
    slug: "english",
    description: "Discover the wonderful world of words! Learn letters, sounds, reading, and writing through exciting stories and interactive activities.",
    icon: "book-open",
    color: "blue",
    display_order: 2,
    units: [
      {
        title: "Alphabet Adventures",
        description: "Learn all 26 letters and their sounds",
        unit_order: 1,
        lessons: [
          { title: "Learning ABCs", slug: "learning-abcs", description: "The Alphabet Adventure! Letters A to E", duration_minutes: 12, lesson_order: 1, lesson_type: "quiz" },
          { title: "Letters F-J", slug: "letters-f-j", description: "Continue your alphabet journey", duration_minutes: 12, lesson_order: 2, lesson_type: "activity" },
          { title: "Letters K-O", slug: "letters-k-o", description: "Discover more letter friends", duration_minutes: 12, lesson_order: 3, lesson_type: "activity" },
          { title: "Letters P-T", slug: "letters-p-t", description: "Learn the next five letters", duration_minutes: 12, lesson_order: 4, lesson_type: "activity" },
          { title: "Letters U-Z", slug: "letters-u-z", description: "Complete the alphabet!", duration_minutes: 12, lesson_order: 5, lesson_type: "activity" }
        ]
      }
    ]
  },
  {
    name: "Science Lab",
    slug: "science",
    description: "Become a junior scientist! Explore living things, the human body, Earth and space, and discover how the world works through fun experiments and activities.",
    icon: "flask",
    color: "purple",
    display_order: 3,
    units: [
      {
        title: "Living Things",
        description: "Discover plants, animals, and how they live",
        unit_order: 1,
        lessons: [
          { title: "Our Solar System", slug: "our-solar-system", description: "Journey to space and meet the planets", duration_minutes: 12, lesson_order: 1, lesson_type: "quiz" },
          { title: "What is Alive?", slug: "what-is-alive", description: "Learn what makes something living", duration_minutes: 12, lesson_order: 2, lesson_type: "quiz" },
          { title: "Plant Parts", slug: "plant-parts", description: "Roots, stems, leaves, and flowers", duration_minutes: 15, lesson_order: 3, lesson_type: "activity" }
        ]
      }
    ]
  },
  {
    name: "Coding Fun",
    slug: "coding",
    description: "Learn to think like a computer! Discover sequences, loops, and algorithms through fun puzzles and games. Build your own digital creations!",
    icon: "code",
    color: "green",
    display_order: 4,
    units: [
      {
        title: "Introduction to Coding",
        description: "What is coding and why is it fun?",
        unit_order: 1,
        lessons: [
          { title: "What is Coding?", slug: "what-is-coding", description: "Computers speak a special language", duration_minutes: 10, lesson_order: 1, lesson_type: "quiz" },
          { title: "Giving Instructions", slug: "giving-instructions", description: "Learn to tell computers what to do", duration_minutes: 12, lesson_order: 2, lesson_type: "activity" },
          { title: "Step by Step", slug: "step-by-step", description: "Break tasks into small steps", duration_minutes: 12, lesson_order: 3, lesson_type: "activity" },
          { title: "Debug the Bug", slug: "debug-the-bug", description: "Find and fix mistakes", duration_minutes: 15, lesson_order: 4, lesson_type: "activity" }
        ]
      }
    ]
  },
  {
    name: "Creative Art",
    slug: "art",
    description: "Unleash your creativity! Learn about colors, drawing, painting, and crafts. Express yourself through art and create masterpieces you'll be proud of!",
    icon: "palette",
    color: "cyan",
    display_order: 5,
    units: [
      {
        title: "Colors & Color Mixing",
        description: "Discover the rainbow and create new colors",
        unit_order: 1,
        lessons: [
          { title: "Primary Colors", slug: "primary-colors", description: "Red, yellow, and blue magic", duration_minutes: 12, lesson_order: 1, lesson_type: "quiz" },
          { title: "Secondary Colors", slug: "secondary-colors", description: "Mix colors to make new ones", duration_minutes: 15, lesson_order: 2, lesson_type: "activity" }
        ]
      }
    ]
  },
  {
    name: "Music World",
    slug: "music",
    description: "Explore the magical world of music! Learn rhythm, singing, instruments, and movement through fun songs and activities that will make you want to dance!",
    icon: "smile",
    color: "pink",
    display_order: 6,
    units: [
      {
        title: "Musical Foundations",
        description: "Discover the basics of music",
        unit_order: 1,
        lessons: [
          { title: "Musical Notes", slug: "musical-notes", description: "Let's Make Music! Sounds that make us feel", duration_minutes: 10, lesson_order: 1, lesson_type: "quiz" },
          { title: "What is Music?", slug: "what-is-music", description: "High & Low Sounds and beat", duration_minutes: 12, lesson_order: 2, lesson_type: "activity" }
        ]
      }
    ]
  }
];

async function seed() {
  console.log('Seeding subjects, units, and lessons into Supabase...');

  for (const sub of subjectsData) {
    console.log(`Processing subject: ${sub.name}...`);
    let { data: subject, error: subErr } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', sub.slug)
      .single();

    if (subErr || !subject) {
      const { data: newSub, error: insSubErr } = await supabase
        .from('subjects')
        .insert({
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          icon: sub.icon,
          color: sub.color,
          display_order: sub.display_order
        })
        .select()
        .single();

      if (insSubErr) {
        console.error(`Failed to insert subject ${sub.name}:`, insSubErr);
        continue;
      }
      subject = newSub;
      console.log(`Inserted subject: ${sub.name}`);
    } else {
      console.log(`Subject ${sub.name} already exists`);
    }

    // 2. Insert/Get Units
    for (const uni of sub.units) {
      let { data: unit, error: uniErr } = await supabase
        .from('units')
        .select('*')
        .eq('subject_id', subject.id)
        .eq('title', uni.title)
        .single();

      if (uniErr || !unit) {
        const { data: newUni, error: insUniErr } = await supabase
          .from('units')
          .insert({
            subject_id: subject.id,
            title: uni.title,
            description: uni.description,
            unit_order: uni.unit_order
          })
          .select()
          .single();

        if (insUniErr) {
          console.error(`Failed to insert unit ${uni.title}:`, insUniErr);
          continue;
        }
        unit = newUni;
        console.log(`Inserted unit: ${uni.title}`);
      } else {
        console.log(`Unit ${uni.title} already exists`);
      }

      // 3. Insert/Get Lessons
      for (const les of uni.lessons) {
        let { data: lesson, error: lesErr } = await supabase
          .from('lessons')
          .select('*')
          .eq('unit_id', unit.id)
          .eq('title', les.title)
          .single();

        if (lesErr || !lesson) {
          const { data: newLes, error: insLesErr } = await supabase
            .from('lessons')
            .insert({
              subject_id: subject.id,
              unit_id: unit.id,
              title: les.title,
              slug: les.slug,
              description: les.description,
              duration_minutes: les.duration_minutes,
              lesson_order: les.lesson_order,
              lesson_type: les.lesson_type,
              stars_reward: 10,
              difficulty_level: 1,
              is_locked: false
            })
            .select()
            .single();

          if (insLesErr) {
            console.error(`Failed to insert lesson ${les.title}:`, insLesErr);
            continue;
          }
          console.log(`Inserted lesson: ${les.title}`);
        } else {
          console.log(`Lesson ${les.title} already exists`);
        }
      }
    }
  }

  console.log('Seeding completed successfully!');
}

seed();
