import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function check() {
  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("RECENT USERS:", users);

  const { data: hubs } = await supabase.from('hubs').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("RECENT HUBS:", hubs);
}
check();
