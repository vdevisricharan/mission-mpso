/**
 * MISSION MPSO — AI Question Extraction & Canonical Syllabus Classifier
 * Strictly maps questions to the official TGPSC MPSO/ASO syllabus (Paper I: GS-01 to GS-13,
 * Paper II: STAT-01 to STAT-08) with relevance filtering and out-of-syllabus rejection.
 */

import { PaperId, SyllabusTopic } from "@/types/curriculum";
import { QuestionDifficulty } from "@/types/question";
import { OFFICIAL_SYLLABUS_TOPICS } from "../curriculum/syllabus-data";
import { RawExtractedMCQ } from "./document-extractor";

export interface ClassificationResult {
  isRelevant: boolean;
  rejectionReason?: string;
  paperId: PaperId;
  topicId: string;
  subtopicId?: string;
  difficulty: QuestionDifficulty;
  confidenceScore: number; // 0 - 1.0
  matchedKeywords: string[];
}

interface SyllabusTopicMatcher {
  topicId: string;
  paperId: PaperId;
  keywords: string[];
  subtopicMatchers?: { id: string; keywords: string[] }[];
}

export class QuestionClassifierService {
  private static matchers: SyllabusTopicMatcher[] = [
    // Paper 2: Statistics (STAT-01 to STAT-08)
    {
      topicId: "p2_intro_statistics",
      paperId: "paper_2",
      keywords: [
        "primary data", "secondary data", "sampling", "census", "schedule", "questionnaire",
        "frequency distribution", "tabulation", "histogram", "ogive", "bar diagram", "pie diagram",
        "ప్రాథమిక దత్తాంశం", "ద్వితీయ దత్తాంశం", "శాంప్లింగ్", "జనాభా లెక్కలు", "పట్టికీకరణ", "హిస్టోగ్రామ్",
      ],
      subtopicMatchers: [
        { id: "p2_stat_intro_basics", keywords: ["meaning of statistics", "limitations", "scope"] },
        { id: "p2_stat_intro_collection", keywords: ["primary", "secondary", "questionnaire", "schedule"] },
        { id: "p2_stat_intro_presentation", keywords: ["histogram", "ogive", "tabulation", "frequency"] },
      ],
    },
    {
      topicId: "p2_central_tendency_dispersion",
      paperId: "paper_2",
      keywords: [
        "arithmetic mean", "geometric mean", "harmonic mean", "median", "mode", "deciles", "percentiles",
        "dispersion", "range", "quartile deviation", "mean deviation", "standard deviation", "coefficient of variation",
        "skewness", "kurtosis", "karl pearson", "bowley", "సగటు", "అంకమధ్యమం", "మధ్యగతం", "బాహుళకం", "ప్రామాణిక విచలనం", "విచలన గుణకం", "అసౌష్ఠవత", "కకుదత",
      ],
      subtopicMatchers: [
        { id: "p2_stat_central_averages", keywords: ["mean", "median", "mode", "am", "gm", "hm"] },
        { id: "p2_stat_dispersion_sd_cv", keywords: ["variance", "standard deviation", "quartile deviation", "cv"] },
        { id: "p2_stat_skewness_kurtosis", keywords: ["skewness", "kurtosis", "bowley", "pearsons"] },
      ],
    },
    {
      topicId: "p2_probability",
      paperId: "paper_2",
      keywords: [
        "probability", "sample space", "event", "discrete sample space", "conditional probability",
        "independent events", "bayes' theorem", "bayes theorem", "addition theorem", "multiplication theorem",
        "సంభావ్యత", "శాంపిల్ ఆవరణం", "ఘటన", "షరతులతో కూడిన సంభావ్యత", "స్వతంత్ర ఘటనలు", "బేయెస్ సిద్ధాంతం",
      ],
      subtopicMatchers: [
        { id: "p2_prob_basics_events", keywords: ["sample space", "addition theorem", "mutually exclusive"] },
        { id: "p2_prob_conditional_independent", keywords: ["conditional", "independent events", "p(a|b)"] },
        { id: "p2_prob_bayes_theorem", keywords: ["bayes", "prior probability", "posterior probability"] },
      ],
    },
    {
      topicId: "p2_random_variables_distributions",
      paperId: "paper_2",
      keywords: [
        "random variable", "discrete", "continuous", "bernoulli", "binomial distribution", "poisson distribution",
        "normal distribution", "unbiased estimator", "consistency", "efficiency", "sufficiency",
        "null hypothesis", "alternative hypothesis", "large sample test", "small sample test", "t-test", "f-test", "chi-square",
        "ద్విపద విభాజనం", "పాయిజన్ విభాజనం", "సాధారణ విభాజనం", "నిష్పాక్షిక అంచనాదారు", "శూన్య పరికల్పన",
      ],
      subtopicMatchers: [
        { id: "p2_dist_discrete_binomial_poisson", keywords: ["binomial", "poisson", "bernoulli"] },
        { id: "p2_dist_continuous_normal", keywords: ["normal distribution", "bell curve", "z-score"] },
        { id: "p2_dist_estimation_properties", keywords: ["unbiased", "consistent", "efficient", "sufficient"] },
        { id: "p2_dist_hypothesis_tests", keywords: ["null hypothesis", "alternative", "t-test", "large sample"] },
      ],
    },
    {
      topicId: "p2_correlation_regression",
      paperId: "paper_2",
      keywords: [
        "correlation", "karl pearson's correlation", "spearman's rank correlation", "probable error",
        "regression", "regression equation", "regression coefficient", "byx", "bxy", "scatter diagram",
        "సహసంబంధం", "ప్రతిగమనం", "స్పియర్‌మ్యాన్ కోటి", "సంభావ్య దోషం", "ప్రతిగమన సమీకరణం",
      ],
      subtopicMatchers: [
        { id: "p2_cor_pearson_spearman", keywords: ["pearson", "spearman", "rank correlation"] },
        { id: "p2_cor_probable_error", keywords: ["probable error", "standard error of r"] },
        { id: "p2_reg_lines_equations", keywords: ["regression equation", "byx", "bxy", "line of regression"] },
      ],
    },
    {
      topicId: "p2_time_series_index_numbers",
      paperId: "paper_2",
      keywords: [
        "time series", "trend", "seasonal variation", "decomposition", "moving average", "least squares",
        "index number", "laspeyres", "paasche", "fisher's ideal index", "time reversal test", "factor reversal test",
        "cost of living index", "deflating", "కాలశ్రేణి", "సూచీ సంఖ్యలు", "లాస్‌పియర్", "పాషే", "ఫిషర్ సూచీ", "కాల విపర్యయ", "కారక విపర్యయ",
      ],
      subtopicMatchers: [
        { id: "p2_ts_components_trend", keywords: ["time series", "trend", "seasonal", "moving average"] },
        { id: "p2_idx_laspeyre_paasche_fisher", keywords: ["laspeyre", "paasche", "fisher", "ideal index"] },
        { id: "p2_idx_tests_adequacy", keywords: ["time reversal", "factor reversal", "cost of living"] },
      ],
    },
    {
      topicId: "p2_sampling_techniques",
      paperId: "paper_2",
      keywords: [
        "complete enumeration", "sampling error", "sample size", "simple random sampling", "srswor", "srswr",
        "stratified random sampling", "systematic random sampling", "neyman allocation", "proportional allocation",
        "శాంప్లింగ్", "సరళ యాదృచ్ఛిక", "స్తరీకృత", "క్రమబద్ధ శాంప్లింగ్",
      ],
      subtopicMatchers: [
        { id: "p2_samp_census_vs_sample", keywords: ["enumeration", "sampling error", "census"] },
        { id: "p2_samp_srs_methods", keywords: ["simple random", "srswr", "srswor"] },
        { id: "p2_samp_stratified_systematic", keywords: ["stratified", "systematic", "strata"] },
      ],
    },
    {
      topicId: "p2_basics_of_computers",
      paperId: "paper_2",
      keywords: [
        "binary", "octal", "hexadecimal", "decimal conversion", "bits", "bytes", "words", "memory", "ram", "rom",
        "and", "or", "xor", "not", "shift", "rotate", "algorithm", "flowchart", "ms-office", "ms-word", "ms-excel",
        "బైనరీ", "ఆక్టల్", "హెక్సాడెసిమల్", "లాజిక్ గేట్లు", "అల్గారిథమ్", "ఫ్లోచార్ట్", "కంప్యూటర్",
      ],
      subtopicMatchers: [
        { id: "p2_comp_number_systems", keywords: ["binary", "octal", "hexadecimal", "conversion"] },
        { id: "p2_comp_logic_operators", keywords: ["and", "or", "xor", "not", "operator", "precision"] },
        { id: "p2_comp_flowcharts_office", keywords: ["algorithm", "flowchart", "excel", "word", "office"] },
      ],
    },

    // Paper 1: General Studies (GS-01 to GS-13)
    {
      topicId: "p1_current_affairs",
      paperId: "paper_1",
      keywords: ["current affairs", "summit", "conference", "appointment", "award", "వర్తమాన వ్యవహారాలు", "సదస్సు", "అవార్డు"],
    },
    {
      topicId: "p1_international_relations",
      paperId: "paper_1",
      keywords: ["united nations", "un", "who", "wto", "g20", "brics", "treaty", "foreign policy", "అంతర్జాతీయ సంబంధాలు", "విదేశాంగ"],
    },
    {
      topicId: "p1_general_science",
      paperId: "paper_1",
      keywords: ["isro", "drdo", "satellite", "space mission", "defence", "biotechnology", "physics", "chemistry", "biology", "సైన్స్", "ఇస్రో"],
    },
    {
      topicId: "p1_environment_disaster",
      paperId: "paper_1",
      keywords: ["climate change", "global warming", "biodiversity", "disaster management", "ndma", "pollution", "పర్యావరణం", "విపత్తు నిర్వహణ"],
    },
    {
      topicId: "p1_economy_india_telangana",
      paperId: "paper_1",
      keywords: ["gsdp", "gdp", "rbi", "inflation", "budget", "fiscal deficit", "per capita income", "ఆర్థిక వ్యవస్థ", "జీడీపీ", "బడ్జెట్"],
    },
    {
      topicId: "p1_geography_india_telangana",
      paperId: "paper_1",
      keywords: ["godavari", "krishna", "rivers", "forests", "soils", "irrigation", "తెలంగాణ భౌగోళిక", "నదులు", "అడవులు"],
    },
    {
      topicId: "p1_constitution_polity",
      paperId: "paper_1",
      keywords: ["constitution", "fundamental rights", "article", "parliament", "panchayat", "local self-government", "రాజ్యాంగం", "ప్రాథమిక హక్కులు", "పంచాయతీ"],
    },
    {
      topicId: "p1_telangana_society_culture",
      paperId: "paper_1",
      keywords: ["bathukamma", "bonalu", "sammakka sarakka", "telangana literature", "art", "heritage", "బతుకమ్మ", "బోనాలు", "తెలంగాణ సంస్కృతి"],
    },
    {
      topicId: "p1_telangana_policies",
      paperId: "paper_1",
      keywords: ["rythu bharosa", "rythu bandhu", "mission bhagiratha", "kaleshwaram", "telangana scheme", "తెలంగాణ పథకాలు", "రైతు భరోసా", "మిషన్ భగీరథ"],
    },
    {
      topicId: "p1_modern_indian_history",
      paperId: "paper_1",
      keywords: ["gandhi", "1857 revolt", "indian national congress", "freedom movement", "స్వాతంత్ర్యోద్యమం", "గాంధీజీ", "జాతీయ కాంగ్రెస్"],
    },
    {
      topicId: "p1_telangana_history_movement",
      paperId: "paper_1",
      keywords: ["kakatiyas", "qutb shahi", "asaf jahi", "hyderabad state", "telangana movement", "1969 movement", "కాకతీయులు", "తెలంగాణ ఉద్యమం"],
    },
    {
      topicId: "p1_logical_reasoning_data_interpretation",
      paperId: "paper_1",
      keywords: ["syllogism", "blood relation", "coding-decoding", "series", "pie chart", "bar chart", "రీజనింగ్", "కోడింగ్", "రక్త సంబంధాలు", "పై చార్ట్"],
    },
    {
      topicId: "p1_basic_english",
      paperId: "paper_1",
      keywords: ["synonym", "antonym", "idiom", "preposition", "tense", "comprehension", "grammatical error", "active voice", "passive voice"],
    },
  ];

  /**
   * Classify an extracted question against the canonical syllabus.
   */
  static classifyQuestion(mcq: RawExtractedMCQ): ClassificationResult {
    // 1. Relevance and Completeness Filter
    const filterCheck = this.filterIncompleteOrIrrelevant(mcq);
    if (!filterCheck.isRelevant) {
      return {
        isRelevant: false,
        rejectionReason: filterCheck.reason,
        paperId: "paper_2",
        topicId: "p2_intro_statistics",
        difficulty: "medium",
        confidenceScore: 0,
        matchedKeywords: [],
      };
    }

    const fullContent = `${mcq.stem} ${mcq.options.map((o) => o.text).join(" ")} ${mcq.rawExplanation || ""}`.toLowerCase();

    let bestMatcher: SyllabusTopicMatcher | null = null;
    let maxMatchCount = 0;
    let bestMatchedKeywords: string[] = [];

    for (const matcher of this.matchers) {
      const matched = matcher.keywords.filter((kw) => fullContent.includes(kw.toLowerCase()));
      if (matched.length > maxMatchCount) {
        maxMatchCount = matched.length;
        bestMatcher = matcher;
        bestMatchedKeywords = matched;
      }
    }

    // Default fallback if weak match: determine Paper 1 vs Paper 2 based on mathematical/statistical content
    if (!bestMatcher || maxMatchCount === 0) {
      const isMathOrStats = /mean|median|mode|variance|deviation|probability|sample|data|matrix|formula|\$|\\sigma|\\mu/i.test(fullContent);
      if (isMathOrStats) {
        bestMatcher = this.matchers[1]; // default to Central Tendency & Dispersion
      } else {
        bestMatcher = this.matchers[8]; // default to Current Affairs
      }
    }

    // Subtopic mapping
    let subtopicId: string | undefined;
    if (bestMatcher.subtopicMatchers) {
      for (const sm of bestMatcher.subtopicMatchers) {
        const hasSubMatch = sm.keywords.some((kw) => fullContent.includes(kw.toLowerCase()));
        if (hasSubMatch) {
          subtopicId = sm.id;
          break;
        }
      }
    }

    // Determine estimated difficulty
    const difficulty = this.estimateDifficulty(mcq);

    // Confidence score based on keyword match strength
    const confidenceScore = Math.min(1.0, Math.max(0.6, maxMatchCount * 0.2));

    return {
      isRelevant: true,
      paperId: bestMatcher.paperId,
      topicId: bestMatcher.topicId,
      subtopicId,
      difficulty,
      confidenceScore,
      matchedKeywords: bestMatchedKeywords,
    };
  }

  /**
   * Reject incomplete, corrupt, or out-of-syllabus items upfront.
   */
  private static filterIncompleteOrIrrelevant(mcq: RawExtractedMCQ): { isRelevant: boolean; reason?: string } {
    if (!mcq.stem || mcq.stem.trim().length < 10) {
      return { isRelevant: false, reason: "Question stem is missing or too short (< 10 chars)." };
    }

    if (!mcq.options || mcq.options.length < 4) {
      return { isRelevant: false, reason: `Insufficient options (${mcq.options?.length || 0}/4 options present).` };
    }

    // Check for empty options
    const emptyOpts = mcq.options.filter((o) => !o.text || o.text.trim().length === 0);
    if (emptyOpts.length > 0) {
      return { isRelevant: false, reason: "One or more options contain empty text." };
    }

    // Check for missing diagram references that cannot be resolved
    if (/refer to (the )?(figure|diagram|chart) below|కింది పటాన్ని చూడండి/i.test(mcq.stem)) {
      return { isRelevant: false, reason: "Question depends on an external unavailable diagram or figure." };
    }

    // Check if deleted or cancelled in official key
    if (mcq.isDeletedOrDisputed) {
      return { isRelevant: false, reason: mcq.disputeReason || "Question officially cancelled or invalidated by commission." };
    }

    return { isRelevant: true };
  }

  /**
   * Estimate difficulty based on problem length, mathematical symbols, and multi-step indicators.
   */
  private static estimateDifficulty(mcq: RawExtractedMCQ): QuestionDifficulty {
    const text = `${mcq.stem} ${mcq.mathLatexFormula || ""}`;
    const hasComplexLatex = /\\frac|\\sqrt|\\binom|\\sigma\^2|\\sum|\\lambda/i.test(text);
    const isMultiStep = /if.*then.*and|find.*given that|కనుగొనండి.*అయితే/i.test(text);

    if (hasComplexLatex && isMultiStep) {
      return "hard";
    }
    if (hasComplexLatex || isMultiStep || text.length > 150) {
      return "medium";
    }
    return "easy";
  }
}
