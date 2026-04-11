// Cloudinary image upload utility
import { ENV } from "./env";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload an image file to Cloudinary and return the secure URL
 * @param file - The image file to upload
 * @returns Promise resolving to the Cloudinary upload response
 * @throws Error if upload fails or credentials are missing
 */
export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  const cloudName = ENV.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = ENV.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "hindonix"); // Organize uploads in a folder

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to upload image");
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image to Cloudinary"
    );
  }
};

/**
 * Delete an image from Cloudinary using its public_id
 * Note: This requires authentication token and is typically done server-side
 * For client-side deletion, you may need to implement a backend endpoint
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  // This is a placeholder - actual deletion requires server-side implementation
  // with Cloudinary API key and secret for security
  console.warn(
    "Image deletion should be implemented server-side for security:",
    publicId
  );
};

/**
 * Upload a hero image to Cloudinary with a fixed public_id so the URL is
 * always predictable — no database needed to track it.
 *
 * Requires a SEPARATE unsigned upload preset (VITE_CLOUDINARY_HERO_UPLOAD_PRESET)
 * with Overwrite=true and Unique filename=false, so re-uploads replace the asset.
 */
export const uploadHeroImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  const cloudName = ENV.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = ENV.CLOUDINARY_HERO_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Hero Cloudinary preset not configured. Set VITE_CLOUDINARY_HERO_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("public_id", "hero_main");
  formData.append("folder", "hindonix");
  formData.append("overwrite", "true");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to upload hero image");
    }

    return response.json() as Promise<CloudinaryUploadResponse>;
  } catch (error) {
    console.error("Cloudinary hero upload error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload hero image to Cloudinary"
    );
  }
};
