export const dynamic = 'force-dynamic';

import pool from "@/lib/db";
import { parseJSON } from "@/app/api/_helpers";
import { ProductDetailClient } from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  const r = (rows as any[])[0];
  if (!r) notFound();
  const product = {
    ...r,
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id,
    materialId: r.material_id,
    modelNumber: r.model_number,
    longDescription: r.long_description,
    finishes: parseJSON(r.finishes),
    images: parseJSON(r.images),
    videos: parseJSON(r.videos),
  };
  return <ProductDetailClient product={product} />;
}
