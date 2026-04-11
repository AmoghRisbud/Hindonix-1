import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

// GET all products
router.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    const mapped = products.map((p) => ({
      ...p,
      finishes: p.finishes as string[],
      finishIds: (p.finishIds as number[] | null) ?? undefined,
    }));
    res.json(mapped);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({
      ...product,
      finishes: product.finishes as string[],
      finishIds: (product.finishIds as number[] | null) ?? undefined,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const { name, category, categoryId, subcategory, subcategoryId, material, materialId, description, modelNumber, longDescription, image, finishes, finishIds } = req.body;
    const product = await prisma.product.create({
      data: { name, category, categoryId, subcategory, subcategoryId, material, materialId, description, modelNumber, longDescription, image, finishes: finishes ?? [], finishIds },
    });
    res.status(201).json({ ...product, finishes: product.finishes as string[] });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json({ ...product, finishes: product.finishes as string[] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
