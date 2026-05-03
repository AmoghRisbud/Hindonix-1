import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, description } = await request.json();
  await pool.query("UPDATE finish_categories SET name=?, description=? WHERE id=?",
    [name, description ?? null, id]);
  return NextResponse.json({ id: parseInt(id), name, description });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM finish_categories WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
