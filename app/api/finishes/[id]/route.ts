import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, categoryId, image, description } = await request.json();
    await pool.query(
      "UPDATE finishes SET name=?, category_id=?, image=?, description=? WHERE id=?",
      [name, categoryId, image, description ?? null, id]
    );
    return NextResponse.json({ id: parseInt(id), name, categoryId, image, description });
  } catch (err: any) {
    console.error("Error updating finish:", err);
    return NextResponse.json({ error: err.message || "Failed to update finish" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Fetch image for Cloudinary cleanup
    const [rows] = await pool.query("SELECT image FROM finishes WHERE id = ?", [id]);
    const record = (rows as any[])[0];

    await pool.query("DELETE FROM finishes WHERE id = ?", [id]);

    // Fire-and-forget Cloudinary cleanup
    if (record?.image && record.image.includes("res.cloudinary.com")) {
      cleanupCloudinaryAsset(record.image).catch((err) =>
        console.error("Cloudinary cleanup error:", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting finish:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete finish" },
      { status: 500 }
    );
  }
}

async function cleanupCloudinaryAsset(url: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;

  const publicId = extractPublicId(url);
  if (!publicId) return;

  const crypto = await import("crypto");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

function extractPublicId(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;
    let startIdx = uploadIdx + 1;
    if (parts[startIdx] && /^v\d+$/.test(parts[startIdx])) startIdx++;
    const withExt = parts.slice(startIdx).join("/");
    const dotIdx = withExt.lastIndexOf(".");
    return dotIdx > 0 ? withExt.substring(0, dotIdx) : withExt;
  } catch {
    return null;
  }
}
