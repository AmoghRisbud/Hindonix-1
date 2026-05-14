import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM finishes ORDER BY id ASC");
  return NextResponse.json((rows as any[]).map((r) => ({ ...r, categoryId: r.category_id })));
}

export async function POST(request: Request) {
  const { name, categoryId, image, description } = await request.json();
  const [result] = await pool.query(
    "INSERT INTO finishes (name, category_id, image, description) VALUES (?, ?, ?, ?)",
    [name, categoryId, image, description ?? null]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, name, categoryId, image, description }, { status: 201 });
}
