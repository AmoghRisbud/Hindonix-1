import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT url FROM cta_image ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    return NextResponse.json({ url: r?.url || "" });
  } catch {
    return NextResponse.json({ url: "" });
  }
}

export async function PUT(request: Request) {
  const { url } = await request.json() as { url: string };
  const [rows] = await pool.query("SELECT id FROM cta_image LIMIT 1");
  const existing = (rows as any[])[0];
  if (existing) {
    await pool.query("UPDATE cta_image SET url=? WHERE id=?", [url, existing.id]);
  } else {
    await pool.query("INSERT INTO cta_image (url) VALUES (?)", [url]);
  }
  return NextResponse.json({ url });
}
