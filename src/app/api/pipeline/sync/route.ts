import { NextResponse } from "next/server";
import { DailyIngestionScheduler } from "@/lib/pipeline/scheduler";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const latestReport = db.getLatestDailySyncReport();
  const jobs = db.getIngestionJobs(5);
  const status = DailyIngestionScheduler.getRunningStatus();

  return NextResponse.json({
    status: "ok",
    runnerStatus: status,
    latestReport,
    recentJobs: jobs,
    totalQuestions: db.getQuestions({ validationStatus: "approved" }).length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const triggerType = body.triggerType || "manual_admin";

    const result = await DailyIngestionScheduler.runSynchronization(triggerType);

    return NextResponse.json({
      success: true,
      message: "Daily synchronization executed successfully.",
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to execute daily synchronization.",
      },
      { status: 500 }
    );
  }
}
