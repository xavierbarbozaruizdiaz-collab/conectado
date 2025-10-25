// scripts/seed.ts
import * as admin from "firebase-admin";

/**
 * Este script crea:
 * - 1 vendedor demo (vendors/demo-seller-uid, slug: demo-tienda)
 * - 12 productos demo vinculados a ese vendedor
 * Es idempotente: primero borra productos anteriores del mismo vendorSlug.
 *
 * Requiere secrets en GitHub Actions:
 *  - FIREBASE_SERVICE_ACCOUNT  (JSON completo de la cuenta de servicio)
 *  - FIREBASE_PROJECT_ID       (ID del proyecto Firebase)
 */

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1513709630908-1dc05c53f54a",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "https://images.unsplash.com/photo-1512499617640-c2f999098c95",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
];

async function main() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!sa || !projectId) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT o FIREBASE_PROJECT_ID faltan.");
  }

  // Inicializa Firebase Admin con la cuenta de servicio
  const cred = admin.credential.cert(JSON.parse(sa));
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: cred, projectId });
  }
  const db = admin.firestore();

  const demoUid = "demo-seller-uid";
  const vendorSlug = "demo-tienda";

  // 1) Crea/actualiza el vendedor demo
  await db
    .collection("vendors")
    .doc(demoUid)
    .set(
      {
        displayName: "Demo Tienda",
        slug: vendorSlug,
        logoUrl: "https://dummyimage.com/128x128/000/fff&text=MX",
        bannerUrl:
          "https://dummyimage.com/1200x300/eee/333&text=Mercadito+Xbar",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log("✅ Vendor demo listo:", vendorSlug);

  // 2) Borra productos demo anteriores del mismo vendorSlug (idempotente)
  const oldSnap = await db
    .collection("products")
    .where("vendorSlug", "==", vendorSlug)
    .get();

  if (!oldSnap.empty) {
    console.log(`🧹 Eliminando ${oldSnap.size} productos demo anteriores...`);
    const delBatch = db.batch();
    oldSnap.docs.forEach((doc) => delBatch.delete(doc.ref));
    await delBatch.commit();
    console.log("🧹 Limpieza de productos demo completada.");
  }

  // 3) Inserta 12 productos de demostración
  const batch = db.batch();
  for (let i = 0; i < 12; i++) {
    const ref = db.collection("products").doc();
    const price = Number((Math.random() * 100 + 10).toFixed(2));
    const title = `Producto demo ${i + 1}`;

    batch.set(ref, {
      title,
      slug: `producto-demo-${i + 1}`,
      description:
        "Producto de demostración cargado automáticamente por UCRA (/seed).",
      price,
      currency: "USD",
      stock: Math.floor(Math.random() * 30) + 1,
      images: [
        SAMPLE_IMAGES[i % SAMPLE_IMAGES.length] +
          `?auto=format&fit=crop&w=900&q=60&sig=${i}`,
      ],
      thumbnail:
        SAMPLE_IMAGES[i % SAMPLE_IMAGES.length] +
        `?auto=format&fit=crop&w=400&q=60&sig=${i}`,
      category: ["general", "demo"][i % 2],
      tags: ["demo", "seed", "mercadito-xbar"],
      sellerId: demoUid,
      vendorSlug,
      status: "active", // el home suele filtrar por activos
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

  console.log("✅ Seed completado: vendor + 12 productos nuevos.");
}

main().catch((e) => {
  console.error("❌ Error en seed:", e);
  process.exit(1);
});
