
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

admin.initializeApp();

export const optimizeImages = functions
  .region("us-central1") // Puedes cambiar esto a tu región preferida
  .storage
  .object()
  .onFinalize(async (object) => {
    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name;
    const contentType = object.contentType;

    // 1. Validar que la función debe ejecutarse
    if (!filePath || !contentType || !contentType.startsWith("image/")) {
      functions.logger.log("No es una imagen, abortando optimización.");
      return null;
    }

    if (!filePath.startsWith("products/")) {
      functions.logger.log("No es una imagen de producto, abortando optimización.");
      return null;
    }
    
    if (object.metadata?.optimized === "true") {
      functions.logger.log("La imagen ya está optimizada.");
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
      // 2. Descargar la imagen a un entorno temporal
      await bucket.file(filePath).download({ destination: tempFilePath });
      functions.logger.log("Imagen descargada localmente a", tempFilePath);

      // 3. Procesar la imagen (redimensionar y comprimir)
      const resizedBuffer = await sharp(tempFilePath)
        .resize({ width: 1080, withoutEnlargement: true }) // Redimensiona si es más ancha de 1080px
        .jpeg({ quality: 80 }) // Comprime a 80% de calidad
        .toBuffer();
        
      functions.logger.log("Imagen redimensionada y comprimida exitosamente.");

      // 4. Subir la versión optimizada, sobrescribiendo la original
      await bucket.file(filePath).save(resizedBuffer, {
        metadata: metadata,
      });

      functions.logger.log("Imagen optimizada subida al bucket.");

      // 5. Limpiar el archivo temporal
      return fs.unlinkSync(tempFilePath);
    } catch (error) {
      functions.logger.error("Error optimizando imagen:", error);
      return null;
    }
  });
