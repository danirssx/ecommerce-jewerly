import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL?.split("@")[1] || "",
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Validate configuration
if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
  console.error("Cloudinary configuration missing. Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  console.error("Current config:", {
    cloud_name: cloudinary.config().cloud_name ? "SET" : "MISSING",
    api_key: cloudinary.config().api_key ? "SET" : "MISSING",
    api_secret: cloudinary.config().api_secret ? "SET" : "MISSING"
  });
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "altara_products",
): Promise<CloudinaryUploadResult> {
  console.log("uploadToCloudinary called with:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    folder
  });

  // Check configuration again before upload
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    const error = new Error("Cloudinary configuration is missing");
    console.error("Cloudinary config error:", error.message);
    throw error;
  }

  console.log("Converting file to buffer...");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log("Buffer created, size:", buffer.length);

  return new Promise((resolve, reject) => {
    console.log("Starting Cloudinary upload stream...");
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1000, height: 1000, crop: "limit", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else if (result) {
            console.log("Cloudinary upload success:", {
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format,
              bytes: result.bytes
            });
            resolve(result as CloudinaryUploadResult);
          } else {
            console.error("Cloudinary upload failed: no result returned");
            reject(new Error("Upload failed"));
          }
        },
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
