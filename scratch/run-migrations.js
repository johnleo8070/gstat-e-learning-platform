const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

async function run() {
  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!dbUrl) {
    console.error('No DB URL found');
    return;
  }
  
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('Connected to DB. Running migrations...');
  const sqlPath = path.join(__dirname, '../lib/supabase/migrations/curriculum-schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    await client.query(sql);
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}
run();
