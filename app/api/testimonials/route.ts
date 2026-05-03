import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM testimonials ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, role, company, location, content, image, rating } = await request.json();
  const [result] = await pool.query(
    `INSERT INTO testimonials (name, role, company, location, content, image, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, role, company, location, content, image ?? null, rating ?? 5]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, name, role, company, location, content, image, rating: rating ?? 5 }, { status: 201 });
}
