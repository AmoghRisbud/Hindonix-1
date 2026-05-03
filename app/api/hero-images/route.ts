import { NextResponse } from "next/server";
import pool from "@/lib/db";

function parseJSON(val: unknown, fallback: unknown = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM hero_images ORDER BY id DESC LIMIT 1");
  const r = (rows as any[])[0];
  if (!r) return NextResponse.json(["/images/home/hero-knobs.jpg"]);
  return NextResponse.json(parseJSON(r.urls, ["/images/home/hero-knobs.jpg"]));
}

export async function PUT(request: Request) {
  const { urls } = await request.json() as { urls: string[] };
  const [rows] = await pool.query("SELECT id FROM hero_images LIMIT 1");
  const existing = (rows as any[])[0];
  if (existing) {
    await pool.query("UPDATE hero_images SET urls=? WHERE id=?", [JSON.stringify(urls), existing.id]);
  } else {
    await pool.query("INSERT INTO hero_images (urls) VALUES (?)", [JSON.stringify(urls)]);
  }
  return NextResponse.json(urls);
}
