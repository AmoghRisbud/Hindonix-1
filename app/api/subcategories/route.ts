import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM subcategories ORDER BY id ASC");
  return NextResponse.json((rows as any[]).map((r) => ({ ...r, categoryId: r.category_id })));
}

export async function POST(request: Request) {
  const { name, categoryId, description } = await request.json();
  const [result] = await pool.query(
    "INSERT INTO subcategories (name, category_id, description) VALUES (?, ?, ?)",
    [name, categoryId, description ?? null]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, name, categoryId, description }, { status: 201 });
}
