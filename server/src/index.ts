import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import productsRouter from "./routes/products.js";
import blogsRouter from "./routes/blogs.js";
import testimonialsRouter from "./routes/testimonials.js";
import caseStudiesRouter from "./routes/caseStudies.js";
import categoriesRouter from "./routes/categories.js";
import subcategoriesRouter from "./routes/subcategories.js";
import materialsRouter from "./routes/materials.js";
import finishesRouter from "./routes/finishes.js";
import finishCategoriesRouter from "./routes/finishCategories.js";
import heroImagesRouter from "./routes/heroImages.js";
import uploadRouter from "./routes/upload.js";

export const prisma = new PrismaClient();

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// API routes
app.use("/api/products", productsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/case-studies", caseStudiesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subcategoriesRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/finishes", finishesRouter);
app.use("/api/finish-categories", finishCategoriesRouter);
app.use("/api/hero-images", heroImagesRouter);
app.use("/api/upload", uploadRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Hindonix API server running on port ${PORT}`);
});
