const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase env vars');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase.from('worksheets').select('*');
  
  if (error) {
    console.error('Error fetching worksheets:', error);
  } else {
    console.log('Worksheets count:', data.length);
    if (data.length > 0) {
      console.log('Sample worksheet:', data[0]);
    }
  }
}

run();
