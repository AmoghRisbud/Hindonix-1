import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Server-side Cloudinary image deletion endpoint.
 * Cloudinary deletion requires API Key + Secret which must stay server-side.
 *
 * Body: { publicIds: string[] }
 *   - publicIds: array of Cloudinary public_ids to delete
 *
 * Alternatively: { urls: string[] }
 *   - urls: array of Cloudinary URLs; public_ids will be extracted automatically
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      // If Cloudinary credentials are not configured, skip deletion silently
      console.warn("Cloudinary API credentials not configured — skipping image deletion");
      return NextResponse.json({ success: true, skipped: true });
    }

    let publicIds: string[] = body.publicIds || [];

    // If URLs are provided instead, extract public_ids from them
    if (body.urls && Array.isArray(body.urls)) {
      const extracted = body.urls
        .map((url: string) => extractPublicIdFromUrl(url))
        .filter((id: string | null): id is string => id !== null);
      publicIds = [...publicIds, ...extracted];
    }

    if (publicIds.length === 0) {
      return NextResponse.json({ success: true, deleted: [] });
    }

    const results: { publicId: string; result: string }[] = [];

    for (const publicId of publicIds) {
      try {
        // Determine resource type from the public_id or URL context
        const resourceType = detectResourceType(publicId, body.urls);
        const result = await deleteFromCloudinary(publicId, resourceType, cloudName, apiKey, apiSecret);
        results.push({ publicId, result: result.result || "ok" });
      } catch (err: any) {
        console.error(`Failed to delete Cloudinary asset ${publicId}:`, err.message);
        results.push({ publicId, result: "error" });
      }
    }

    return NextResponse.json({ success: true, deleted: results });
  } catch (err: any) {
    console.error("Cloudinary delete endpoint error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete images" },
      { status: 500 }
    );
  }
}

/**
 * Extract the public_id from a Cloudinary URL.
 * e.g. https://res.cloudinary.com/cloud_name/image/upload/v1234567/hindonix/abc123.jpg
 *   → hindonix/abc123
 */
function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Find the index of "upload" and take everything after version number
    const uploadIdx = pathParts.indexOf("upload");
    if (uploadIdx === -1) return null;

    // Skip "upload" and the version string (e.g., "v1234567890")
    let startIdx = uploadIdx + 1;
    if (pathParts[startIdx] && /^v\d+$/.test(pathParts[startIdx])) {
      startIdx++;
    }

    // Join the remaining path parts and remove file extension
    const publicIdWithExt = pathParts.slice(startIdx).join("/");
    // Remove the file extension
    const lastDotIdx = publicIdWithExt.lastIndexOf(".");
    if (lastDotIdx > 0) {
      return publicIdWithExt.substring(0, lastDotIdx);
    }
    return publicIdWithExt;
  } catch {
    return null;
  }
}

/**
 * Detect resource type (image vs video) from the URL or public_id
 */
function detectResourceType(publicId: string, urls?: string[]): string {
  if (urls && Array.isArray(urls)) {
    const matchingUrl = urls.find((u: string) =>
      u.includes(publicId) || extractPublicIdFromUrl(u) === publicId
    );
    if (matchingUrl && matchingUrl.includes("/video/upload/")) {
      return "video";
    }
  }
  return "image";
}

/**
 * Delete a resource from Cloudinary using the Admin API
 */
async function deleteFromCloudinary(
  publicId: string,
  resourceType: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<{ result: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary API error (${response.status}): ${text}`);
  }

  return response.json();
}
