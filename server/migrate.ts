import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadStatements(filePath: string): string[] {
  const sql = readFileSync(filePath, 'utf8');
  return sql
    .split(';')
    .map((s) =>
      s
        .split('\n')
        .filter((line) => !line.trimStart().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter((s) => s.length > 0);
}

async function migrate() {
  const migrationFiles = [
    join(__dirname, 'migrations/init.sql'),
    join(__dirname, 'migrations/002_add_categories_hero_images.sql'),
    join(__dirname, 'migrations/003_add_product_images_videos.sql'),
  ];

  const conn = await pool.getConnection();
  try {
    for (const file of migrationFiles) {
      const statements = loadStatements(file);
      for (const statement of statements) {
        await conn.query(statement);
      }
      console.log(`✅ Applied: ${file.split('/').pop()}`);
    }
    console.log('✅ All migrations complete');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate();
