const { loadEnvConfig } = require('@next/env');
const { Client } = require('pg');

loadEnvConfig(process.cwd());

async function run() {
  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('Adding RLS policy for worksheets table...');

  const sql = `
    -- Allow all authenticated users to read active worksheets
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'worksheets' AND policyname = 'worksheets_read_authenticated'
      ) THEN
        CREATE POLICY worksheets_read_authenticated ON worksheets
          FOR SELECT TO authenticated
          USING (is_active = true);
      END IF;
    END $$;

    -- Also allow anon to read (for public pages)
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'worksheets' AND policyname = 'worksheets_read_anon'
      ) THEN
        CREATE POLICY worksheets_read_anon ON worksheets
          FOR SELECT TO anon
          USING (is_active = true);
      END IF;
    END $$;
  `;

  try {
    await client.query(sql);
    console.log('✅ RLS policies added successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
