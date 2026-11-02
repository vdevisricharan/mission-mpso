/**
 * MISSION MPSO — Autonomous Daily Question Discovery & Synchronization CLI Runner
 * Runs the complete ingestion and validation cycle from terminal, cron, or background workers.
 *
 * Usage:
 *   npx tsx scripts/run-daily-sync.ts
 */

import { DailyIngestionScheduler } from "../src/lib/pipeline/scheduler";

async function main() {
  console.log("=================================================================");
  console.log("MISSION MPSO — Question Intelligence & Daily Sync Engine");
  console.log("Exam: TGPSC MPSO / ASO (Notification 07/G/ES/2026)");
  console.log("Execution Time:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), "IST");
  console.log("=================================================================\n");

  try {
    const result = await DailyIngestionScheduler.runSynchronization("manual_admin");
    console.log("✓ Daily Synchronization Completed Successfully!");
    console.log(`- Job ID: ${result.jobId}`);
    console.log(`- Duration: ${result.durationSeconds}s`);
    console.log(`- Sources Checked: ${result.report.sourcesCheckedCount}`);
    console.log(`- Candidates Extracted: ${result.report.newCandidatesCount}`);
    console.log(`- Verified Questions: ${result.report.verifiedCount}`);
    console.log(`- Published to Question Bank: ${result.report.publishedCount}`);
    console.log(`- Held for Review: ${result.report.reviewRequiredCount}`);
    console.log(`- Duplicates Prevented: ${result.report.duplicatesDetectedCount}`);
    console.log("\nSummary Report:");
    console.log(JSON.stringify(result.report, null, 2));
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Daily Synchronization Failed:", err.message);
    process.exit(1);
  }
}

main();
