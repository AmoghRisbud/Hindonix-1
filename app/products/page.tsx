export const dynamic = 'force-dynamic';

import { getProducts, getCategories, getSubcategories, getMaterials, getFinishes } from "@/lib/data";
import { ProductsClient } from "./ProductsClient";

export default async function ProductsPage() {
  const [products, categories, subcategories, materials, finishes] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getSubcategories().catch(() => []),
    getMaterials().catch(() => []),
    getFinishes().catch(() => []),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialCategories={categories}
      initialSubcategories={subcategories}
      initialMaterials={materials}
      initialFinishes={finishes}
    />
  );
}
