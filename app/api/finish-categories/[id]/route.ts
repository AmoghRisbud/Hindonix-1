import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, description } = await request.json();
    await pool.query("UPDATE finish_categories SET name=?, description=? WHERE id=?",
      [name, description ?? null, id]);
    return NextResponse.json({ id: parseInt(id), name, description });
  } catch (err: any) {
    console.error("Error updating finish category:", err);
    return NextResponse.json({ error: err.message || "Failed to update finish category" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM finish_categories WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting finish category:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete finish category" },
      { status: 500 }
    );
  }
}
