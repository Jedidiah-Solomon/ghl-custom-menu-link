import admin from "firebase-admin";

import serviceAccount from "./serviceAccount.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL, // Real-time DB URL
  storageBucket: process.env.STORAGE_BUCKET, // Storage URL
  firestore: {
    ignoreUndefinedProperties: true,
  },
});

// Define Firebase Admin services
const adminFirestore = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

// Export all Firebase Admin services
export { adminFirestore, adminAuth, adminStorage };
