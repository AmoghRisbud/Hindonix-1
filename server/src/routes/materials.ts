import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const materials = await prisma.material.findMany({ orderBy: { id: "asc" } });
    res.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, categoryId, subcategoryId, description } = req.body;
    const material = await prisma.material.create({ data: { name, categoryId, subcategoryId, description } });
    res.status(201).json(material);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ error: "Failed to create material" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const material = await prisma.material.update({ where: { id }, data: req.body });
    res.json(material);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Failed to update material" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if material has products
    const materials = await prisma.material.findMany();
    const materialName = materials.find((m) => m.id === id)?.name;
    const productCount = await prisma.product.count({
      where: {
        OR: [
          { materialId: id },
          ...(materialName ? [{ material: materialName }] : []),
        ],
      },
    });

    if (productCount > 0) {
      return res.status(400).json({ error: "Cannot delete material with products" });
    }

    await prisma.material.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Failed to delete material" });
  }
});

export default router;
