import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { id: "asc" } });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, company, location, content, image, rating } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: { name, role, company, location, content, image, rating },
    });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
    res.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
