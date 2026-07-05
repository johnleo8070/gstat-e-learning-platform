const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../curriculum_sample.json');
const rawData = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(rawData);

// Generate new Math lessons
const moreMathLessons = [
  {
    "subject_slug": "math",
    "unit_title": "Numbers 1 to 10",
    "title": "Number 2",
    "slug": "number-2",
    "description": "Learn the number 2 and how to count objects in pairs.",
    "duration_minutes": 10,
    "difficulty_level": 1,
    "stars_reward": 15,
    "lesson_order": 2,
    "lesson_type": "activity",
    "age_level": "beginner",
    "content": {
      "learningObjective": "Recognize the number 2 and count pairs of objects.",
      "keyVocabulary": ["Two", "Pair", "Both"],
      "quiz": {
        "questions": [
          { "question": "How many eyes do you have?", "options": ["One", "Two", "Three", "Four"], "correctAnswer": 1 }
        ]
      }
    }
  },
  {
    "subject_slug": "math",
    "unit_title": "Numbers 1 to 10",
    "title": "Number 3",
    "slug": "number-3",
    "description": "Learn the number 3.",
    "duration_minutes": 10,
    "difficulty_level": 1,
    "stars_reward": 15,
    "lesson_order": 3,
    "lesson_type": "activity",
    "age_level": "beginner",
    "content": {
      "learningObjective": "Recognize the number 3.",
      "keyVocabulary": ["Three"],
      "quiz": {
        "questions": [
          { "question": "What comes after 2?", "options": ["4", "3", "1", "5"], "correctAnswer": 1 }
        ]
      }
    }
  }
];

// Generate new Science lessons
const scienceLessons = [
  {
    "subject_slug": "science",
    "unit_title": "Exploring Colors",
    "title": "The Color Red",
    "slug": "color-red",
    "description": "Learn about the color red and find red objects.",
    "duration_minutes": 10,
    "difficulty_level": 1,
    "stars_reward": 15,
    "lesson_order": 1,
    "lesson_type": "activity",
    "age_level": "beginner",
    "content": {
      "learningObjective": "Identify the color red.",
      "keyVocabulary": ["Red", "Apple", "Firetruck"],
      "quiz": {
        "questions": [
          { "question": "Which of these is usually red?", "options": ["Sky", "Grass", "Apple", "Sun"], "correctAnswer": 2 }
        ]
      }
    }
  },
  {
    "subject_slug": "science",
    "unit_title": "Exploring Colors",
    "title": "The Color Blue",
    "slug": "color-blue",
    "description": "Learn about the color blue.",
    "duration_minutes": 10,
    "difficulty_level": 1,
    "stars_reward": 15,
    "lesson_order": 2,
    "lesson_type": "activity",
    "age_level": "beginner",
    "content": {
      "learningObjective": "Identify the color blue.",
      "keyVocabulary": ["Blue", "Sky", "Ocean"],
      "quiz": {
        "questions": [
          { "question": "Which of these is usually blue?", "options": ["Sky", "Grass", "Apple", "Sun"], "correctAnswer": 0 }
        ]
      }
    }
  }
];

// Generate Coding lessons
const codingLessons = [
  {
    "subject_slug": "coding",
    "unit_title": "Logic & Sequences",
    "title": "First Step",
    "slug": "first-step",
    "description": "Learn how sequences work.",
    "duration_minutes": 10,
    "difficulty_level": 1,
    "stars_reward": 15,
    "lesson_order": 1,
    "lesson_type": "activity",
    "age_level": "beginner",
    "content": {
      "learningObjective": "Understand ordering steps.",
      "keyVocabulary": ["First", "Next", "Last"],
      "quiz": {
        "questions": [
          { "question": "When making a sandwich, what do you need first?", "options": ["Bread", "Eat it", "Cut it"], "correctAnswer": 0 }
        ]
      }
    }
  }
];

data.lessons.push(...moreMathLessons, ...scienceLessons, ...codingLessons);

// Add Worksheets
data.worksheets = [
  {
    "subject_slug": "english",
    "title": "Alphabet Tracing A-E",
    "description": "Trace the first 5 letters of the alphabet.",
    "file_url": "/worksheets/alphabet-a-e.pdf",
    "is_premium": false,
    "age_group_slugs": ["toddler", "preschool"]
  },
  {
    "subject_slug": "english",
    "title": "Alphabet Tracing F-J",
    "description": "Trace the next 5 letters.",
    "file_url": "/worksheets/alphabet-f-j.pdf",
    "is_premium": true,
    "age_group_slugs": ["preschool", "kindergarten"]
  },
  {
    "subject_slug": "math",
    "title": "Counting 1 to 5",
    "description": "Count the animals and write the number.",
    "file_url": "/worksheets/counting-1-5.pdf",
    "is_premium": false,
    "age_group_slugs": ["toddler", "preschool"]
  },
  {
    "subject_slug": "science",
    "title": "Coloring the Rainbow",
    "description": "Color the rainbow with the correct colors.",
    "file_url": "/worksheets/rainbow-colors.pdf",
    "is_premium": true,
    "age_group_slugs": ["preschool"]
  },
  {
    "subject_slug": "coding",
    "title": "Draw the Path",
    "description": "Draw the arrows to help the robot reach the battery.",
    "file_url": "/worksheets/draw-path.pdf",
    "is_premium": true,
    "age_group_slugs": ["kindergarten", "primary_1"]
  }
];

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Successfully expanded curriculum and added worksheets!');
