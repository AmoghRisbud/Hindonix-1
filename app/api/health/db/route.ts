import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return NextResponse.json({ status: "ok", message: "MySQL connection successful" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 503 });
  }
}
