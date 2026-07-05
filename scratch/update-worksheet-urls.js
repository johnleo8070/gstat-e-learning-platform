const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: worksheets, error } = await supabase.from('worksheets').select('id, title');
  if (error) { console.error(error); return; }

  for (const ws of worksheets) {
    const slug = ws.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const file_url = `/worksheets/print/${ws.id}`;
    const { error: updateErr } = await supabase
      .from('worksheets')
      .update({ file_url })
      .eq('id', ws.id);
    if (updateErr) {
      console.error(`Failed to update ${ws.title}:`, updateErr.message);
    } else {
      console.log(`Updated "${ws.title}" -> ${file_url}`);
    }
  }
  console.log('Done!');
}

run();
