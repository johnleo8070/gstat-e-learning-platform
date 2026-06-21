const { Client } = require('pg');
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

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

async function checkColumns() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log('--- LESSONS COLUMNS ---');
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'lessons';
  `);
  console.log(res.rows);

  await client.end();
}

checkColumns();
