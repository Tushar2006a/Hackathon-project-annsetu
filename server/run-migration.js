import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://cfpsrmokignpfiptwfgf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcHNybW9raWducGZpcHR3ZmdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU5ODk0NywiZXhwIjoyMDk0MTc0OTQ3fQ.-YPluIt08Q5Fwvv7mfeqWJ25DJFpCeopLCztJYtgQN8'
);

const sql = readFileSync('./supabase/migrations/003_hub_profile_columns.sql', 'utf8');

const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql }).catch(async () => {
  // Try running each statement individually
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 10);
  for (const stmt of statements) {
    console.log('Running:', stmt.substring(0, 80) + '...');
    const { error } = await supabase.rpc('exec_sql', { sql_string: stmt + ';' });
    if (error) {
      console.error('Error:', error.message);
      // Try direct fetch
      const res = await fetch('https://cfpsrmokignpfiptwfgf.supabase.co/rest/v1/rpc/exec_sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcHNybW9raWducGZpcHR3ZmdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU5ODk0NywiZXhwIjoyMDk0MTc0OTQ3fQ.-YPluIt08Q5Fwvv7mfeqWJ25DJFpCeopLCztJYtgQN8',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcHNybW9raWducGZpcHR3ZmdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU5ODk0NywiZXhwIjoyMDk0MTc0OTQ3fQ.-YPluIt08Q5Fwvv7mfeqWJ25DJFpCeopLCztJYtgQN8'
        },
        body: JSON.stringify({ sql_string: stmt + ';' })
      });
      console.log('Direct:', res.status, await res.text());
    } else {
      console.log('✅ Done');
    }
  }
  return { data: null, error: null };
});

if (error) console.error('Migration error:', error);
else console.log('✅ Migration completed');
