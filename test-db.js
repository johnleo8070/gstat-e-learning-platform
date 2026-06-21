const { createClient: createServiceClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

async function run(){
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createServiceClient(supabaseUrl, serviceKey);
  const { data: students, error } = await supabase.from('students').select('*');
  if(error){ console.error('Error fetching students', error); return; }
  console.log('All students:', students);
}
run();
