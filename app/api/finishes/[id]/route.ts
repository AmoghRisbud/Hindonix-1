import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, categoryId, image, description } = await request.json();
  await pool.query(
    "UPDATE finishes SET name=?, category_id=?, image=?, description=? WHERE id=?",
    [name, categoryId, image, description ?? null, id]
  );
  return NextResponse.json({ id: parseInt(id), name, categoryId, image, description });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM finishes WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
