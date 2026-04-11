import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

// GET all hero images
router.get("/", async (_req, res) => {
  try {
    const images = await prisma.heroImage.findMany({ orderBy: { sortOrder: "asc" } });
    res.json(images.map((img) => img.url));
  } catch (error) {
    console.error("Error fetching hero images:", error);
    res.status(500).json({ error: "Failed to fetch hero images" });
  }
});

// POST add hero image
router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "url is required" });

    const maxOrder = await prisma.heroImage.findFirst({ orderBy: { sortOrder: "desc" } });
    const heroImage = await prisma.heroImage.create({
      data: { url, sortOrder: (maxOrder?.sortOrder ?? -1) + 1 },
    });
    res.status(201).json(heroImage);
  } catch (error) {
    console.error("Error adding hero image:", error);
    res.status(500).json({ error: "Failed to add hero image" });
  }
});

// PUT replace all hero images
router.put("/", async (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls)) return res.status(400).json({ error: "urls array is required" });

    // Delete all existing hero images and re-create
    await prisma.heroImage.deleteMany();
    if (urls.length > 0) {
      await prisma.heroImage.createMany({
        data: urls.map((url: string, index: number) => ({ url, sortOrder: index })),
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error setting hero images:", error);
    res.status(500).json({ error: "Failed to set hero images" });
  }
});

// DELETE a single hero image
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.heroImage.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    res.status(500).json({ error: "Failed to delete hero image" });
  }
});

// DELETE all hero images
router.delete("/", async (_req, res) => {
  try {
    await prisma.heroImage.deleteMany();
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing hero images:", error);
    res.status(500).json({ error: "Failed to clear hero images" });
  }
});

export default router;
