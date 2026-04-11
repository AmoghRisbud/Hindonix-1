import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const finishes = await prisma.finish.findMany({ orderBy: { id: "asc" } });
    res.json(finishes);
  } catch (error) {
    console.error("Error fetching finishes:", error);
    res.status(500).json({ error: "Failed to fetch finishes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, categoryId, image, description } = req.body;
    const finish = await prisma.finish.create({ data: { name, categoryId, image, description } });
    res.status(201).json(finish);
  } catch (error) {
    console.error("Error creating finish:", error);
    res.status(500).json({ error: "Failed to create finish" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const finish = await prisma.finish.update({ where: { id }, data: req.body });
    res.json(finish);
  } catch (error) {
    console.error("Error updating finish:", error);
    res.status(500).json({ error: "Failed to update finish" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.finish.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting finish:", error);
    res.status(500).json({ error: "Failed to delete finish" });
  }
});

export default router;
