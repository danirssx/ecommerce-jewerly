import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting image upload process...");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const altText = formData.get("altText") as string;

    console.log("Form data extracted:", {
      fileSize: file?.size,
      fileName: file?.name,
      productId,
      altText
    });

    if (!file) {
      console.error("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!productId) {
      console.error("No product ID provided");
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Check file size (Vercel has limits)
    if (file.size > 10 * 1024 * 1024) {
      console.error("File too large:", file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 },
      );
    }

    console.log("Starting Cloudinary upload...");
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);
    console.log("Cloudinary upload successful:", cloudinaryResult.public_id);

    // Save to database
    console.log("Starting database operations...");

    // Get the highest sort_order for this product
    console.log("Fetching existing images for product:", productId);
    const { data: existingImages, error: fetchError } = await supabaseAdmin
      .from("product_images")
      .select("sort_order")
      .eq("product_id", parseInt(productId))
      .order("sort_order", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching existing images:", fetchError);
    } else {
      console.log("Existing images found:", existingImages?.length || 0);
    }

    const nextSortOrder =
      existingImages && existingImages.length > 0
        ? existingImages[0].sort_order + 1
        : 1;

    console.log("Next sort order:", nextSortOrder);

    console.log("Inserting new image record...");
    const { data, error } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: parseInt(productId),
        url: cloudinaryResult.secure_url,
        url_cloudinary: cloudinaryResult.secure_url,
        alt_text: altText || `Product ${productId} image`,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save image to database", details: error.message },
        { status: 500 },
      );
    }

    console.log("Image record saved successfully:", data.id);

    return NextResponse.json({
      data: {
        id: data.id,
        url: data.url,
        url_cloudinary: data.url_cloudinary,
        alt_text: data.alt_text,
        sort_order: data.sort_order,
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
        },
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // More specific error messages for debugging
    let errorMessage = "Failed to upload image";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 },
    );
  }
}
