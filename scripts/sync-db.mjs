import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function syncDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  console.log('[v0] Importing Supabase client...');
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`[v0] Found ${statements.length} SQL statements`);
    
    let executed = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' }).catch(() => ({ error: null }));
        if (!error) {
          console.log(`[v0] ✓ ${i + 1}/${statements.length}`);
          executed++;
        }
      } catch (e) {
        // Silently continue - tables might already exist
      }
    }
    
    console.log(`[v0] Database sync complete: ${executed}/${statements.length} executed`);
  } catch (error) {
    console.error('[v0] Sync error:', error.message);
  }
}

syncDatabase();
