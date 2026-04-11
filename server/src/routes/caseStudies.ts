import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({ orderBy: { id: "asc" } });
    const mapped = caseStudies.map((cs) => ({
      ...cs,
      stats: cs.stats as { label: string; value: string }[],
    }));
    res.json(mapped);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const cs = await prisma.caseStudy.findUnique({ where: { id } });
    if (!cs) return res.status(404).json({ error: "Case study not found" });
    res.json({ ...cs, stats: cs.stats as { label: string; value: string }[] });
  } catch (error) {
    console.error("Error fetching case study:", error);
    res.status(500).json({ error: "Failed to fetch case study" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, client, category, location, image, problem, solution, outcome, stats } = req.body;
    const cs = await prisma.caseStudy.create({
      data: { title, client, category, location, image, problem, solution, outcome, stats: stats ?? [] },
    });
    res.status(201).json(cs);
  } catch (error) {
    console.error("Error creating case study:", error);
    res.status(500).json({ error: "Failed to create case study" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const cs = await prisma.caseStudy.update({ where: { id }, data: req.body });
    res.json(cs);
  } catch (error) {
    console.error("Error updating case study:", error);
    res.status(500).json({ error: "Failed to update case study" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.caseStudy.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting case study:", error);
    res.status(500).json({ error: "Failed to delete case study" });
  }
});

export default router;
