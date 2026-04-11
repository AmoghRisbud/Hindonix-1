import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const finishCategories = await prisma.finishCategory.findMany({ orderBy: { id: "asc" } });
    res.json(finishCategories);
  } catch (error) {
    console.error("Error fetching finish categories:", error);
    res.status(500).json({ error: "Failed to fetch finish categories" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const fc = await prisma.finishCategory.create({ data: { name, description } });
    res.status(201).json(fc);
  } catch (error) {
    console.error("Error creating finish category:", error);
    res.status(500).json({ error: "Failed to create finish category" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const fc = await prisma.finishCategory.update({ where: { id }, data: req.body });
    res.json(fc);
  } catch (error) {
    console.error("Error updating finish category:", error);
    res.status(500).json({ error: "Failed to update finish category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if category has finishes
    const finishCount = await prisma.finish.count({ where: { categoryId: id } });
    if (finishCount > 0) {
      return res.status(400).json({ error: "Cannot delete finish category with finishes" });
    }

    await prisma.finishCategory.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting finish category:", error);
    res.status(500).json({ error: "Failed to delete finish category" });
  }
});

export default router;
