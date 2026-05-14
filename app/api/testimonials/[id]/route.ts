import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, role, company, location, content, image, rating } = body;
    await pool.query(
      `UPDATE testimonials SET name=?, role=?, company=?, location=?, content=?, image=?, rating=? WHERE id=?`,
      [name, role, company, location, content, image ?? null, rating ?? 5, id]
    );
    return NextResponse.json({ id: parseInt(id), ...body });
  } catch (err: any) {
    console.error("Error updating testimonial:", err);
    return NextResponse.json({ error: err.message || "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting testimonial:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
