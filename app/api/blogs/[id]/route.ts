import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { image, content } = await request.json();
  await pool.query("UPDATE blogs SET image=?, content=? WHERE id=?", [image, content, id]);
  return NextResponse.json({ id: parseInt(id), image, content });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM blogs WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
