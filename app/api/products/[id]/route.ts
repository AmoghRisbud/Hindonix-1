import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseJSON } from "../../_helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  const r = (rows as any[])[0];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...r,
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id,
    materialId: r.material_id,
    modelNumber: r.model_number,
    longDescription: r.long_description,
    finishes: parseJSON(r.finishes),
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { name, category, categoryId, subcategory, subcategoryId, material, materialId,
          description, modelNumber, longDescription, image, finishes } = body;
  await pool.query(
    `UPDATE products SET name=?, category=?, category_id=?, subcategory=?, subcategory_id=?,
      material=?, material_id=?, description=?, model_number=?, long_description=?, image=?,
      finishes=? WHERE id=?`,
    [name, category, categoryId ?? null, subcategory ?? null, subcategoryId ?? null,
     material, materialId ?? null, description, modelNumber ?? null, longDescription ?? null,
     image, JSON.stringify(finishes ?? []), id]
  );
  return NextResponse.json({ id: parseInt(id), ...body });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
