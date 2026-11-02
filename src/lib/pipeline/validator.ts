/**
 * MISSION MPSO — Multi-Layer Answer Validation Engine
 * Implements Layer 1 (Structural), Layer 2 (Mathematical Deterministic),
 * Layer 3 (Factual), and Layer 4 (Semantic) verification.
 */

import { QuestionCandidate, QuestionValidationRecord, ValidationLayer } from "@/types/pipeline";
import { QuestionOptionId } from "@/types/question";
import { StatisticsValidator } from "../numerical/statistics-validator";

export interface ValidationOutput {
  passed: boolean;
  status: "verified" | "review_required" | "validation_failed";
  records: QuestionValidationRecord[];
  failureReasons: string[];
}

export class QuestionValidationEngine {
  /**
   * Run full multi-layer validation pipeline on a question candidate.
   */
  static validate(candidate: QuestionCandidate): ValidationOutput {
    const records: QuestionValidationRecord[] = [];
    const failureReasons: string[] = [];

    // --- Layer 1: Structural Validation ---
    const structural = this.validateStructural(candidate);
    records.push(structural.record);
    if (!structural.passed) {
      failureReasons.push(...structural.errors);
    }

    // --- Layer 2: Mathematical Validation (Paper 2 & Numerical MCQs) ---
    const isNumerical = candidate.paperId === "paper_2" || candidate.numericalMetadata?.isNumerical;
    let mathValidationPassed = true;
    if (isNumerical) {
      const math = this.validateMathematical(candidate);
      records.push(math.record);
      if (!math.passed) {
        mathValidationPassed = false;
        failureReasons.push(...math.errors);
      }
    }

    // --- Layer 3: Factual Validation (Paper 1 & Sourced Claims) ---
    if (candidate.paperId === "paper_1") {
      const factual = this.validateFactual(candidate);
      records.push(factual.record);
      if (!factual.passed) {
        failureReasons.push(...factual.errors);
      }
    }

    // --- Layer 4: Semantic Validation ---
    const semantic = this.validateSemantic(candidate);
    records.push(semantic.record);
    if (!semantic.passed) {
      failureReasons.push(...semantic.errors);
    }

    // Determine final status
    const allPassed = failureReasons.length === 0;
    let finalStatus: "verified" | "review_required" | "validation_failed" = "verified";

    if (!allPassed) {
      // If mathematical mismatch or structural corruption occurred, validation fails
      const hasHardFailure = failureReasons.some((r) => r.includes("Mathematical ground truth mismatch") || r.includes("Duplicate option") || r.includes("Missing"));
      finalStatus = hasHardFailure ? "validation_failed" : "review_required";
    }

    return {
      passed: allPassed,
      status: finalStatus,
      records,
      failureReasons,
    };
  }

  /**
   * Layer 1: Structural Integrity Verification
   */
  private static validateStructural(candidate: QuestionCandidate): {
    passed: boolean;
    record: QuestionValidationRecord;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!candidate.questionTextTe || candidate.questionTextTe.trim().length === 0) {
      errors.push("Missing Telugu question text.");
    }
    if (!candidate.questionTextEn || candidate.questionTextEn.trim().length === 0) {
      errors.push("Missing English question text.");
    }
    if (!candidate.options || candidate.options.length !== 4) {
      errors.push(`Expected exactly 4 options, found ${candidate.options?.length || 0}.`);
    } else {
      // Check for distinct options
      const texts = candidate.options.map((o) => o.textEn.trim().toLowerCase());
      const unique = new Set(texts);
      if (unique.size < 4) {
        errors.push("Duplicate option texts detected across options.");
      }
    }

    const validIds: QuestionOptionId[] = ["A", "B", "C", "D"];
    if (!validIds.includes(candidate.correctOptionId)) {
      errors.push(`Invalid correct option ID: ${candidate.correctOptionId}`);
    }

    if (!candidate.explanationTe || candidate.explanationTe.trim().length === 0) {
      errors.push("Missing Telugu explanation.");
    }

    const passed = errors.length === 0;
    return {
      passed,
      record: {
        id: `val_struct_${candidate.id}`,
        questionId: candidate.id,
        layer: "structural",
        passed,
        validatorName: "StructuralSchemaValidator",
        timestamp: new Date().toISOString(),
        details: { optionCount: candidate.options?.length, correctOptionId: candidate.correctOptionId },
        errorMessage: passed ? undefined : errors.join("; "),
      },
      errors,
    };
  }

  /**
   * Layer 2: Deterministic Mathematical Verification (StatisticsValidator)
   */
  private static validateMathematical(candidate: QuestionCandidate): {
    passed: boolean;
    record: QuestionValidationRecord;
    errors: string[];
  } {
    const errors: string[] = [];
    const fullText = `${candidate.questionTextEn} ${candidate.relevantFormulaLatex || ""}`;

    // Extract numbers from the question to see if we can calculate ground truth
    const correctOpt = candidate.options.find((o) => o.id === candidate.correctOptionId);
    const correctValStr = correctOpt ? correctOpt.textEn.trim() : "";
    const parsedOptionNum = parseFloat(correctValStr.replace(/[^0-9\.\-]/g, ""));

    let calculatedGroundTruth: number | null = null;
    let formulaIdentified = "None";

    // 1. Arithmetic Mean check: "mean of [10, 20, 30, 40 and 50]..."
    const meanMatch = fullText.match(/(?:mean|average)\s+(?:of\s+)?([0-9\s\,\.and]+?)(?:\?|\.|$|\;|\=|\s+is)/i);
    if (meanMatch) {
      const nums = meanMatch[1]
        .replace(/\band\b/gi, " ")
        .split(/[\,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (nums.length >= 2) {
        calculatedGroundTruth = StatisticsValidator.mean(nums);
        formulaIdentified = "ArithmeticMean";
      }
    }

    // 2. Empirical Mode check: "Mode = 3*Median - 2*Mean"
    const empModeMatch = fullText.match(/mean\s*(?:is|=)\s*([0-9\.]+).*median\s*(?:is|=)\s*([0-9\.]+)/i);
    if (empModeMatch && /mode/i.test(fullText)) {
      const meanVal = parseFloat(empModeMatch[1]);
      const medVal = parseFloat(empModeMatch[2]);
      calculatedGroundTruth = StatisticsValidator.empiricalMode(meanVal, medVal);
      formulaIdentified = "EmpiricalMode";
    }

    // 3. Binomial Distribution: n trials, p success
    const binomMatch = fullText.match(/n\s*=\s*(\d+).*p\s*=\s*([0-9\.]+).*x\s*=\s*(\d+)/i);
    if (binomMatch) {
      const n = parseInt(binomMatch[1], 10);
      const p = parseFloat(binomMatch[2]);
      const k = parseInt(binomMatch[3], 10);
      calculatedGroundTruth = StatisticsValidator.binomialProbability(n, k, p);
      formulaIdentified = "BinomialProbability";
    }

    // 4. Coefficient of Variation (CV = (SD / Mean) * 100)
    const cvMatch = fullText.match(/standard deviation\s*(?:is|=)\s*([0-9\.]+).*mean\s*(?:is|=)\s*([0-9\.]+)/i);
    if (cvMatch && /coefficient of variation|cv/i.test(fullText)) {
      const sd = parseFloat(cvMatch[1]);
      const mean = parseFloat(cvMatch[2]);
      if (mean !== 0) {
        calculatedGroundTruth = (sd / mean) * 100;
        formulaIdentified = "CoefficientOfVariation";
      }
    }

    // 5. Binary to Decimal / Decimal to Binary conversion
    const binMatch = fullText.match(/binary\s*(?:number)?\s*([01]+)\s*(?:in|to)?\s*decimal/i);
    if (binMatch) {
      calculatedGroundTruth = parseInt(binMatch[1], 2);
      formulaIdentified = "BinaryToDecimal";
    }

    // Verify calculated ground truth against marked option
    if (calculatedGroundTruth !== null && !isNaN(parsedOptionNum)) {
      const tolerance = 0.05;
      const diff = Math.abs(calculatedGroundTruth - parsedOptionNum);
      if (diff > tolerance) {
        errors.push(
          `Mathematical ground truth mismatch (${formulaIdentified}): calculated ${calculatedGroundTruth}, marked option ${candidate.correctOptionId} has ${parsedOptionNum}.`
        );
      }
    }

    const passed = errors.length === 0;
    return {
      passed,
      record: {
        id: `val_math_${candidate.id}`,
        questionId: candidate.id,
        layer: "mathematical",
        passed,
        validatorName: "DeterministicStatisticsValidator",
        timestamp: new Date().toISOString(),
        details: {
          formulaIdentified,
          calculatedGroundTruth,
          parsedOptionNum,
          toleranceApplied: 0.05,
        },
        errorMessage: passed ? undefined : errors.join("; "),
      },
      errors,
    };
  }

  /**
   * Layer 3: Factual and Temporal Validation (General Studies)
   */
  private static validateFactual(candidate: QuestionCandidate): {
    passed: boolean;
    record: QuestionValidationRecord;
    errors: string[];
  } {
    const errors: string[] = [];
    const text = `${candidate.questionTextEn} ${candidate.explanationEn || ""}`;

    // Outdated facts check
    if (/as of 2014|planning commission of india/i.test(text) && !/historical|former|replaced/i.test(text)) {
      errors.push("Potentially outdated institution reference (Planning Commission without NITI Aayog context).");
    }

    const passed = errors.length === 0;
    return {
      passed,
      record: {
        id: `val_fact_${candidate.id}`,
        questionId: candidate.id,
        layer: "factual",
        passed,
        validatorName: "FactualEvidenceValidator",
        timestamp: new Date().toISOString(),
        details: { paper: candidate.paperId, topic: candidate.topicId },
        errorMessage: passed ? undefined : errors.join("; "),
      },
      errors,
    };
  }

  /**
   * Layer 4: Semantic and Distractor Quality Validation
   */
  private static validateSemantic(candidate: QuestionCandidate): {
    passed: boolean;
    record: QuestionValidationRecord;
    errors: string[];
  } {
    const errors: string[] = [];

    // Avoid all "None of the above" or "All of the above" when trivial
    const trivialOpts = candidate.options.filter((o) => /all of the above|none of the above|పైవన్నీ|పైవేవీ కావు/i.test(o.textEn));
    if (trivialOpts.length > 2) {
      errors.push("Excessive meta-options (All/None of the above) detected.");
    }

    const passed = errors.length === 0;
    return {
      passed,
      record: {
        id: `val_sem_${candidate.id}`,
        questionId: candidate.id,
        layer: "semantic",
        passed,
        validatorName: "SemanticDistractorValidator",
        timestamp: new Date().toISOString(),
        details: { trivialOptionCount: trivialOpts.length },
        errorMessage: passed ? undefined : errors.join("; "),
      },
      errors,
    };
  }
}
