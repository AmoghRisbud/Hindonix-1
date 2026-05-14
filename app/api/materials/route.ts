import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM materials ORDER BY id ASC");
  return NextResponse.json((rows as any[]).map((r) => ({
    ...r, categoryId: r.category_id, subcategoryId: r.subcategory_id
  })));
}

export async function POST(request: Request) {
  const { name, categoryId, subcategoryId, description } = await request.json();
  const [result] = await pool.query(
    "INSERT INTO materials (name, category_id, subcategory_id, description) VALUES (?, ?, ?, ?)",
    [name, categoryId ?? null, subcategoryId ?? null, description ?? null]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, name, categoryId, subcategoryId, description }, { status: 201 });
}
