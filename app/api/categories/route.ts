import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, description } = await request.json();
  const [result] = await pool.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)", [name, description ?? null]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, name, description }, { status: 201 });
}
