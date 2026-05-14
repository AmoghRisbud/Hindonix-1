import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, categoryId, subcategoryId, description } = await request.json();
    await pool.query(
      "UPDATE materials SET name=?, category_id=?, subcategory_id=?, description=? WHERE id=?",
      [name, categoryId ?? null, subcategoryId ?? null, description ?? null, id]
    );
    return NextResponse.json({ id: parseInt(id), name, categoryId, subcategoryId, description });
  } catch (err: any) {
    console.error("Error updating material:", err);
    return NextResponse.json({ error: err.message || "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM materials WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting material:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete material" },
      { status: 500 }
    );
  }
}
