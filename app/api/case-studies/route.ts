import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseJSON } from "../_helpers";

export async function GET() {
  const [rows] = await pool.query("SELECT * FROM case_studies ORDER BY id DESC");
  return NextResponse.json((rows as any[]).map((r) => ({ ...r, stats: parseJSON(r.stats) })));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, client, category, location, image, problem, solution, outcome, stats } = body;
  const [result] = await pool.query(
    `INSERT INTO case_studies (title, client, category, location, image, problem, solution, outcome, stats)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, client, category, location, image, problem, solution, outcome, JSON.stringify(stats ?? [])]
  );
  const id = (result as any).insertId;
  return NextResponse.json({ id, title, client, category, location, image, problem, solution, outcome, stats: stats ?? [] }, { status: 201 });
}
