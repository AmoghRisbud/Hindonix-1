import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseJSON } from "../../_helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM case_studies WHERE id = ?", [id]);
  const r = (rows as any[])[0];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...r, stats: parseJSON(r.stats) });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { title, client, category, location, image, problem, solution, outcome, stats } = body;
  await pool.query(
    `UPDATE case_studies SET title=?, client=?, category=?, location=?, image=?, problem=?,
      solution=?, outcome=?, stats=? WHERE id=?`,
    [title, client, category, location, image, problem, solution, outcome, JSON.stringify(stats ?? []), id]
  );
  return NextResponse.json({ id: parseInt(id), ...body });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.query("DELETE FROM case_studies WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
