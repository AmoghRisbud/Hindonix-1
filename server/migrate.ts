import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = readFileSync(join(__dirname, 'migrations/init.sql'), 'utf8');
  // Split on semicolons (ignoring empty statements)
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.query(statement);
    }
    console.log('✅ Migration complete');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate();
