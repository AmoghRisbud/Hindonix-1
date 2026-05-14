import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM blogs ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { image, content } = await request.json();
  const [result] = await pool.query("INSERT INTO blogs (image, content) VALUES (?, ?)", [image, content]);
  const id = (result as any).insertId;
  return NextResponse.json({ id, image, content }, { status: 201 });
}
