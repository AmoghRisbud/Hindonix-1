import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, description } = await request.json();
    await pool.query("UPDATE categories SET name=?, description=? WHERE id=?", [name, description ?? null, id]);
    return NextResponse.json({ id: parseInt(id), name, description });
  } catch (err: any) {
    console.error("Error updating category:", err);
    return NextResponse.json({ error: err.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting category:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
