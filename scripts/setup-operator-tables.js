const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)=["']?(.+?)["']?$/);
  if (match) env[match[1]] = match[2];
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  console.log('Checking operator tables...\n');

  const tables = ['operator_fitness_readings', 'operator_fitness_goal', 'operator_daily_metrics', 'operator_workouts'];
  for (const table of tables) {
    const { error: checkErr } = await supabase.from(table).select('*').limit(1);
    if (checkErr) {
      console.log(`❌ ${table}: ${checkErr.message}`);
    } else {
      console.log(`✅ ${table}: exists and ready`);
    }
  }
}

run().catch(console.error);
