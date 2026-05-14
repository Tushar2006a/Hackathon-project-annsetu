import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function testHub() {
  console.log("Testing hub insertion...");
  const hubId = randomUUID();
  const { data, error } = await supabase
    .from('hubs')
    .insert([{
      id: hubId,
      name: 'Test Hub from API',
      address: 'Test Address',
      city: 'Test City',
      pincode: '123456',
      lat: null,
      lng: null
    }])
    .select()
    .single();

  if (error) {
    console.error("ERROR INSERTING HUB:", error.message);
    if (error.details) console.error("Details:", error.details);
    if (error.hint) console.error("Hint:", error.hint);
  } else {
    console.log("SUCCESS! Hub created:", data);
  }
}
testHub();
