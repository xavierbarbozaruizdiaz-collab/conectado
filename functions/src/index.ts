
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

admin.initializeApp();

export const optimizeImages = functions
  .region("us-central1")
  .storage
  .object()
  .onFinalize(async (object) => {
    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name;
    const contentType = object.contentType;

    if (!filePath || !contentType || !contentType.startsWith("image/")) {
      functions.logger.log("Not an image, aborting optimization.");
      return null;
    }

    // Ensure we are only processing product images and not other uploads
    if (!filePath.startsWith("products/")) {
      functions.logger.log("Not a product image, aborting optimization.", {path: filePath});
      return null;
    }
    
    // Exit if the image is already optimized to prevent infinite loops.
    if (object.metadata?.optimized === "true") {
      functions.logger.log("Image is already optimized.", {path: filePath});
      return null;
    }

    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = {
      contentType: contentType,
      // Add a custom metadata flag to indicate the image has been optimized.
      metadata: {
        ...object.metadata,
        optimized: "true",
      },
    };

    try {
      // 1. Download image to a temporary directory
      await bucket.file(filePath).download({ destination: tempFilePath });
      functions.logger.log("Image downloaded locally to", tempFilePath);

      // 2. Process the image using Sharp
      const resizedBuffer = await sharp(tempFilePath)
        .resize({ width: 1080, withoutEnlargement: true }) // Resize to a max width of 1080px without enlarging
        .jpeg({ quality: 80 }) // Compress to 80% quality JPEG
        .toBuffer();
        
      functions.logger.log("Image resized and compressed successfully.");

      // 4. Upload the optimized version, overwriting the original
      await bucket.file(filePath).save(resizedBuffer, {
        metadata: metadata,
      });

      functions.logger.log("Optimized image uploaded to bucket.", {path: filePath});

      // 5. Clean up the temporary file
      return fs.unlinkSync(tempFilePath);
    } catch (error) {
      functions.logger.error("Error optimizing image:", error);
      return null;
    }
  });
