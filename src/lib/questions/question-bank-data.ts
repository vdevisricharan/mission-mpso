import { Question } from "@/types/question";

export const VERIFIED_QUESTION_BANK: Question[] = [
  // =========================================================================
  // PAPER II: STATISTICS DEGREE LEVEL QUESTIONS
  // =========================================================================
  {
    id: "q_p2_001",
    paperId: "paper_2",
    topicId: "p2_central_tendency_dispersion",
    subtopicId: "p2_stat_central_averages",
    questionNumber: 1,
    questionTextTe:
      "మితమైన అసౌష్ఠవ పౌనఃపున్య విభాజనంలో (Moderately skewed distribution) అంకమధ్యమం 30 మరియు మధ్యగతం 32 అయితే, బాహుళకం (Mode) విలువ ఎంత?",
    questionTextEn:
      "In a moderately skewed distribution, if the Mean is 30 and the Median is 32, what is the value of the Mode?",
    options: [
      { id: "A", textTe: "34", textEn: "34" },
      { id: "B", textTe: "36", textEn: "36" },
      { id: "C", textTe: "31", textEn: "31" },
      { id: "D", textTe: "28", textEn: "28" },
    ],
    correctOptionId: "B",
    explanationTe:
      "ఆనుభావిక సూత్రం ప్రకారం: Mode = 3(Median) - 2(Mean). ఇచ్చట Median = 32 మరియు Mean = 30. కావున Mode = 3(32) - 2(30) = 96 - 60 = 36.",
    explanationEn:
      "Using the empirical relationship: Mode = 3(Median) - 2(Mean) = 3(32) - 2(30) = 96 - 60 = 36.",
    relevantFormulaLatex: "\\text{Mode} = 3(\\text{Median}) - 2(\\text{Mean})",
    difficulty: "easy",
    estimatedSolveSeconds: 45,
    sourceType: "standard_degree_textbook",
    sourceReference: "Degree Statistics Paper II - Central Tendency",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "Mode = 3*Median - 2*Mean",
      calculatedValue: 36,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_002",
    paperId: "paper_2",
    topicId: "p2_central_tendency_dispersion",
    subtopicId: "p2_stat_central_averages",
    questionNumber: 2,
    questionTextTe:
      "ఒక దత్తాంశంలో తీవ్ర విలువలు (Extreme Values / Outliers) ఉన్నప్పుడు, కేంద్రీయ ప్రవృత్తిని కొలవడానికి క్రింది వాటిలో అత్యంత అనువైన సగటు ఏది?",
    questionTextEn:
      "Which of the following is the most suitable measure of central tendency when extreme values (outliers) are present in the dataset?",
    options: [
      { id: "A", textTe: "అంకమధ్యమం (Arithmetic Mean)", textEn: "Arithmetic Mean" },
      { id: "B", textTe: "మధ్యగతం (Median)", textEn: "Median" },
      { id: "C", textTe: "గుణమధ్యమం (Geometric Mean)", textEn: "Geometric Mean" },
      { id: "D", textTe: "హరమధ్యమం (Harmonic Mean)", textEn: "Harmonic Mean" },
    ],
    correctOptionId: "B",
    explanationTe:
      "మధ్యగతం (Median) అనేది స్థాన సగటు (Positional average). ఇది పరిశీలనల శ్రేణిలో మధ్య స్థానాన్ని మాత్రమే సూచిస్తుంది కాబట్టి తీవ్ర లేదా విపరీత విలువల (Outliers) ప్రభావానికి గురికాదు. అంకమధ్యమం తీవ్ర విలువల వల్ల తీవ్రంగా ప్రభావితమవుతుంది.",
    explanationEn:
      "Median is a positional average and is not affected by extreme values or outliers, unlike the arithmetic mean which utilizes all observations.",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Degree Statistics - Properties of Averages",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_003",
    paperId: "paper_2",
    topicId: "p2_central_tendency_dispersion",
    subtopicId: "p2_stat_dispersion_sd_cv",
    questionNumber: 3,
    questionTextTe:
      "ఒక పంపిణీ యొక్క అంకమధ్యమం 50 మరియు ప్రామాణిక విచలనం (Standard Deviation) 10 అయితే, దాని విచలన గుణకం (Coefficient of Variation - CV) ఎంత?",
    questionTextEn:
      "If the arithmetic mean of a distribution is 50 and the standard deviation is 10, what is the coefficient of variation (CV)?",
    options: [
      { id: "A", textTe: "5%", textEn: "5%" },
      { id: "B", textTe: "20%", textEn: "20%" },
      { id: "C", textTe: "25%", textEn: "25%" },
      { id: "D", textTe: "50%", textEn: "50%" },
    ],
    correctOptionId: "B",
    explanationTe:
      "విచలన గుణకం సూత్రం: CV = (\\sigma / \\bar{x}) \\times 100. ఇచ్చట \\sigma = 10 మరియు \\bar{x} = 50. కావున CV = (10 / 50) \\times 100 = 0.2 \\times 100 = 20%.",
    explanationEn:
      "Formula: CV = (sigma / mean) * 100 = (10 / 50) * 100 = 20%.",
    relevantFormulaLatex: "CV = \\frac{\\sigma}{\\bar{x}} \\times 100",
    difficulty: "easy",
    estimatedSolveSeconds: 40,
    sourceType: "standard_degree_textbook",
    sourceReference: "Measures of Dispersion - Karl Pearson",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "(10/50)*100",
      calculatedValue: 20,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_004",
    paperId: "paper_2",
    topicId: "p2_central_tendency_dispersion",
    subtopicId: "p2_stat_dispersion_sd_cv",
    questionNumber: 4,
    questionTextTe:
      "ప్రతి పరిశీలన విలువకు స్థిర సంఖ్య 5 ని కూడితే, కొత్త దత్తాంశం యొక్క ప్రామాణిక విచలనం (Standard Deviation) ఏమవుతుంది?",
    questionTextEn:
      "If a constant value of 5 is added to every observation in a dataset, what happens to the standard deviation of the new dataset?",
    options: [
      { id: "A", textTe: "5 పెరుగుతుంది", textEn: "Increases by 5" },
      { id: "B", textTe: "5 తగ్గుతుంది", textEn: "Decreases by 5" },
      { id: "C", textTe: "ఎలాంటి మార్పు ఉండదు (స్థిరంగా ఉంటుంది)", textEn: "Remains unchanged" },
      { id: "D", textTe: "5 రెట్లు అవుతుంది", textEn: "Becomes 5 times" },
    ],
    correctOptionId: "C",
    explanationTe:
      "ప్రామాణిక విచలనం మూల బిందువు మార్పు (Change of Origin) నుండి స్వతంత్రమైనది. అనగా ప్రతి పరిశీలనకు ఒక స్థిర సంఖ్యను కూడినా లేదా తీసివేసినా విస్తరణ (SD) మారదు. కేవలం స్కేలు మారినప్పుడు (గుణకారం లేదా భాగహారం చేసినప్పుడు) మాత్రమే మారుతుంది.",
    explanationEn:
      "Standard deviation is independent of change of origin. Adding or subtracting a constant to all observations does not alter the dispersion.",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Properties of Standard Deviation",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_005",
    paperId: "paper_2",
    topicId: "p2_probability",
    subtopicId: "p2_prob_basics_events",
    questionNumber: 5,
    questionTextTe:
      "రెండు నిష్పాక్షిక నాణేలను ఏకకాలంలో ఎగురవేసినప్పుడు కనీసం ఒక బొమ్మ (At least one Head) పడే సంభావ్యత ఎంత?",
    questionTextEn:
      "When two unbiased coins are tossed simultaneously, what is the probability of getting at least one Head?",
    options: [
      { id: "A", textTe: "1/4", textEn: "1/4" },
      { id: "B", textTe: "1/2", textEn: "1/2" },
      { id: "C", textTe: "3/4", textEn: "3/4" },
      { id: "D", textTe: "1", textEn: "1" },
    ],
    correctOptionId: "C",
    explanationTe:
      "శాంపిల్ ఆవరణం S = {HH, HT, TH, TT}, మొత్తం పర్యవసానాలు n(S) = 4. కనీసం ఒక బొమ్మ పడే అనుకూల పర్యవసానాలు E = {HH, HT, TH}, n(E) = 3. కావున సంభావ్యత P(E) = n(E)/n(S) = 3/4. (లేదా: 1 - P(బొమ్మలు లేకపోవడం) = 1 - 1/4 = 3/4).",
    explanationEn:
      "Sample space S = {HH, HT, TH, TT}, total = 4. Favorable outcomes for at least one head: {HH, HT, TH} = 3. Probability = 3/4.",
    relevantFormulaLatex: "P(\\text{At least one H}) = 1 - P(\\text{No H}) = 1 - \\frac{1}{4} = \\frac{3}{4}",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "standard_degree_textbook",
    sourceReference: "Elementary Probability Theory",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_006",
    paperId: "paper_2",
    topicId: "p2_probability",
    subtopicId: "p2_prob_conditional_independent",
    questionNumber: 6,
    questionTextTe:
      "A మరియు B లు రెండు స్వతంత్ర ఘటనలు (Independent Events) అయి, P(A) = 0.4 మరియు P(B) = 0.5 అయితే, P(A \\cup B) విలువ ఎంత?",
    questionTextEn:
      "If A and B are two independent events with P(A) = 0.4 and P(B) = 0.5, what is the value of P(A U B)?",
    options: [
      { id: "A", textTe: "0.90", textEn: "0.90" },
      { id: "B", textTe: "0.70", textEn: "0.70" },
      { id: "C", textTe: "0.20", textEn: "0.20" },
      { id: "D", textTe: "0.60", textEn: "0.60" },
    ],
    correctOptionId: "B",
    explanationTe:
      "A, B లు స్వతంత్ర ఘటనలు కాబట్టి P(A \\cap B) = P(A) \\times P(B) = 0.4 \\times 0.5 = 0.20. సంకలన సూత్రం ప్రకారం: P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.5 - 0.20 = 0.70.",
    explanationEn:
      "Since A and B are independent, P(A ∩ B) = P(A) * P(B) = 0.4 * 0.5 = 0.20. By addition theorem, P(A ∪ B) = 0.4 + 0.5 - 0.20 = 0.70.",
    relevantFormulaLatex: "P(A \\cup B) = P(A) + P(B) - P(A)P(B)",
    difficulty: "medium",
    estimatedSolveSeconds: 45,
    sourceType: "standard_degree_textbook",
    sourceReference: "Theorems of Probability",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "0.4 + 0.5 - (0.4*0.5)",
      calculatedValue: 0.7,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_007",
    paperId: "paper_2",
    topicId: "p2_random_variables_distributions",
    subtopicId: "p2_dist_discrete_binomial_poisson",
    questionNumber: 7,
    questionTextTe:
      "ఒక ద్విపద విభాజనం (Binomial Distribution) యొక్క అంకమధ్యమం 4 మరియు విస్తృతి (Variance) 3 అయితే, పరామితులు n మరియు p ల విలువలు వరుసగా:",
    questionTextEn:
      "For a Binomial distribution, if the mean is 4 and variance is 3, what are the parameters n and p respectively?",
    options: [
      { id: "A", textTe: "n = 16, p = 1/4", textEn: "n = 16, p = 1/4" },
      { id: "B", textTe: "n = 12, p = 1/3", textEn: "n = 12, p = 1/3" },
      { id: "C", textTe: "n = 16, p = 3/4", textEn: "n = 16, p = 3/4" },
      { id: "D", textTe: "n = 8, p = 1/2", textEn: "n = 8, p = 1/2" },
    ],
    correctOptionId: "A",
    explanationTe:
      "ద్విపద విభాజనంలో Mean = np = 4, Variance = npq = 3. కావున q = Variance / Mean = 3 / 4. విజయ సంభావ్యత p = 1 - q = 1 - 3/4 = 1/4. ఇప్పుడు np = 4 కావున n(1/4) = 4 \\implies n = 16.",
    explanationEn:
      "Mean = np = 4, Variance = npq = 3. Therefore q = 3/4, p = 1 - 3/4 = 1/4. Then n*(1/4) = 4 => n = 16.",
    relevantFormulaLatex: "E(X) = np, \\quad V(X) = npq",
    difficulty: "medium",
    estimatedSolveSeconds: 50,
    sourceType: "standard_degree_textbook",
    sourceReference: "Binomial Distribution Properties",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "q=3/4, p=1/4, n=16",
      calculatedValue: 16,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_008",
    paperId: "paper_2",
    topicId: "p2_random_variables_distributions",
    subtopicId: "p2_dist_discrete_binomial_poisson",
    questionNumber: 8,
    questionTextTe:
      "క్రింది ఏ సంభావ్యతా విభాజనంలో అంకమధ్యమం మరియు విస్తృతి సమానంగా ఉంటాయి?",
    questionTextEn:
      "In which of the following probability distributions are the mean and variance equal?",
    options: [
      { id: "A", textTe: "ద్విపద విభాజనం (Binomial)", textEn: "Binomial Distribution" },
      { id: "B", textTe: "పాయిజన్ విభాజనం (Poisson)", textEn: "Poisson Distribution" },
      { id: "C", textTe: "సాధారణ విభాజనం (Normal)", textEn: "Normal Distribution" },
      { id: "D", textTe: "రేఖాగణిత విభాజనం (Geometric)", textEn: "Geometric Distribution" },
    ],
    correctOptionId: "B",
    explanationTe:
      "పాయిజన్ విభాజనంలో (Poisson Distribution) అంకమధ్యమం E(X) = \\lambda మరియు విస్తృతి V(X) = \\lambda సమానంగా ఉంటాయి. ద్విపద విభాజనంలో విస్తృతి ఎల్లప్పుడూ సగటు కంటే తక్కువగా ఉంటుంది (npq < np).",
    explanationEn:
      "For a Poisson distribution, both the mean and variance are equal to parameter lambda.",
    difficulty: "easy",
    estimatedSolveSeconds: 25,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Theoretical Distributions",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_009",
    paperId: "paper_2",
    topicId: "p2_correlation_regression",
    subtopicId: "p2_reg_lines_equations",
    questionNumber: 9,
    questionTextTe:
      "రెండు ప్రతిగమన గుణకాలు (Regression Coefficients) b_{yx} = 0.8 మరియు b_{xy} = 0.45 అయితే, కార్ల్ పియర్సన్ సహసంబంధ గుణకం (r) విలువ ఎంత?",
    questionTextEn:
      "If the two regression coefficients are byx = 0.8 and bxy = 0.45, what is the value of Karl Pearson's correlation coefficient r?",
    options: [
      { id: "A", textTe: "0.36", textEn: "0.36" },
      { id: "B", textTe: "0.60", textEn: "0.60" },
      { id: "C", textTe: "0.625", textEn: "0.625" },
      { id: "D", textTe: "0.40", textEn: "0.40" },
    ],
    correctOptionId: "B",
    explanationTe:
      "సూత్రం: r = \\pm \\sqrt{b_{yx} \\times b_{xy}}. ఇక్కడ రెండు గుణకాలు ధనాత్మకం కాబట్టి r కూడా ధనాత్మకం. r = \\sqrt{0.8 \\times 0.45} = \\sqrt{0.36} = 0.60.",
    explanationEn:
      "Formula: r = sqrt(byx * bxy) = sqrt(0.8 * 0.45) = sqrt(0.36) = 0.60.",
    relevantFormulaLatex: "r = \\sqrt{b_{yx} \\cdot b_{xy}}",
    difficulty: "medium",
    estimatedSolveSeconds: 40,
    sourceType: "standard_degree_textbook",
    sourceReference: "Correlation and Regression Equations",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "sqrt(0.8 * 0.45)",
      calculatedValue: 0.6,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_010",
    paperId: "paper_2",
    topicId: "p2_correlation_regression",
    subtopicId: "p2_cor_pearson_spearman",
    questionNumber: 10,
    questionTextTe:
      "రెండు చలరాశుల మధ్య సహసంబంధ గుణకం r = 0 అయితే, ఆ రెండు ప్రతిగమన రేఖలు (Regression lines) ఒకదానితో ఒకటి చేసే కోణం ఎంత?",
    questionTextEn:
      "If the correlation coefficient between two variables is r = 0, what is the angle between the two regression lines?",
    options: [
      { id: "A", textTe: "0° (ఏకీభవిస్తాయి)", textEn: "0° (Coincident)" },
      { id: "B", textTe: "45°", textEn: "45°" },
      { id: "C", textTe: "90° (లంబంగా ఉంటాయి)", textEn: "90° (Perpendicular)" },
      { id: "D", textTe: "180°", textEn: "180°" },
    ],
    correctOptionId: "C",
    explanationTe:
      "రెండు ప్రతిగమన రేఖల మధ్య కోణం \\tan \\theta = \\frac{1 - r^2}{r} (\\frac{\\sigma_x \\sigma_y}{\\sigma_x^2 + \\sigma_y^2}). r = 0 అయినప్పుడు \\tan \\theta = \\infty, అనగా \\theta = 90°. కాబట్టి r = 0 అయితే రెండు రేఖలు ఒకదానికొకటి లంబంగా ఉంటాయి.",
    explanationEn:
      "When r = 0, tan theta = infinity, which gives theta = 90°. Hence the regression lines are mutually perpendicular.",
    difficulty: "medium",
    estimatedSolveSeconds: 35,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Angle between Regression Lines",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_011",
    paperId: "paper_2",
    topicId: "p2_time_series_index_numbers",
    subtopicId: "p2_idx_laspeyre_paasche_fisher",
    questionNumber: 11,
    questionTextTe:
      "లాస్‌పియర్ సూచీ సంఖ్య (Laspeyres Index) 121 మరియు పాషే సూచీ సంఖ్య (Paasche Index) 100 అయితే, ఫిషర్ ఆదర్శ సూచీ సంఖ్య (Fisher's Ideal Index) విలువ ఎంత?",
    questionTextEn:
      "If Laspeyres index number is 121 and Paasche index number is 100, what is Fisher's ideal index number?",
    options: [
      { id: "A", textTe: "110.5", textEn: "110.5" },
      { id: "B", textTe: "110", textEn: "110" },
      { id: "C", textTe: "121", textEn: "121" },
      { id: "D", textTe: "105", textEn: "105" },
    ],
    correctOptionId: "B",
    explanationTe:
      "ఫిషర్ ఆదర్శ సూచీ సంఖ్య అనేది లాస్‌పియర్ మరియు పాషే సూచీల గుణకార మధ్యమం (Geometric Mean): F = \\sqrt{L \\times P}. ఇక్కడ L = 121, P = 100. కావున F = \\sqrt{121 \\times 100} = \\sqrt{12100} = 110.",
    explanationEn:
      "Fisher's Ideal Index is the geometric mean of Laspeyres and Paasche indices: F = sqrt(L * P) = sqrt(121 * 100) = 110.",
    relevantFormulaLatex: "F = \\sqrt{L \\times P}",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "standard_degree_textbook",
    sourceReference: "Fisher's Ideal Index Properties",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "sqrt(121 * 100)",
      calculatedValue: 110,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_012",
    paperId: "paper_2",
    topicId: "p2_time_series_index_numbers",
    subtopicId: "p2_idx_tests_adequacy",
    questionNumber: 12,
    questionTextTe:
      "కాల విపర్యయ పరీక్ష (Time Reversal Test - TRT) మరియు కారక విపర్యయ పరీక్ష (Factor Reversal Test - FRT) రెండింటినీ సంతృప్తి పరిచే సూచీ ఏది?",
    questionTextEn:
      "Which index number satisfies both the Time Reversal Test (TRT) and Factor Reversal Test (FRT)?",
    options: [
      { id: "A", textTe: "లాస్‌పియర్ సూచీ (Laspeyres)", textEn: "Laspeyres Index" },
      { id: "B", textTe: "పాషే సూచీ (Paasche)", textEn: "Paasche Index" },
      { id: "C", textTe: "ఫిషర్ ఆదర్శ సూచీ (Fisher's Ideal Index)", textEn: "Fisher's Ideal Index" },
      { id: "D", textTe: "మార్షల్-ఎడ్జ్‌వర్త్ సూచీ (Marshall-Edgeworth)", textEn: "Marshall-Edgeworth Index" },
    ],
    correctOptionId: "C",
    explanationTe:
      "ఫిషర్ సూచీ సంఖ్య మాత్రమే TRT (P_{01} \\times P_{10} = 1) మరియు FRT (P_{01} \\times Q_{01} = V_{01}) రెండింటినీ సంతృప్తి పరుస్తుంది. అందుకే దీనిని 'ఆదర్శ సూచీ' (Ideal Index) అంటారు.",
    explanationEn:
      "Fisher's Ideal Index is the only index that satisfies both Time Reversal and Factor Reversal tests.",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Tests of Adequacy of Index Numbers",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_013",
    paperId: "paper_2",
    topicId: "p2_sampling_techniques",
    subtopicId: "p2_samp_srs_methods",
    questionNumber: 13,
    questionTextTe:
      "పరిమిత జనాభా పరిమాణం N = 5 నుండి n = 2 పరిమాణం గల శాంపిల్‌ను తిరిగేయని పద్ధతిలో (SRSWOR) ఎంపిక చేస్తే, సాధ్యమయ్యే మొత్తం శాంపిల్స్ సంఖ్య ఎంత?",
    questionTextEn:
      "From a finite population of size N = 5, if a sample of size n = 2 is drawn without replacement (SRSWOR), what is the total number of possible samples?",
    options: [
      { id: "A", textTe: "25", textEn: "25" },
      { id: "B", textTe: "10", textEn: "10" },
      { id: "C", textTe: "20", textEn: "20" },
      { id: "D", textTe: "5", textEn: "5" },
    ],
    correctOptionId: "B",
    explanationTe:
      "తిరిగేయని సరళ యాదృచ్ఛిక శాంప్లింగ్‌లో (SRSWOR) సాధ్యమయ్యే శాంపిల్స్ సంఖ్య = \\binom{N}{n} = \\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10. (తిరిగేసే పద్ధతి SRSWR అయితే N^n = 5^2 = 25 అయ్యేది).",
    explanationEn:
      "For SRSWOR, total possible samples = N_C_n = 5_C_2 = 10. For SRSWR, it would be N^n = 5^2 = 25.",
    relevantFormulaLatex: "\\binom{N}{n} = \\frac{N!}{n!(N-n)!}",
    difficulty: "medium",
    estimatedSolveSeconds: 40,
    sourceType: "standard_degree_textbook",
    sourceReference: "Sampling Techniques - Cochran / Sukhatme",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "5_C_2 = 10",
      calculatedValue: 10,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_014",
    paperId: "paper_2",
    topicId: "p2_basics_of_computers",
    subtopicId: "p2_comp_number_systems",
    questionNumber: 14,
    questionTextTe:
      "దశాంశ సంఖ్య 25 (Decimal 25) యొక్క సమానమైన బైనరీ రూపం (Binary representation) ఏది?",
    questionTextEn:
      "What is the equivalent binary representation of the decimal number 25?",
    options: [
      { id: "A", textTe: "11001", textEn: "11001" },
      { id: "B", textTe: "10101", textEn: "10101" },
      { id: "C", textTe: "11100", textEn: "11100" },
      { id: "D", textTe: "10011", textEn: "10011" },
    ],
    correctOptionId: "A",
    explanationTe:
      "25 ని 2 చే భాగించగా: 25 = 16 + 8 + 1 = 2^4 + 2^3 + 2^0. కావున స్థాన విలువలు (16, 8, 4, 2, 1) వరుసగా 1, 1, 0, 0, 1 అవుతాయి. కాబట్టి 25_{10} = 11001_2.",
    explanationEn:
      "25 = 16 + 8 + 1 = 1*2^4 + 1*2^3 + 0*2^2 + 0*2^1 + 1*2^0 = (11001)_2.",
    difficulty: "easy",
    estimatedSolveSeconds: 35,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Basics of Computers - Number Systems",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p2_015",
    paperId: "paper_2",
    topicId: "p2_basics_of_computers",
    subtopicId: "p2_comp_logic_operators",
    questionNumber: 15,
    questionTextTe:
      "రెండు ఇన్‌పుట్‌లు A మరియు B లు సమానమైన విలువలను (రెండూ 0 లేదా రెండూ 1) కలిగి ఉన్నప్పుడు అవుట్‌పుట్ 0 వచ్చే లాజిక్ ఆపరేటర్ ఏది?",
    questionTextEn:
      "Which logic operator produces an output of 0 when both inputs A and B are identical (both 0 or both 1)?",
    options: [
      { id: "A", textTe: "AND", textEn: "AND" },
      { id: "B", textTe: "OR", textEn: "OR" },
      { id: "C", textTe: "XOR (Exclusive OR)", textEn: "XOR" },
      { id: "D", textTe: "NOT", textEn: "NOT" },
    ],
    correctOptionId: "C",
    explanationTe:
      "XOR (Exclusive OR) గేట్ లక్షణం ప్రకారం: రెండు ఇన్‌పుట్‌లు వేర్వేరుగా ఉన్నప్పుడు మాత్రమే (0,1 లేదా 1,0) అవుట్‌పుట్ 1 వస్తుంది. రెండు ఇన్‌పుట్‌లు సమానంగా ఉంటే (0,0 లేదా 1,1) అవుట్‌పుట్ 0 అవుతుంది.",
    explanationEn:
      "XOR (Exclusive OR) outputs 1 if and only if the inputs are different; if inputs are identical, the output is 0.",
    difficulty: "easy",
    estimatedSolveSeconds: 25,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Basics of Computers - Logic Gates",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },

  // =========================================================================
  // PAPER I: GENERAL STUDIES & GENERAL ABILITIES QUESTIONS
  // =========================================================================
  {
    id: "q_p1_001",
    paperId: "paper_1",
    topicId: "p1_history_telangana_statehood",
    subtopicId: "p1_tg_1969_movement",
    questionNumber: 16,
    questionTextTe:
      "1956 ఫిబ్రవరి 20న ఢిల్లీలోని హైదరాబాద్ హౌస్‌లో కుదిరిన 'పెద్దమనుషుల ఒప్పందం' (Gentlemen's Agreement) లో తెలంగాణ ప్రాంతం తరఫున సంతకం చేసిన ముఖ్య నాయకులలో క్రింది వారిలో ఎవరు లేరు?",
    questionTextEn:
      "Who among the following leaders from Telangana was NOT a signatory to the Gentlemen's Agreement signed on 20th February 1956?",
    options: [
      { id: "A", textTe: "బూర్గుల రామకృష్ణారావు", textEn: "Burgula Ramakrishna Rao" },
      { id: "B", textTe: "కె.వి. రంగారెడ్డి", textEn: "K.V. Ranga Reddy" },
      { id: "C", textTe: "మర్రి చెన్నారెడ్డి", textEn: "Marri Chenna Reddy" },
      { id: "D", textTe: "రవీంద్రనాథ్", textEn: "Ravindranath" },
    ],
    correctOptionId: "D",
    explanationTe:
      "పెద్దమనుషుల ఒప్పందంపై తెలంగాణ తరఫున నలుగురు ప్రముఖులు సంతకాలు చేశారు: 1. బూర్గుల రామకృష్ణారావు, 2. కె.వి. రంగారెడ్డి, 3. డాక్టర్ మర్రి చెన్నారెడ్డి, 4. జె.వి. నర్సింగరావు. రవీంద్రనాథ్ 1969 తెలంగాణ ఉద్యమంలో నిరాహారదీక్ష చేసిన విద్యార్థి నాయకుడు.",
    explanationEn:
      "The 4 Telangana signatories were Burgula Ramakrishna Rao, K.V. Ranga Reddy, Marri Chenna Reddy, and J.V. Narsinga Rao. Ravindranath was a hunger-strike leader in the 1969 movement.",
    difficulty: "medium",
    estimatedSolveSeconds: 40,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Telangana History & Movement - Telugu Akademi",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_002",
    paperId: "paper_1",
    topicId: "p1_telangana_society_culture",
    subtopicId: "p1_cul_festivals",
    questionNumber: 17,
    questionTextTe:
      "ఆసియాలోనే అతిపెద్ద గిరిజన జాతరగా ప్రసిద్ధి చెందిన 'సమ్మక్క-సారలమ్మ జాతర' (మేడారం జాతర) తెలంగాణలోని ఏ జిల్లాలో జరుగుతుంది?",
    questionTextEn:
      "Sammakka-Sarakka Jatara (Medaram Jatara), known as Asia's largest tribal fair, takes place in which district of Telangana?",
    options: [
      { id: "A", textTe: "జయశంకర్ భూపాలపల్లి", textEn: "Jayashankar Bhupalpally" },
      { id: "B", textTe: "ములుగు", textEn: "Mulugu" },
      { id: "C", textTe: "భద్రాద్రి కొత్తగూడెం", textEn: "Bhadradri Kothagudem" },
      { id: "D", textTe: "మహబూబాబాద్", textEn: "Mahabubabad" },
    ],
    correctOptionId: "B",
    explanationTe:
      "సమ్మక్క-సారలమ్మ జాతర ములుగు జిల్లాలోని తాడ్వాయి మండలం మేడారం గ్రామంలో ప్రతి రెండేళ్లకు ఒకసారి మాఘశుద్ధ పౌర్ణమి రోజుల్లో ఘనంగా జరుగుతుంది.",
    explanationEn:
      "Medaram Jatara takes place in Medaram village, Tadvai Mandal of Mulugu district, Telangana.",
    difficulty: "easy",
    estimatedSolveSeconds: 25,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Telangana Culture and Heritage",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_003",
    paperId: "paper_1",
    topicId: "p1_polity_local_governance",
    subtopicId: "p1_pol_local_bodies",
    questionNumber: 18,
    questionTextTe:
      "భారత రాజ్యాంగంలోని 73వ రాజ్యాంగ సవరణ చట్టం (1992) ద్వారా పంచాయతీరాజ్ సంస్థలకు చేర్చబడిన అంశాలు రాజ్యాంగంలోని ఏ షెడ్యూల్‌లో ఉన్నాయి?",
    questionTextEn:
      "Under the 73rd Constitutional Amendment Act (1992), which schedule of the Indian Constitution lists the 29 functional items allocated to Panchayati Raj institutions?",
    options: [
      { id: "A", textTe: "10వ షెడ్యూల్", textEn: "10th Schedule" },
      { id: "B", textTe: "11వ షెడ్యూల్", textEn: "11th Schedule" },
      { id: "C", textTe: "12వ షెడ్యూల్", textEn: "12th Schedule" },
      { id: "D", textTe: "7వ షెడ్యూల్", textEn: "7th Schedule" },
    ],
    correctOptionId: "B",
    explanationTe:
      "73వ సవరణ ద్వారా 11వ షెడ్యూల్‌ను చేర్చి పంచాయతీలకు 29 అధికార విధులను కేటాయించారు. 74వ సవరణ ద్వారా మునిసిపాలిటీలకు 12వ షెడ్యూల్‌లో 18 విధులను కేటాయించారు.",
    explanationEn:
      "The 73rd Amendment added the 11th Schedule containing 29 subjects for Panchayats. The 12th schedule applies to Municipalities (74th Amendment).",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Indian Constitution & Polity",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_004",
    paperId: "paper_1",
    topicId: "p1_geography_india_telangana",
    subtopicId: "p1_geo_telangana_rivers",
    questionNumber: 19,
    questionTextTe:
      "తెలంగాణ రాష్ట్రంలో గోదావరి నది మొదటగా ఏ జిల్లాలో ప్రవేశిస్తుంది?",
    questionTextEn:
      "In which district does the Godavari River first enter the state of Telangana?",
    options: [
      { id: "A", textTe: "నిజామాబాద్ (కందకుర్తి)", textEn: "Nizamabad (Kandakurthi)" },
      { id: "B", textTe: "నిర్మల్ (బాసర)", textEn: "Nirmal (Basara)" },
      { id: "C", textTe: "ఆదిలాబాద్", textEn: "Adilabad" },
      { id: "D", textTe: "మంచిర్యాల", textEn: "Mancherial" },
    ],
    correctOptionId: "A",
    explanationTe:
      "గోదావరి నది మహారాష్ట్రలోని త్రయంబకేశ్వర్ వద్ద జన్మించి, తెలంగాణలోని నిజామాబాద్ జిల్లాలోని కందకుర్తి వద్ద మొదటగా ప్రవేశిస్తుంది. ఇక్కడ గోదావరి, మాంజ్రా, హరిద్ర నదుల త్రివేణి సంగమం ఉంది.",
    explanationEn:
      "Godavari enters Telangana at Kandakurthi in Nizamabad district, forming a Triveni Sangam with Manjira and Haridra rivers.",
    difficulty: "easy",
    estimatedSolveSeconds: 25,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Geography of Telangana",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_005",
    paperId: "paper_1",
    topicId: "p1_telangana_policies",
    subtopicId: "p1_pol_welfare",
    questionNumber: 20,
    questionTextTe:
      "తెలంగాణ రాష్ట్రంలో మహిళలకు ఆర్టీసీ బస్సులలో ఉచిత ప్రయాణాన్ని కల్పించే పథకం పేరు ఏమిటి?",
    questionTextEn:
      "What is the name of the scheme launched in Telangana offering free bus travel for women in TSRTC buses?",
    options: [
      { id: "A", textTe: "మహాలక్ష్మి పథకం", textEn: "Mahalakshmi Scheme" },
      { id: "B", textTe: "గృహజ్యోతి పథకం", textEn: "Gruha Jyothi Scheme" },
      { id: "C", textTe: "చేయూత పథకం", textEn: "Cheyutha Scheme" },
      { id: "D", textTe: "ఇందిరమ్మ ఇండ్లు", textEn: "Indiramma Indlu" },
    ],
    correctOptionId: "A",
    explanationTe:
      "తెలంగాణ ప్రభుత్వం 6 గ్యారెంటీలలో భాగంగా 'మహాలక్ష్మి' పథకం కింద రాష్ట్రంలోని బాలికలు, మహిళలు, ట్రాన్స్‌జెండర్లకు పల్లె వెలుగు, ఎక్స్‌ప్రెస్ బస్సులలో ఉచిత ప్రయాణ సౌకర్యాన్ని ప్రారంభించింది.",
    explanationEn:
      "Under the 6 Guarantees, the Mahalakshmi scheme provides free bus travel for women, girls, and transgender persons in TSRTC Palle Velugu and Express buses.",
    difficulty: "easy",
    estimatedSolveSeconds: 20,
    sourceType: "current_affairs_editorial",
    sourceReference: "Telangana State Welfare Policies 2024-2026",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_006",
    paperId: "paper_1",
    topicId: "p1_economy_india_telangana",
    subtopicId: "p1_eco_national",
    questionNumber: 21,
    questionTextTe:
      "భారతదేశంలో 'జాతీయ గణాంకాల దినోత్సవం' (National Statistics Day) ప్రొఫెసర్ పి.సి. మహలనోబిస్ జయంతి సందర్భంగా ఏ రోజున జరుపుకుంటారు?",
    questionTextEn:
      "On which date is National Statistics Day celebrated in India to commemorate the birth anniversary of Prof. P.C. Mahalanobis?",
    options: [
      { id: "A", textTe: "జూన్ 29", textEn: "June 29" },
      { id: "B", textTe: "అక్టోబర్ 20", textEn: "October 20" },
      { id: "C", textTe: "డిసెంబర్ 22", textEn: "December 22" },
      { id: "D", textTe: "మార్చి 15", textEn: "March 15" },
    ],
    correctOptionId: "A",
    explanationTe:
      "భారత గణాంక పితామహుడు ప్రొఫెసర్ ప్రశాంత చంద్ర మహలనోబిస్ జయంతి అయిన జూన్ 29న ప్రతి సంవత్సరం భారతదేశంలో 'జాతీయ గణాంకాల దినోత్సవం' జరుపుకుంటారు. (అక్టోబర్ 20 ప్రపంచ గణాంకాల దినోత్సవం).",
    explanationEn:
      "National Statistics Day is celebrated on June 29 every year in honor of Prof. P.C. Mahalanobis. World Statistics Day is celebrated on October 20.",
    difficulty: "easy",
    estimatedSolveSeconds: 20,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Indian Statistical System",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_007",
    paperId: "paper_1",
    topicId: "p1_general_science",
    subtopicId: "p1_sci_isro_drdo",
    questionNumber: 22,
    questionTextTe:
      "భారత అంతరిక్ష పరిశోధనా సంస్థ (ISRO) చంద్రుని దక్షిణ ధ్రువంపై విజయవంతంగా ల్యాండ్ చేసిన చారిత్రాత్మక మిషన్ ఏది?",
    questionTextEn:
      "Which historic mission was successfully landed on the south polar region of the Moon by ISRO?",
    options: [
      { id: "A", textTe: "చంద్రయాన్-1", textEn: "Chandrayaan-1" },
      { id: "B", textTe: "చంద్రయాన్-2", textEn: "Chandrayaan-2" },
      { id: "C", textTe: "చంద్రయాన్-3", textEn: "Chandrayaan-3" },
      { id: "D", textTe: "ఆదిత్య-L1", textEn: "Aditya-L1" },
    ],
    correctOptionId: "C",
    explanationTe:
      "2023 ఆగస్టు 23న చంద్రయాన్-3 యొక్క విక్రమ్ ల్యాండర్ చంద్రుని దక్షిణ ధ్రువ ప్రాంతంలో విజయవంతంగా అడుగుపెట్టింది. ఆ రోజును భారత ప్రభుత్వం 'జాతీయ అంతరిక్ష దినోత్సవం' (National Space Day) గా ప్రకటించింది.",
    explanationEn:
      "Chandrayaan-3 landed Vikram on the lunar south polar region on August 23, 2023, declared as National Space Day.",
    difficulty: "easy",
    estimatedSolveSeconds: 20,
    sourceType: "current_affairs_editorial",
    sourceReference: "ISRO Achievements & Science and Technology",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_008",
    paperId: "paper_1",
    topicId: "p1_logical_reasoning_data_interpretation",
    subtopicId: "p1_lr_verbal_reasoning",
    questionNumber: 23,
    questionTextTe:
      "క్రింది సంఖ్యా శ్రేణిలో తర్వాతి సంఖ్య ఏది?  2, 6, 12, 20, 30, ?",
    questionTextEn:
      "What is the next number in the given series?  2, 6, 12, 20, 30, ?",
    options: [
      { id: "A", textTe: "40", textEn: "40" },
      { id: "B", textTe: "42", textEn: "42" },
      { id: "C", textTe: "44", textEn: "44" },
      { id: "D", textTe: "36", textEn: "36" },
    ],
    correctOptionId: "B",
    explanationTe:
      "తేడాలను గమనించండి: 6 - 2 = 4, 12 - 6 = 6, 20 - 12 = 8, 30 - 20 = 10. తేడాలు వరుసగా 4, 6, 8, 10 గా పెరుగుతున్నాయి. తదుపరి తేడా 12 కావాలి. కాబట్టి 30 + 12 = 42. (లేదా: 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42).",
    explanationEn:
      "Differences are 4, 6, 8, 10, next is 12: 30 + 12 = 42. Alternatively, n*(n+1) gives 6*7 = 42.",
    difficulty: "easy",
    estimatedSolveSeconds: 30,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Logical Reasoning - Number Series",
    numericalMetadata: {
      isNumerical: true,
      formulaUsed: "30 + 12 = 42",
      calculatedValue: 42,
      tolerance: 0.01,
      independentValidationPassed: true,
    },
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_009",
    paperId: "paper_1",
    topicId: "p1_basic_english",
    subtopicId: "p1_eng_grammar",
    questionNumber: 24,
    questionTextTe:
      "క్రింది వాక్యంలో ఖాళీని సరైన ప్రిపొజిషన్ తో పూరించండి: 'She has been studying for the MPSO exam ______ three months.'",
    questionTextEn:
      "Fill in the blank with the correct preposition: 'She has been studying for the MPSO exam ______ three months.'",
    options: [
      { id: "A", textTe: "since", textEn: "since" },
      { id: "B", textTe: "for", textEn: "for" },
      { id: "C", textTe: "from", textEn: "from" },
      { id: "D", textTe: "in", textEn: "in" },
    ],
    correctOptionId: "B",
    explanationTe:
      "కాల వ్యవధిని (Period of Time - ఉదాహరణకు 3 నెలలు, 2 గంటలు) సూచించేటప్పుడు 'for' ను వాడతాము. కచ్చితమైన సమయ బిందువును (Point of Time - ఉదాహరణకు 2024 నుండి, ఉదయం నుండి) సూచించేటప్పుడు 'since' ను వాడతాము.",
    explanationEn:
      "'for' is used to denote a period/duration of time (three months), whereas 'since' denotes a specific point in time.",
    difficulty: "easy",
    estimatedSolveSeconds: 25,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Basic English Grammar - Prepositions",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "q_p1_010",
    paperId: "paper_1",
    topicId: "p1_environment_disaster",
    subtopicId: "p1_env_climate",
    questionNumber: 25,
    questionTextTe:
      "భూతాపోన్నతికి (Global Warming) మరియు గ్రీన్‌హౌస్ ప్రభావానికి క్రింది వాయువులలో ప్రధాన కారణమైన వాయువు ఏది?",
    questionTextEn:
      "Which among the following gases is the primary contributor to the enhanced greenhouse effect and global warming?",
    options: [
      { id: "A", textTe: "కార్బన్ డయాక్సైడ్ (CO2)", textEn: "Carbon Dioxide (CO2)" },
      { id: "B", textTe: "ఆక్సిజన్ (O2)", textEn: "Oxygen (O2)" },
      { id: "C", textTe: "నైట్రోజన్ (N2)", textEn: "Nitrogen (N2)" },
      { id: "D", textTe: "ఆర్గాన్ (Ar)", textEn: "Argon (Ar)" },
    ],
    correctOptionId: "A",
    explanationTe:
      "శిలాజ ఇంధనాల దహనం వల్ల వాతావరణంలోకి వెలువడే కార్బన్ డయాక్సైడ్ (CO2), మీథేన్ (CH4) లు ప్రధాన గ్రీన్‌హౌస్ వాయువులు. ఇవి భూమి విడుదల చేసే పరారుణ వికిరణాలను గ్రహించి ఉష్ణోగ్రత పెరగడానికి కారణమవుతాయి.",
    explanationEn:
      "Carbon dioxide (CO2) is the primary greenhouse gas emitted through human activities contributing to global warming.",
    difficulty: "easy",
    estimatedSolveSeconds: 20,
    sourceType: "tgpsc_standard_model",
    sourceReference: "Environmental Science & Climate",
    validationStatus: "approved",
    createdAt: "2026-10-30T10:00:00Z",
    updatedAt: "2026-10-30T10:00:00Z",
  },
];
