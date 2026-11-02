import { NextResponse } from "next/server";
import { SyllabusCoverageEngine } from "@/lib/pipeline/coverage-engine";
import { QuestionGeneratorService } from "@/lib/pipeline/question-generator";
import { QuestionValidationEngine } from "@/lib/pipeline/validator";
import { TeluguTranslationService } from "@/lib/pipeline/translator";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const topicId = body.topicId;
    const count = body.count || 2;

    const targetTopicIds = topicId
      ? [topicId]
      : SyllabusCoverageEngine.analyzeGaps().topPriorityTopicsForGeneration.slice(0, 3);

    const generatedCandidates = [];
    let publishedCount = 0;

    for (const tid of targetTopicIds) {
      const candidates = QuestionGeneratorService.generateForTopic({
        topicId: tid,
        count,
        jobId: "job_coverage_fill",
      });

      for (const cand of candidates) {
        // Translation & Validation
        const trans = TeluguTranslationService.translateCandidate(cand);
        cand.questionTextTe = trans.translatedTe;
        cand.explanationTe = trans.explanationTe;
        cand.options = trans.optionsTe;

        const val = QuestionValidationEngine.validate(cand);
        if (val.passed) {
          cand.validationStatus = "verified";
          db.saveQuestionCandidate(cand);
          const pub = db.publishCandidate(cand.id, "CoverageGapFiller");
          if (pub) publishedCount++;
        } else {
          cand.validationStatus = "review_required";
          db.saveQuestionCandidate(cand);
        }
        generatedCandidates.push(cand);
      }
    }

    SyllabusCoverageEngine.refreshCoverage();

    return NextResponse.json({
      success: true,
      publishedCount,
      generatedCount: generatedCandidates.length,
      topicsCovered: targetTopicIds,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
