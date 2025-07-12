import cron from "node-cron";
import { adminFirestore } from "../config/firebase-admin.js";

const isOlderThan30Days = (timestamp) => {
  if (!timestamp?.toDate) return false;

  const createdAtMillis = timestamp.toDate().getTime();
  const nowMillis = Date.now();
  const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;

  return nowMillis - createdAtMillis > thirtyDaysInMillis;
};

const deleteStaleCompanyOauthTokens = async () => {
  console.log("Cron job started: Checking for stale company tokens...");

  try {
    const snapshot = await adminFirestore
      .collection("companyAccessTokens")
      .get();

    if (snapshot.empty) {
      console.log("No tokens found.");
      return;
    }

    let deletedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const { createdAt } = data;

      if (isOlderThan30Days(createdAt)) {
        await doc.ref.delete();
        console.log(`Deleted stale token for companyId: ${doc.id}`);
        deletedCount++;
      }
    }

    if (deletedCount === 0) {
      console.log("No company has tokens >= 30 days.");
    } else {
      console.log(
        `Cron job completed. Deleted ${deletedCount} expired tokens.`
      );
    }
  } catch (error) {
    console.error("Error during cron job:", error.message);
  }
};

const startCompanyCleanupCronJob = () => {
  cron.schedule("13 12 * * *", deleteStaleCompanyOauthTokens, {
    timezone: "Asia/Shanghai",
    name: "token-cleanup",
  });
  console.log(
    "Job initiated: Scheduled to run daily at 12:13 PM Asia/Shanghai time"
  );
};

export { startCompanyCleanupCronJob };
