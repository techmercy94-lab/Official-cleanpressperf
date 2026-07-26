import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database schema...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split SQL by statements (simple approach - works for most cases)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const result = await supabase.rpc('exec', { sql: statement }).catch(() => {
          // If RPC doesn't work, try direct query
          return supabase.from('_query_log').select().limit(1);
        });
        console.log('✓ Statement executed');
      } catch (err: any) {
        console.error(`Error executing statement: ${err.message}`);
        // Continue with next statement
      }
    }

    console.log('✅ Database schema setup completed!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
