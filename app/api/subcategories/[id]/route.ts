import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, categoryId, description } = await request.json();
  await pool.query("UPDATE subcategories SET name=?, category_id=?, description=? WHERE id=?",
    [name, categoryId, description ?? null, id]);
  return NextResponse.json({ id: parseInt(id), name, categoryId, description });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM subcategories WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
