import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, categoryId, description } = await request.json();
    await pool.query("UPDATE subcategories SET name=?, category_id=?, description=? WHERE id=?",
      [name, categoryId, description ?? null, id]);
    return NextResponse.json({ id: parseInt(id), name, categoryId, description });
  } catch (err: any) {
    console.error("Error updating subcategory:", err);
    return NextResponse.json({ error: err.message || "Failed to update subcategory" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM subcategories WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting subcategory:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
