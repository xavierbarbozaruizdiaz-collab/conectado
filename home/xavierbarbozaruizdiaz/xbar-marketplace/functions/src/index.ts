
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

    if (!filePath.startsWith("products/")) {
      functions.logger.log("Not a product image, aborting optimization.");
      return null;
    }
    
    if (object.metadata?.optimized === "true") {
      functions.logger.log("Image is already optimized.");
      return null;
    }

    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = {
      contentType: contentType,
      metadata: {
        ...object.metadata,
        optimized: "true",
      },
    };

    try {
      await bucket.file(filePath).download({ destination: tempFilePath });
      functions.logger.log("Image downloaded locally to", tempFilePath);

      const resizedBuffer = await sharp(tempFilePath)
        .resize({ width: 1080, withoutEnlargement: true }) 
        .jpeg({ quality: 80 }) 
        .toBuffer();
        
      functions.logger.log("Image resized and compressed successfully.");

      await bucket.file(filePath).save(resizedBuffer, {
        metadata: metadata,
      });

      functions.logger.log("Optimized image uploaded to bucket.");

      return fs.unlinkSync(tempFilePath);
    } catch (error) {
      functions.logger.error("Error optimizing image:", error);
      return null;
    }
  });
