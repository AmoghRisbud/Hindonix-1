import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.create({ data: { name, description } });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const category = await prisma.category.update({ where: { id }, data: req.body });
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if category has products
    const categories = await prisma.category.findMany();
    const categoryName = categories.find((c) => c.id === id)?.name;
    const productCount = await prisma.product.count({
      where: {
        OR: [
          { categoryId: id },
          ...(categoryName ? [{ category: categoryName }] : []),
        ],
      },
    });

    if (productCount > 0) {
      return res.status(400).json({ error: "Cannot delete category with products" });
    }

    // Delete associated subcategories and materials
    await prisma.subcategory.deleteMany({ where: { categoryId: id } });
    await prisma.material.deleteMany({ where: { categoryId: id } });

    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
