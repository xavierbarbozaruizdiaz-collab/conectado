
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

admin.initializeApp();

const BUCKET_NAME = `${process.env.GCLOUD_PROJECT}.appspot.com`;

export const optimizeImages = functions
  .region("us-central1") // You can change this to your preferred region
  .storage
  .object()
  .onFinalize(async (object) => {
    // Exit if this is triggered on a file that is not an image.
    if (!object.contentType?.startsWith("image/")) {
      functions.logger.log("This is not an image.");
      return null;
    }

    // Exit if the image is not in a 'products' folder.
    const filePath = object.name;
    if (!filePath || !filePath.startsWith("products/")) {
        functions.logger.log("Not a product image, skipping optimization.");
        return null;
    }
    
    // Exit if the image is already optimized.
    if (object.metadata?.optimized === "true") {
      functions.logger.log("Image is already optimized.");
      return null;
    }

    const bucket = admin.storage().bucket(BUCKET_NAME);
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = {
      contentType: object.contentType,
      // Add a custom metadata flag to prevent infinite loops
      metadata: {
        ...object.metadata,
        optimized: "true",
      },
    };

    try {
      // Download file from bucket to a temporary location
      await bucket.file(filePath).download({destination: tempFilePath});
      functions.logger.log("Image downloaded locally to", tempFilePath);

      // Resize the image using sharp
      const resizedBuffer = await sharp(tempFilePath)
        .resize({width: 1080, withoutEnlargement: true})
        .jpeg({quality: 80})
        .toBuffer();
        
      functions.logger.log("Image resized successfully.");

      // Upload the resized image back to the same path
      await bucket.file(filePath).save(resizedBuffer, {
        metadata: metadata,
      });

      functions.logger.log("Optimized image uploaded to bucket.");

      // Clean up the temporary file
      return fs.unlinkSync(tempFilePath);
    } catch (error) {
      functions.logger.error("Error optimizing image:", error);
      return null;
    }
  });
