import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const router = Router();

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory storage — files are forwarded to Cloudinary, not saved on disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// POST /api/upload — upload an image to Cloudinary (signed, server-side)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const folder = (req.body.folder as string) || "hindonix";
    const publicId = req.body.public_id as string | undefined;
    const overwrite = req.body.overwrite === "true";

    const result = await new Promise<Record<string, unknown>>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            ...(publicId && { public_id: publicId }),
            overwrite,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as Record<string, unknown>);
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// DELETE /api/upload/:publicId — delete an image from Cloudinary
router.delete("/:publicId(*)", async (req, res) => {
  try {
    const publicId =
      (req.params as Record<string, string>)[0] ||
      (req.params as { publicId?: string }).publicId ||
      "";
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
