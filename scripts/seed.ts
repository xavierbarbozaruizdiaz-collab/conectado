// scripts/seed.ts
import * as admin from "firebase-admin";

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

  const cred = admin.credential.cert(JSON.parse(sa));
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: cred, projectId });
  }
  const db = admin.firestore();

  const demoUid = "demo-seller-uid";
  const vendorSlug = "demo-tienda";
  await db.collection("vendors").doc(demoUid).set(
    {
      displayName: "Demo Tienda",
      slug: vendorSlug,
      logoUrl: "https://dummyimage.com/128x128/000/fff&text=MX",
      bannerUrl: "https://dummyimage.com/1200x300/eee/333&text=Mercadito+Xbar",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const batch = db.batch();
  for (let i = 0; i < 12; i++) {
    const ref = db.collection("products").doc();
    batch.set(ref, {
      title: `Producto demo ${i + 1}`,
      description: "Producto de demostración cargado por UCRA.",
      price: Number((Math.random() * 100).toFixed(2)),
      images: [
        SAMPLE_IMAGES[i % SAMPLE_IMAGES.length] +
          `?auto=format&fit=crop&w=900&q=60&sig=${i}`,
      ],
      sellerId: demoUid,
      vendorSlug,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

  console.log("✅ Seed completado: vendor + 12 productos.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
