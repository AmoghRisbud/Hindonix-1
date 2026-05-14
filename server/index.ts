import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001');

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseJSON(val: unknown, fallback: unknown = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/health/db', async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({ status: 'ok', message: 'MySQL connection successful' });
  } catch (err: any) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

// ── Products ──────────────────────────────────────────────────────────────────

app.get('/api/products', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  const products = (rows as any[]).map((r) => ({
    ...r,
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id,
    materialId: r.material_id,
    modelNumber: r.model_number,
    longDescription: r.long_description,
    finishes: parseJSON(r.finishes),
  }));
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  const r = (rows as any[])[0];
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...r,
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id,
    materialId: r.material_id,
    modelNumber: r.model_number,
    longDescription: r.long_description,
    finishes: parseJSON(r.finishes),
  });
});

app.post('/api/products', async (req, res) => {
  const { name, category, categoryId, subcategory, subcategoryId, material, materialId,
          description, modelNumber, longDescription, image, finishes } = req.body;
  const [result] = await pool.query(
    `INSERT INTO products (name, category, category_id, subcategory, subcategory_id, material,
      material_id, description, model_number, long_description, image, finishes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, categoryId ?? null, subcategory ?? null, subcategoryId ?? null,
     material, materialId ?? null, description, modelNumber ?? null, longDescription ?? null,
     image, JSON.stringify(finishes ?? [])]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, category, categoryId, subcategory, subcategoryId,
    material, materialId, description, modelNumber, longDescription, image, finishes: finishes ?? [] });
});

app.put('/api/products/:id', async (req, res) => {
  const { name, category, categoryId, subcategory, subcategoryId, material, materialId,
          description, modelNumber, longDescription, image, finishes } = req.body;
  await pool.query(
    `UPDATE products SET name=?, category=?, category_id=?, subcategory=?, subcategory_id=?,
      material=?, material_id=?, description=?, model_number=?, long_description=?, image=?,
      finishes=? WHERE id=?`,
    [name, category, categoryId ?? null, subcategory ?? null, subcategoryId ?? null,
     material, materialId ?? null, description, modelNumber ?? null, longDescription ?? null,
     image, JSON.stringify(finishes ?? []), req.params.id]
  );
  res.json({ id: parseInt(req.params.id), ...req.body });
});

app.delete('/api/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Case Studies ──────────────────────────────────────────────────────────────

app.get('/api/case-studies', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM case_studies ORDER BY id DESC');
  res.json((rows as any[]).map((r) => ({ ...r, stats: parseJSON(r.stats) })));
});

app.get('/api/case-studies/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM case_studies WHERE id = ?', [req.params.id]);
  const r = (rows as any[])[0];
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json({ ...r, stats: parseJSON(r.stats) });
});

app.post('/api/case-studies', async (req, res) => {
  const { title, client, category, location, image, problem, solution, outcome, stats } = req.body;
  const [result] = await pool.query(
    `INSERT INTO case_studies (title, client, category, location, image, problem, solution, outcome, stats)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, client, category, location, image, problem, solution, outcome, JSON.stringify(stats ?? [])]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, title, client, category, location, image, problem, solution, outcome, stats: stats ?? [] });
});

app.put('/api/case-studies/:id', async (req, res) => {
  const { title, client, category, location, image, problem, solution, outcome, stats } = req.body;
  await pool.query(
    `UPDATE case_studies SET title=?, client=?, category=?, location=?, image=?, problem=?,
      solution=?, outcome=?, stats=? WHERE id=?`,
    [title, client, category, location, image, problem, solution, outcome,
     JSON.stringify(stats ?? []), req.params.id]
  );
  res.json({ id: parseInt(req.params.id), ...req.body });
});

app.delete('/api/case-studies/:id', async (req, res) => {
  await pool.query('DELETE FROM case_studies WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Blogs ─────────────────────────────────────────────────────────────────────

app.get('/api/blogs', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM blogs ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/blogs', async (req, res) => {
  const { image, content } = req.body;
  const [result] = await pool.query(
    'INSERT INTO blogs (image, content) VALUES (?, ?)', [image, content]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, image, content });
});

app.put('/api/blogs/:id', async (req, res) => {
  const { image, content } = req.body;
  await pool.query('UPDATE blogs SET image=?, content=? WHERE id=?', [image, content, req.params.id]);
  res.json({ id: parseInt(req.params.id), image, content });
});

app.delete('/api/blogs/:id', async (req, res) => {
  await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Testimonials ──────────────────────────────────────────────────────────────

app.get('/api/testimonials', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
  res.json(rows);
});

app.post('/api/testimonials', async (req, res) => {
  const { name, role, company, location, content, image, rating } = req.body;
  const [result] = await pool.query(
    `INSERT INTO testimonials (name, role, company, location, content, image, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, role, company, location, content, image ?? null, rating ?? 5]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, role, company, location, content, image, rating: rating ?? 5 });
});

app.put('/api/testimonials/:id', async (req, res) => {
  const { name, role, company, location, content, image, rating } = req.body;
  await pool.query(
    `UPDATE testimonials SET name=?, role=?, company=?, location=?, content=?, image=?, rating=?
     WHERE id=?`,
    [name, role, company, location, content, image ?? null, rating ?? 5, req.params.id]
  );
  res.json({ id: parseInt(req.params.id), ...req.body });
});

app.delete('/api/testimonials/:id', async (req, res) => {
  await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Categories ────────────────────────────────────────────────────────────────

app.get('/api/categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
  res.json(rows);
});

app.post('/api/categories', async (req, res) => {
  const { name, description } = req.body;
  const [result] = await pool.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)', [name, description ?? null]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, description });
});

app.put('/api/categories/:id', async (req, res) => {
  const { name, description } = req.body;
  await pool.query('UPDATE categories SET name=?, description=? WHERE id=?',
    [name, description ?? null, req.params.id]);
  res.json({ id: parseInt(req.params.id), name, description });
});

app.delete('/api/categories/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Subcategories ─────────────────────────────────────────────────────────────

app.get('/api/subcategories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM subcategories ORDER BY id ASC');
  res.json((rows as any[]).map((r) => ({ ...r, categoryId: r.category_id })));
});

app.post('/api/subcategories', async (req, res) => {
  const { name, categoryId, description } = req.body;
  const [result] = await pool.query(
    'INSERT INTO subcategories (name, category_id, description) VALUES (?, ?, ?)',
    [name, categoryId, description ?? null]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, categoryId, description });
});

app.put('/api/subcategories/:id', async (req, res) => {
  const { name, categoryId, description } = req.body;
  await pool.query('UPDATE subcategories SET name=?, category_id=?, description=? WHERE id=?',
    [name, categoryId, description ?? null, req.params.id]);
  res.json({ id: parseInt(req.params.id), name, categoryId, description });
});

app.delete('/api/subcategories/:id', async (req, res) => {
  await pool.query('DELETE FROM subcategories WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Materials ─────────────────────────────────────────────────────────────────

app.get('/api/materials', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM materials ORDER BY id ASC');
  res.json((rows as any[]).map((r) => ({
    ...r, categoryId: r.category_id, subcategoryId: r.subcategory_id
  })));
});

app.post('/api/materials', async (req, res) => {
  const { name, categoryId, subcategoryId, description } = req.body;
  const [result] = await pool.query(
    'INSERT INTO materials (name, category_id, subcategory_id, description) VALUES (?, ?, ?, ?)',
    [name, categoryId ?? null, subcategoryId ?? null, description ?? null]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, categoryId, subcategoryId, description });
});

app.put('/api/materials/:id', async (req, res) => {
  const { name, categoryId, subcategoryId, description } = req.body;
  await pool.query(
    'UPDATE materials SET name=?, category_id=?, subcategory_id=?, description=? WHERE id=?',
    [name, categoryId ?? null, subcategoryId ?? null, description ?? null, req.params.id]
  );
  res.json({ id: parseInt(req.params.id), name, categoryId, subcategoryId, description });
});

app.delete('/api/materials/:id', async (req, res) => {
  await pool.query('DELETE FROM materials WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Finish Categories ─────────────────────────────────────────────────────────

app.get('/api/finish-categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM finish_categories ORDER BY id ASC');
  res.json(rows);
});

app.post('/api/finish-categories', async (req, res) => {
  const { name, description } = req.body;
  const [result] = await pool.query(
    'INSERT INTO finish_categories (name, description) VALUES (?, ?)', [name, description ?? null]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, description });
});

app.put('/api/finish-categories/:id', async (req, res) => {
  const { name, description } = req.body;
  await pool.query('UPDATE finish_categories SET name=?, description=? WHERE id=?',
    [name, description ?? null, req.params.id]);
  res.json({ id: parseInt(req.params.id), name, description });
});

app.delete('/api/finish-categories/:id', async (req, res) => {
  await pool.query('DELETE FROM finish_categories WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Finishes ──────────────────────────────────────────────────────────────────

app.get('/api/finishes', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM finishes ORDER BY id ASC');
  res.json((rows as any[]).map((r) => ({ ...r, categoryId: r.category_id })));
});

app.post('/api/finishes', async (req, res) => {
  const { name, categoryId, image, description } = req.body;
  const [result] = await pool.query(
    'INSERT INTO finishes (name, category_id, image, description) VALUES (?, ?, ?, ?)',
    [name, categoryId, image, description ?? null]
  );
  const id = (result as any).insertId;
  res.status(201).json({ id, name, categoryId, image, description });
});

app.put('/api/finishes/:id', async (req, res) => {
  const { name, categoryId, image, description } = req.body;
  await pool.query(
    'UPDATE finishes SET name=?, category_id=?, image=?, description=? WHERE id=?',
    [name, categoryId, image, description ?? null, req.params.id]
  );
  res.json({ id: parseInt(req.params.id), name, categoryId, image, description });
});

app.delete('/api/finishes/:id', async (req, res) => {
  await pool.query('DELETE FROM finishes WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Hero Images ───────────────────────────────────────────────────────────────

app.get('/api/hero-images', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM hero_images ORDER BY id DESC LIMIT 1');
  const r = (rows as any[])[0];
  if (!r) return res.json(['/images/home/hero-knobs.jpg']);
  res.json(parseJSON(r.urls, ['/images/home/hero-knobs.jpg']));
});

app.put('/api/hero-images', async (req, res) => {
  const { urls } = req.body as { urls: string[] };
  const [rows] = await pool.query('SELECT id FROM hero_images LIMIT 1');
  const existing = (rows as any[])[0];
  if (existing) {
    await pool.query('UPDATE hero_images SET urls=? WHERE id=?',
      [JSON.stringify(urls), existing.id]);
  } else {
    await pool.query('INSERT INTO hero_images (urls) VALUES (?)', [JSON.stringify(urls)]);
  }
  res.json(urls);
});

// ── Error handler ─────────────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
