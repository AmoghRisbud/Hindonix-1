export const dynamic = 'force-dynamic';

import { getProducts } from "@/lib/data";
import { ProductDetailClient } from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts().catch(() => []);
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
