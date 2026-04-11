import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const subcategories = await prisma.subcategory.findMany({ orderBy: { id: "asc" } });
    res.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    const subcategory = await prisma.subcategory.create({ data: { name, categoryId, description } });
    res.status(201).json(subcategory);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ error: "Failed to create subcategory" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const subcategory = await prisma.subcategory.update({ where: { id }, data: req.body });
    res.json(subcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if subcategory has products
    const subcategories = await prisma.subcategory.findMany();
    const subcategoryName = subcategories.find((s) => s.id === id)?.name;
    const productCount = await prisma.product.count({
      where: {
        OR: [
          { subcategoryId: id },
          ...(subcategoryName ? [{ subcategory: subcategoryName }] : []),
        ],
      },
    });

    if (productCount > 0) {
      return res.status(400).json({ error: "Cannot delete subcategory with products" });
    }

    // Delete associated materials
    await prisma.material.deleteMany({ where: { subcategoryId: id } });

    await prisma.subcategory.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
});

export default router;
