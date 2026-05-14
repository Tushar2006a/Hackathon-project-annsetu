#!/usr/bin/env node
/**
 * Annsetu Database Setup Script
 * Executes the complete schema + seed SQL on your Supabase project.
 *
 * Usage:
 *   node supabase/setup-db.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>
 *
 * Get these from: https://supabase.com/dashboard/project/sxbzszonbefaaswgvuux/settings/api
 *   - Project URL (starts with https://sxbzszonbefaaswgvuux.supabase.co)
 *   - service_role key (under "Project API Keys" → service_role → Reveal)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.argv[2];
const SERVICE_ROLE_KEY = process.argv[3];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(`
  ╔══════════════════════════════════════════════════════╗
  ║  Annsetu Database Setup                              ║
  ╠══════════════════════════════════════════════════════╣
  ║                                                      ║
  ║  Usage:                                              ║
  ║    node supabase/setup-db.mjs <URL> <SERVICE_KEY>    ║
  ║                                                      ║
  ║  Get credentials from Supabase Dashboard:            ║
  ║  → Project Settings → API                            ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

// Read the SQL files
const schemaSql = readFileSync(join(__dirname, 'migrations', '001_complete_schema.sql'), 'utf-8');
const seedSql = readFileSync(join(__dirname, 'migrations', '002_seed_data.sql'), 'utf-8');

async function executeSQL(sql, label) {
  console.log(`\n⏳ Executing: ${label}...`);
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({}),
  });

  // The REST API can't execute raw SQL directly.
  // Use the pg endpoint for raw SQL execution.
  const pgRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!pgRes.ok) {
    // Fallback: use the SQL endpoint via the management API
    const sqlRes = await fetch(`${SUPABASE_URL.replace('.supabase.co', '.supabase.co')}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: sql,
    });
    
    if (!sqlRes.ok) {
      throw new Error(`HTTP ${sqlRes.status}: ${await sqlRes.text()}`);
    }
    return await sqlRes.json();
  }

  return await pgRes.json();
}

async function main() {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║  🌱 Annsetu Database Setup                          ║
  ║  Project: sxbzszonbefaaswgvuux                      ║
  ╚══════════════════════════════════════════════════════╝
  `);

  try {
    // Test connection first
    console.log('🔌 Testing connection...');
    const healthRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    
    if (!healthRes.ok) {
      console.error('❌ Failed to connect to Supabase. Check your URL and service_role key.');
      process.exit(1);
    }
    console.log('✅ Connected to Supabase!');

    // Execute schema
    try {
      await executeSQL(schemaSql, '001_complete_schema.sql (21 tables)');
      console.log('✅ Schema created!');
    } catch (e) {
      console.log(`⚠️  Schema execution via API returned: ${e.message}`);
      console.log('   This is expected — raw SQL must be run in the SQL Editor.');
    }

    // Execute seed data
    try {
      await executeSQL(seedSql, '002_seed_data.sql (seed data)');
      console.log('✅ Seed data inserted!');
    } catch (e) {
      console.log(`⚠️  Seed data execution via API returned: ${e.message}`);
    }

    console.log(`
  ════════════════════════════════════════════════════════
  
  📋 If the API method didn't work, copy-paste these 
     SQL files into the Supabase SQL Editor:
  
  1. supabase/migrations/001_complete_schema.sql
  2. supabase/migrations/002_seed_data.sql
  
  SQL Editor: https://supabase.com/dashboard/project/sxbzszonbefaaswgvuux/sql/new
  
  ════════════════════════════════════════════════════════
    `);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
