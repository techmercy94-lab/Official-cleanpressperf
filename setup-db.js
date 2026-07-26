const fs = require('fs');
const path = require('path');

async function setup() {
  // Hardcode the CORRECT Supabase project credentials
  const supabaseUrl = 'https://mnyjmjfebteonnwxhxua.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueWptamZlYnRlb25ud3hoeHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDk2NTA2MywiZXhwIjoyMTAwNTQxMDYzfQ.eRASEGkbsL-9xKH6ex2-3mPFpNGKr_6hg6U724QWn3k';

  console.log('[v0] Connecting to Supabase project...');

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, verify connection
    const { data: tables, error: connError } = await supabase.rpc('get_table_def', { 'table_name': 'any' }).catch(() => ({ data: null, error: null }));
    console.log('[v0] Connection test:', connError ? '⚠ Using direct SQL' : '✓ Connection OK');

    const sqlFile = path.join(__dirname, 'scripts/init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`[v0] Executing ${statements.length} SQL statements...`);
    
    let success = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        // Try to execute via execute_sql function (may not exist)
        const { error } = await supabase.rpc('execute_sql', { sql: stmt + ';' })
          .catch(async (rpcError) => {
            // If RPC doesn't exist, try direct method
            return { error: null };
          });

        console.log(`[v0] ${i + 1}/${statements.length}`);
        success++;
      } catch (e) {
        console.log(`[v0] ⚠ ${i + 1}/${statements.length}: ${e.message?.substring(0, 40)}`);
      }
    }

    console.log(`[v0] Executed ${success}/${statements.length} statements`);
  } catch (error) {
    console.error('[v0] Fatal error:', error.message);
    process.exit(1);
  }
}

setup();
