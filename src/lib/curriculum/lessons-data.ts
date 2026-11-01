import { LessonContent } from "@/types/curriculum";

export const CURRICULUM_LESSONS: LessonContent[] = [
  // ----------------------------------------------------
  // Paper II, Unit II: Measures of Central Tendency & Dispersion
  // ----------------------------------------------------
  {
    id: "lesson_p2_central_tendency_mean",
    topicId: "p2_central_tendency_dispersion",
    subtopicId: "p2_stat_central_averages",
    titleTe: "కేంద్రీయ ప్రవృత్తి కొలతలు: అంకమధ్యమం, మధ్యగతం, బాహుళకం",
    titleEn: "Measures of Central Tendency: Mean, Median and Mode",
    estimatedMinutes: 35,
    overviewTe:
      "ఒక దత్తాంశంలో విలువలన్నీ ఏ కేంద్రీయ విలువ చుట్టూ కేంద్రీకృతమై ఉన్నాయో తెలిపే విలువను 'కేంద్రీయ ప్రవృత్తి కొలత' (Measure of Central Tendency) లేదా సగటు అంటారు. ఇందులో అంకమధ్యమం (Arithmetic Mean), మధ్యగతం (Median), బాహుళకం (Mode) అత్యంత ముఖ్యమైనవి.",
    overviewEn:
      "A measure of central tendency is a single representative value that describes the center point of a given dataset. The most prominent measures are Arithmetic Mean, Median, and Mode.",
    keyConceptsTe: [
      {
        concept: "అంకమధ్యమం (Arithmetic Mean - AM)",
        englishTerm: "Arithmetic Mean",
        explanation:
          "దత్తాంశంలోని పరిశీలనల మొత్తాన్ని, ఆ పరిశీలనల సంఖ్యతో భాగించగా వచ్చే విలువను అంకమధ్యమం అంటారు. ఇది అత్యంత ప్రాచుర్యం పొందిన సగటు. అన్ని విలువలపై ఆధారపడుతుంది.",
      },
      {
        concept: "మధ్యగతం (Median - M)",
        englishTerm: "Median",
        explanation:
          "దత్తాంశంలోని అంశాలను ఆరోహణ లేదా అవరోహణ క్రమంలో అమర్చినప్పుడు సరిగ్గా మధ్యలో ఉండే విలువను మధ్యగతం అంటారు. ఇది స్థాన సగటు (Positional Average). తీవ్ర విలువల (Extreme values/Outliers) ప్రభావానికి గురికాదు.",
      },
      {
        concept: "బాహుళకం (Mode - Z)",
        englishTerm: "Mode",
        explanation:
          "దత్తాంశంలో అత్యధిక పర్యాయాలు పునరావృతమైన (గరిష్ట పౌనఃపున్యం గల) విలువను బాహుళకం అంటారు. వ్యాపార రంగంలో (ఉదా: చెప్పుల లేదా చొక్కాల సైజుల డిమాండ్) దీనిని ఎక్కువగా వాడతారు.",
      },
      {
        concept: "ఆనుభావిక సంబంధం (Empirical Relationship)",
        englishTerm: "Empirical Relationship",
        explanation:
          "మితమైన అసౌష్ఠవ పౌనఃపున్య విభాజనంలో (Moderately Skewed Distribution), బాహుళకం, మధ్యగతం, అంకమధ్యమాల మధ్య సంబంధం: Mode = 3(Median) - 2(Mean). ఇది పరీక్షల్లో తరచూ అడిగే ప్రశ్న.",
      },
    ],
    formulas: [
      {
        id: "formula_am_ungrouped",
        nameTe: "అవర్గీకృత దత్తాంశ అంకమధ్యమం",
        nameEn: "Arithmetic Mean for Ungrouped Data",
        latex: "\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}",
        symbolExplanationsTe: [
          { symbol: "\\bar{x}", explanation: "అంకమధ్యమం (Mean)" },
          { symbol: "\\sum x_i", explanation: "అన్ని పరిశీలనా విలువల మొత్తం (Sum of observations)" },
          { symbol: "n", explanation: "మొత్తం పరిశీలనల సంఖ్య (Number of observations)" },
        ],
        usageTe: "సాధారణ సంఖ్యల సగటు కనుగొనుటకు వాడుతారు.",
        sampleCalculationTe: "విలువలు 10, 15, 20, 25, 30 అయితే, మొత్తం = 100, n = 5, కావున \\bar{x} = 100 / 5 = 20.",
      },
      {
        id: "formula_empirical_relation",
        nameTe: "సగటుల మధ్య ఆనుభావిక సంబంధం",
        nameEn: "Empirical Relationship between Mean, Median & Mode",
        latex: "\\text{Mode} = 3(\\text{Median}) - 2(\\text{Mean})",
        symbolExplanationsTe: [
          { symbol: "\\text{Mode}", explanation: "బాహుళకం (Z)" },
          { symbol: "\\text{Median}", explanation: "మధ్యగతం (M)" },
          { symbol: "\\text{Mean}", explanation: "అంకమధ్యమం (\\bar{x})" },
        ],
        usageTe: "రెండు విలువల సహాయంతో మూడవ విలువను లెక్కించడానికి ఉపయోగపడుతుంది.",
        sampleCalculationTe: "Mean = 25, Median = 28 అయితే, Mode = 3(28) - 2(25) = 84 - 50 = 34.",
      },
      {
        id: "formula_standard_deviation",
        nameTe: "ప్రామాణిక విచలనం (Standard Deviation)",
        nameEn: "Standard Deviation (Population / Sample)",
        latex: "\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}",
        symbolExplanationsTe: [
          { symbol: "\\sigma", explanation: "ప్రామాణిక విచలనం (Standard Deviation)" },
          { symbol: "(x_i - \\bar{x})", explanation: "అంకమధ్యమం నుండి విచలనాలు (Deviations from Mean)" },
          { symbol: "n", explanation: "పరిశీలనల సంఖ్య" },
        ],
        usageTe: "విస్తరణను కచ్చితంగా కొలవడానికి కార్ల్ పియర్సన్ ప్రతిపాదించిన ఉత్తమ కొలత.",
      },
      {
        id: "formula_coefficient_variation",
        nameTe: "విచలన గుణకం (Coefficient of Variation - CV)",
        nameEn: "Coefficient of Variation",
        latex: "CV = \\frac{\\sigma}{\\bar{x}} \\times 100",
        symbolExplanationsTe: [
          { symbol: "CV", explanation: "విచలన గుణకం శాతం రూపంలో" },
          { symbol: "\\sigma", explanation: "ప్రామాణిక విచలనం" },
          { symbol: "\\bar{x}", explanation: "అంకమధ్యమం" },
        ],
        usageTe: "రెండు శ్రేణుల స్థిరత్వాన్ని (Consistency/Variability) పోల్చడానికి వాడుతారు. CV తక్కువగా ఉంటే ఎక్కువ స్థిరత్వం ఉంటుంది.",
      },
    ],
    workedExamples: [
      {
        id: "we_mean_01",
        titleTe: "ఉదాహరణ 1: సగటు మరియు విచలన గుణకం లెక్కించుట",
        titleEn: "Example 1: Calculating Mean and Coefficient of Variation",
        problemTe: "ఒక పరిశ్రమలోని కార్మికుల రోజువారీ వేతనాలు (రూపాయల్లో): 120, 150, 180, 210, 240. సగటు వేతనం, ప్రామాణిక విచలనం మరియు విచలన గుణకాన్ని లెక్కించండి.",
        givenDataTe: ["పరిశీలనలు (x): 120, 150, 180, 210, 240", "పరిశీలనల సంఖ్య n = 5"],
        stepByStepSolutionTe: [
          {
            stepNumber: 1,
            description: "అంకమధ్యమం \\bar{x} లెక్కించడం: మొత్తం విలువల కూడిక / పరిశీలనల సంఖ్య",
            mathLatex: "\\bar{x} = \\frac{120 + 150 + 180 + 210 + 240}{5} = \\frac{900}{5} = 180",
          },
          {
            stepNumber: 2,
            description: "సగటు నుండి విచలనాలు (x_i - \\bar{x}) మరియు వాటి వర్గాలు కనుగొనడం",
            mathLatex: "(120-180)^2 = 3600, \\ (150-180)^2 = 900, \\ (180-180)^2 = 0, \\ (210-180)^2 = 900, \\ (240-180)^2 = 3600",
          },
          {
            stepNumber: 3,
            description: "వర్గాల మొత్తం: 3600 + 900 + 0 + 900 + 3600 = 9000. విస్తృతి (Variance) = 9000 / 5 = 1800",
            mathLatex: "\\sigma^2 = \\frac{9000}{5} = 1800",
          },
          {
            stepNumber: 4,
            description: "ప్రామాణిక విచలనం \\sigma = \\sqrt{1800} \\approx 42.43",
            mathLatex: "\\sigma = \\sqrt{1800} \\approx 42.43",
          },
          {
            stepNumber: 5,
            description: "విచలన గుణకం CV = (\\sigma / \\bar{x}) \\times 100",
            mathLatex: "CV = \\frac{42.43}{180} \\times 100 \\approx 23.57\\%",
          },
        ],
        finalAnswerTe: "సగటు = రూ. 180, ప్రామాణిక విచలనం \\approx 42.43, విచలన గుణకం \\approx 23.57%",
        keyTakeawayTe: "విచలన గుణకం శాతం రూపంలో ఉంటుంది. ఏ గ్రూపు యొక్క CV తక్కువగా ఉంటుందో ఆ గ్రూపు ఎక్కువ స్థిరమైనది (more consistent).",
      },
    ],
    commonMistakesTe: [
      {
        mistake: "తీవ్ర విలువలు (Extreme Outliers) ఉన్నప్పుడు అంకమధ్యమాన్ని ఉత్తమ సగటుగా భావించడం.",
        correction: "తీవ్ర విలువలు ఉన్నప్పుడు మధ్యగతం (Median) ఉత్తమ సగటు అవుతుంది.",
        why: "అంకమధ్యమం ప్రతీ విలువతో మారుతుంది; మధ్యగతం స్థానంపై ఆధారపడుతుంది కాబట్టి తీవ్ర విలువల ప్రభావం పడదు.",
      },
      {
        mistake: "ఆనుభావిక సూత్రంలో సంఖ్యలను తారుమారు చేయడం (Mode = 2Mean - 3Median అని రాయడం).",
        correction: "గుర్తుంచుకోవడానికి సులభ మార్గం: Mode = 3(Median) - 2(Mean). పెద్ద పదానికి (Median 3 అక్షరాలు) 3, చిన్న పదానికి (Mean) 2 వస్తాయి.",
        why: "ఇది మితమైన అసౌష్ఠవ విభాజనాలకు మాత్రమే వర్తిస్తుంది.",
      },
    ],
    summaryPointsTe: [
      "కేంద్రీయ ప్రవృత్తి కొలతలలో అంకమధ్యమం మాత్రమే బీజీయ ప్రక్రియలకు (Algebraic treatment) అనువైనది.",
      "సగటు నుండి తీసుకున్న విచలనాల మొత్తం ఎల్లప్పుడూ సున్నా అవుతుంది: \\sum (x_i - \\bar{x}) = 0.",
      "సగటు నుండి తీసుకున్న విచలనాల వర్గాల మొత్తం కనిష్టం అవుతుంది: \\sum (x_i - A)^2 is minimum when A = \\bar{x}.",
      "గుణాత్మక దత్తాంశానికి (Qualitative data - ఉదా: తెలివితేటలు, అందం) మధ్యగతం ఉత్తమ సగటు.",
      "ఓపెన్-ఎండ్ తరగతులకు (Open-ended classes) మధ్యగతం లేదా బాహుళకం అనువైనవి.",
    ],
    officialSyllabusMapping: "Paper II: Unit II - Measures of Central Tendency & Dispersion",
    sourceReferences: ["TGPSC Notification 07/G/ES/2026 Annexure-II", "Degree Statistics Paper II Syllabus"],
    lastVerifiedDate: "2026-10-30",
  },

  // ----------------------------------------------------
  // Paper II, Unit III: Probability & Bayes' Theorem
  // ----------------------------------------------------
  {
    id: "lesson_p2_probability_bayes",
    topicId: "p2_probability",
    subtopicId: "p2_prob_bayes_theorem",
    titleTe: "సంభావ్యత ప్రాథమిక సూత్రాలు మరియు బేయెస్ సిద్ధాంతం",
    titleEn: "Probability Fundamentals, Conditional Probability & Bayes' Theorem",
    estimatedMinutes: 40,
    overviewTe:
      "ఒక అనిశ్చిత పరిస్థితులలో ఒక సంఘటన జరిగే అవకాశాన్ని సంఖ్యాపరంగా కొలవడాన్ని 'సంభావ్యత' (Probability) అంటారు. డిగ్రీ స్థాయిలో సంకలన సిద్ధాంతం, గుణకార సిద్ధాంతం, షరతులతో కూడిన సంభావ్యత మరియు బేయెస్ సిద్ధాంతం అత్యంత ప్రధానమైన అంశాలు.",
    overviewEn:
      "Probability measures the likelihood of an event occurring in a random experiment. In the degree standard exam, addition theorem, multiplication theorem, conditional probability, and Bayes' theorem form the core.",
    keyConceptsTe: [
      {
        concept: "యాదృచ్ఛిక ప్రయోగం & శాంపిల్ ఆవరణం (Sample Space)",
        englishTerm: "Sample Space",
        explanation:
          "సాధ్యమయ్యే అన్ని పర్యవసానాల సమితిని శాంపిల్ ఆవరణం (S) అంటారు. ఉదాహరణకు నాణేన్ని ఎగురవేస్తే S = {H, T}, పాచికను దొర్లిస్తే S = {1, 2, 3, 4, 5, 6}.",
      },
      {
        concept: "పరస్పర వివర్జిత ఘటనలు (Mutually Exclusive Events)",
        englishTerm: "Mutually Exclusive Events",
        explanation:
          "రెండు ఘటనలు ఒకేసారి సంభవించడానికి వీలులేకపోతే వాటిని పరస్పర వివర్జిత ఘటనలు అంటారు. అనగా A \\cap B = \\emptyset, P(A \\cap B) = 0.",
      },
      {
        concept: "స్వతంత్ర ఘటనలు (Independent Events)",
        englishTerm: "Independent Events",
        explanation:
          "ఒక ఘటన సంభవించడం లేదా సంభవించకపోవడం రెండవ ఘటన సంభావ్యతను ప్రభావితం చేయకపోతే వాటిని స్వతంత్ర ఘటనలు అంటారు. అప్పుడు P(A \\cap B) = P(A) \\cdot P(B).",
      },
      {
        concept: "బేయెస్ సిద్ధాంతం (Bayes' Theorem)",
        englishTerm: "Bayes' Theorem (Inverse Probability)",
        explanation:
          "ఒక ఫలితం సంభవించిన తర్వాత, ఆ ఫలితం ఒక నిర్దిష్ట కారణం (Cause/Hypothesis) వల్ల సంభవించి ఉండటానికి గల పశ్చాత్ సంభావ్యతను (Posterior Probability) లెక్కించడానికి బేయెస్ సిద్ధాంతం ఉపయోగిస్తారు.",
      },
    ],
    formulas: [
      {
        id: "formula_prob_addition",
        nameTe: "సంభావ్యత సంకలన సిద్ధాంతం (ఏవైనా రెండు ఘటనలకు)",
        nameEn: "Addition Theorem of Probability",
        latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
        symbolExplanationsTe: [
          { symbol: "P(A \\cup B)", explanation: "A లేదా B సంభవించే సంభావ్యత" },
          { symbol: "P(A \\cap B)", explanation: "A మరియు B రెండూ కలిసి సంభవించే సంభావ్యత" },
        ],
        usageTe: "A, B పరస్పర వివర్జితాలైతే P(A \\cap B) = 0 అయి, P(A \\cup B) = P(A) + P(B) అవుతుంది.",
      },
      {
        id: "formula_conditional_prob",
        nameTe: "షరతులతో కూడిన సంభావ్యత (Conditional Probability)",
        nameEn: "Conditional Probability",
        latex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0",
        symbolExplanationsTe: [
          { symbol: "P(A|B)", explanation: "B ఘటన ఇప్పటికే జరిగినప్పుడు, A సంభవించే సంభావ్యత" },
          { symbol: "P(A \\cap B)", explanation: "ఉమ్మడి సంభావ్యత" },
          { symbol: "P(B)", explanation: "షరతు విధించబడిన ఘటన సంభావ్యత" },
        ],
        usageTe: "ఒక ఘటన పూర్వానుభవం తెలిసినప్పుడు రెండవ ఘటన అంచనా వేయడానికి.",
      },
      {
        id: "formula_bayes_theorem",
        nameTe: "బేయెస్ సిద్ధాంత సూత్రం",
        nameEn: "Bayes' Theorem Formula",
        latex: "P(E_i|A) = \\frac{P(E_i) \\cdot P(A|E_i)}{\\sum_{j=1}^{k} P(E_j) \\cdot P(A|E_j)}",
        symbolExplanationsTe: [
          { symbol: "P(E_i)", explanation: "పూర్వ సంభావ్యత (Prior Probability)" },
          { symbol: "P(A|E_i)", explanation: "సంభావ్యత అవకాశం (Likelihood)" },
          { symbol: "P(E_i|A)", explanation: "పశ్చాత్ సంభావ్యత (Posterior Probability)" },
        ],
        usageTe: "వైద్య పరీక్షల ఫలితాలు, యంత్రాల లోపాలు తదితర విశ్లేషణల్లో విస్తృతంగా వాడుతారు.",
      },
    ],
    workedExamples: [
      {
        id: "we_prob_01",
        titleTe: "ఉదాహరణ: సంకలన సిద్ధాంతం వర్తింపు",
        titleEn: "Example: Applying Addition Theorem",
        problemTe: "బాగా కలిపిన 52 పేకముక్కల కట్ట నుండి యాదృచ్ఛికంగా ఒక కార్డు తీస్తే, అది రాజా (King) లేదా ఆసు (Ace) అవ్వడానికి సంభావ్యత ఎంత?",
        givenDataTe: [
          "మొత్తం కార్డులు n(S) = 52",
          "రాజా కార్డుల సంఖ్య n(A) = 4, కావున P(A) = 4/52",
          "ఆసు కార్డుల సంఖ్య n(B) = 4, కావున P(B) = 4/52",
          "ఒకే కార్డు ఒకే సమయంలో రాజా మరియు ఆసు కాలేదు కాబట్టి ఇవి పరస్పర వివర్జితాలు: P(A \\cap B) = 0",
        ],
        stepByStepSolutionTe: [
          {
            stepNumber: 1,
            description: "సంకలన సిద్ధాంతాన్ని ఉపయోగించడం: P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
            mathLatex: "P(A \\cup B) = \\frac{4}{52} + \\frac{4}{52} - 0",
          },
          {
            stepNumber: 2,
            description: "భిన్నాల కూడిక చేయడం",
            mathLatex: "P(A \\cup B) = \\frac{8}{52} = \\frac{2}{13}",
          },
        ],
        finalAnswerTe: "కావలసిన సంభావ్యత = 2/13 (సుమారు 0.1538)",
        keyTakeawayTe: "ఘటనలు పరస్పర వివర్జితాలైతే (Mutually Exclusive), ఉమ్మడి సంభావ్యత 0 అవుతుంది.",
      },
    ],
    commonMistakesTe: [
      {
        mistake: "స్వతంత్ర ఘటనలను పరస్పర వివర్జిత ఘటనలుగా భావించి గందరగోళపడటం.",
        correction: "పరస్పర వివర్జితం అంటే P(A \\cap B) = 0 (ఒకేసారి జరగవు). స్వతంత్ర ఘటనలు అంటే P(A \\cap B) = P(A) \\cdot P(B) (ఒకదానితో ఒకటి సంబంధం లేదు).",
        why: "సున్నా సంభావ్యత లేని రెండు ఘటనలు ఒకే సమయంలో పరస్పర వివర్జితాలు మరియు స్వతంత్రాలు కాజాలవు.",
      },
    ],
    summaryPointsTe: [
      "సంభావ్యత ఎల్లప్పుడూ 0 మరియు 1 మధ్య ఉంటుంది: 0 \\le P(A) \\le 1.",
      "అసంభవ ఘటన సంభావ్యత = 0; ఖచ్చిత ఘటన సంభావ్యత = 1.",
      "పూరక ఘటన సంభావ్యత: P(A') = 1 - P(A).",
      "బేయెస్ సిద్ధాంతం 'కారణాల సంభావ్యత' (Probability of Causes) ను నిర్ణయిస్తుంది.",
    ],
    officialSyllabusMapping: "Paper II: Unit III - Probability & Bayes' Theorem",
    sourceReferences: ["TGPSC Notification 07/G/ES/2026 Annexure-II", "Fundamentals of Mathematical Statistics - Gupta & Kapoor"],
    lastVerifiedDate: "2026-10-30",
  },

  // ----------------------------------------------------
  // Paper II, Unit V: Correlation & Regression
  // ----------------------------------------------------
  {
    id: "lesson_p2_correlation_regression",
    topicId: "p2_correlation_regression",
    subtopicId: "p2_cor_pearson_spearman",
    titleTe: "సహసంబంధం మరియు ప్రతిగమన విశ్లేషణ",
    titleEn: "Correlation and Regression Analysis",
    estimatedMinutes: 40,
    overviewTe:
      "రెండు లేదా అంతకంటే ఎక్కువ చలరాశుల మధ్య గల పరస్పర సంబంధాన్ని అధ్యయనం చేయడాన్ని 'సహసంబంధం' (Correlation) అంటారు. ఒక చలరాశి తెలిసినప్పుడు మరొక చలరాశి విలువను అంచనా వేసే గణిత సమీకరణాన్ని 'ప్రతిగమనం' (Regression) అంటారు.",
    overviewEn:
      "Correlation studies the degree and direction of linear association between two variables. Regression provides mathematical equations to predict the value of a dependent variable from an independent variable.",
    keyConceptsTe: [
      {
        concept: "కార్ల్ పియర్సన్ సహసంబంధ గుణకం (r)",
        englishTerm: "Karl Pearson's Coefficient (r)",
        explanation:
          "రెండు చలరాశుల మధ్య సరళ సహసంబంధ తీవ్రతను కొలిచే సంఖ్యా రూపం. r విలువ ఎల్లప్పుడూ -1 నుండి +1 మధ్య ఉంటుంది (-1 \\le r \\le +1). ఇది మూల బిందువు మార్పు మరియు స్కేలు మార్పుల నుండి స్వతంత్రమైనది (Independent of origin and scale).",
      },
      {
        concept: "ప్రతిగమన గుణకాలు (byx మరియు bxy)",
        englishTerm: "Regression Coefficients",
        explanation:
          "Y పై X ప్రతిగమన గుణకం byx, X పై Y ప్రతిగమన గుణకం bxy. ఈ రెండు గుణకాల గుణకార మధ్యమం సహసంబంధ గుణకం అవుతుంది: r = \\pm \\sqrt{b_{yx} \\cdot b_{xy}}. రెండు గుణకాల గుర్తులు (Signs) ఒకేలా ఉంటాయి.",
      },
      {
        concept: "సంభావ్య దోషం (Probable Error - PE)",
        englishTerm: "Probable Error",
        explanation:
          "సహసంబంధ గుణకం యొక్క విశ్వసనీయతను పరీక్షించడానికి సంభావ్య దోషం వాడుతారు. PE = 0.6745 \\times \\frac{1 - r^2}{\\sqrt{n}}. r విలువ 6 PE కంటే ఎక్కువగా ఉంటే సహసంబంధం గణనీయమైనది (Significant).",
      },
    ],
    formulas: [
      {
        id: "formula_pearson_r",
        nameTe: "కార్ల్ పియర్సన్ సహసంబంధ గుణకం సూత్రం",
        nameEn: "Karl Pearson's Correlation Coefficient",
        latex: "r = \\frac{\\text{Cov}(X, Y)}{\\sigma_x \\sigma_y} = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{\\sqrt{\\sum (x - \\bar{x})^2 \\sum (y - \\bar{y})^2}}",
        symbolExplanationsTe: [
          { symbol: "r", explanation: "సహసంబంధ గుణకం (-1 నుండి +1)" },
          { symbol: "\\text{Cov}(X, Y)", explanation: "సహవిస్తృతి (Covariance)" },
          { symbol: "\\sigma_x, \\sigma_y", explanation: "X మరియు Y ల ప్రామాణిక విచలనాలు" },
        ],
        usageTe: "రెండు పరిమాణాత్మక చలరాశుల మధ్య సరళ సంబంధాన్ని కొలవడానికి.",
      },
      {
        id: "formula_regression_relation",
        nameTe: "సహసంబంధం మరియు ప్రతిగమన గుణకాల సంబంధం",
        nameEn: "Relation between r and regression coefficients",
        latex: "r = \\pm \\sqrt{b_{yx} \\times b_{xy}}",
        symbolExplanationsTe: [
          { symbol: "b_{yx}", explanation: "Y on X ప్రతిగమన గుణకం: r \\frac{\\sigma_y}{\\sigma_x}" },
          { symbol: "b_{xy}", explanation: "X on Y ప్రతిగమన గుణకం: r \\frac{\\sigma_x}{\\sigma_y}" },
        ],
        usageTe: "ప్రతిగమన సమీకరణాల వాలు నుండి r ను కనుగొనడానికి.",
      },
    ],
    workedExamples: [
      {
        id: "we_reg_01",
        titleTe: "ఉదాహరణ: ప్రతిగమన గుణకాల నుండి r మరియు భేదాలు కనుగొనుట",
        titleEn: "Example: Finding r from Regression Coefficients",
        problemTe: "రెండు ప్రతిగమన గుణకాలు b_{yx} = 0.8 మరియు b_{xy} = 0.45 అయితే, సహసంబంధ గుణకం r విలువ ఎంత?",
        givenDataTe: ["b_{yx} = 0.8 (ధనాత్మకం)", "b_{xy} = 0.45 (ధనాత్మకం)"],
        stepByStepSolutionTe: [
          {
            stepNumber: 1,
            description: "సూత్రాన్ని గుర్తించడం: r = \\sqrt{b_{yx} \\cdot b_{xy}} (రెండు గుణకాలు ధనాత్మకం కాబట్టి r కూడా ధనాత్మకం)",
            mathLatex: "r = + \\sqrt{0.8 \\times 0.45}",
          },
          {
            stepNumber: 2,
            description: "గుణకారం చేయడం: 0.8 \\times 0.45 = 0.36",
            mathLatex: "r = \\sqrt{0.36} = 0.6",
          },
        ],
        finalAnswerTe: "సహసంబంధ గుణకం r = 0.6 (ధనాత్మక మిత సహసంబంధం)",
        keyTakeawayTe: "b_{yx} మరియు b_{xy} ల గుర్తులు ఒకేలా ఉండాలి. రెండూ రుణాత్మకమైతే r కూడా రుణాత్మకమే అవుతుంది.",
      },
    ],
    commonMistakesTe: [
      {
        mistake: "ఒక గుణకం 1 కంటే పెద్దదిగా ఉన్నప్పుడు లెక్క తప్పని భావించడం.",
        correction: "రెండు గుణకాలలో ఒకటి 1 కంటే ఎక్కువ ఉండవచ్చు, కానీ రెండింటి గుణకారం (r^2) తప్పనిసరిగా 1 లేదా అంతకంటే తక్కువ ఉండాలి.",
        why: "ఎందుకంటే r^2 \\le 1.",
      },
    ],
    summaryPointsTe: [
      "సహసంబంధ గుణకం స్వతంత్రమైనది (రెండు దిశల్లోనూ r_{xy} = r_{yx}). కానీ ప్రతిగమన గుణకాలు సమానం కానక్కర్లేదు (b_{yx} \\ne b_{xy}).",
      "రెండు ప్రతిగమన రేఖలు ఒకదానికొకటి వాటి సగటుల బిందువు (\\bar{x}, \\bar{y}) వద్ద ఖండించుకుంటాయి.",
      "r = 0 అయితే రెండు ప్రతిగమన రేఖలు ఒకదానికొకటి లంబంగా (90 డిగ్రీలు) ఉంటాయి.",
      "r = \\pm 1 అయితే రెండు ప్రతిగమన రేఖలు ఏకీభవిస్తాయి (Coincide).",
    ],
    officialSyllabusMapping: "Paper II: Unit V - Correlation and Regression",
    sourceReferences: ["TGPSC Notification 07/G/ES/2026 Annexure-II"],
    lastVerifiedDate: "2026-10-30",
  },

  // ----------------------------------------------------
  // Paper I, Unit 11: History of Telangana & Statehood Movement
  // ----------------------------------------------------
  {
    id: "lesson_p1_telangana_history_statehood",
    topicId: "p1_history_telangana_statehood",
    subtopicId: "p1_tg_1969_movement",
    titleTe: "హైదరాబాద్ విలీనం, ముల్కీ నిబంధనలు మరియు 1969 ఉద్యమం",
    titleEn: "Hyderabad Annexation, Mulki Rules and 1969 Agitation",
    estimatedMinutes: 30,
    overviewTe:
      "1948 సెప్టెంబర్ ఆపరేషన్ పోలో ద్వారా హైదరాబాద్ సంస్థానం భారత యూనియన్‌లో విలీనమైనది. ఆ తర్వాత ముల్కీ నిబంధనల ఉల్లంఘనలు, ఆంధ్రప్రదేశ్ అవతరణ ఒప్పందాల ఉల్లంఘనకు వ్యతిరేకంగా 1969లో విద్యార్థులు చేపట్టిన తొలిదశ ప్రత్యేక తెలంగాణ ఉద్యమం చారిత్రాత్మకమైనది.",
    overviewEn:
      "Operation Polo in September 1948 integrated Hyderabad State into India. Subsequent violations of Gentlemen's Agreement and Mulki rules triggered the historic 1969 first-phase Telangana movement led by students.",
    keyConceptsTe: [
      {
        concept: "ఆపరేషన్ పోలో (Operation Polo)",
        englishTerm: "Police Action (Operation Polo)",
        explanation:
          "1948 సెప్టెంబర్ 13 నుండి 17 వరకు జరిగిన సైనిక చర్య. మేజర్ జనరల్ జె.ఎన్. చౌదరి నేతృత్వంలో నిజాం సైన్యం లొంగిపోయింది. సెప్టెంబర్ 17న హైదరాబాద్ విలీనం పూర్తయింది.",
      },
      {
        concept: "పెద్దమనుషుల ఒప్పందం (Gentlemen's Agreement)",
        englishTerm: "Gentlemen's Agreement (1956)",
        explanation:
          "1956 ఫిబ్రవరి 20న ఢిల్లీలోని హైదరాబాద్ హౌస్‌లో కుదిరిన ఒప్పందం. తెలంగాణ, ఆంధ్ర ప్రాంతాల నేతలు సంతకాలు చేశారు. తెలంగాణ ప్రాంతీయ కమిటీ (Regional Committee) ఏర్పాటు, ఉద్యోగాల్లో ముల్కీ రక్షణలు దీనిలోని ముఖ్య అంశాలు.",
      },
      {
        concept: "1969 ప్రత్యేక తెలంగాణ ఉద్యమం",
        englishTerm: "1969 Telangana Agitation",
        explanation:
          "పాల్వంచ థర్మల్ పవర్ స్టేషన్‌లో స్థానికేతరుల నియామకాలకు వ్యతిరేకంగా జనవరి 1969లో ఉద్యమం ప్రారంభమైంది. రవీంద్రనాథ్ ఆమరణ నిరాహారదీక్ష, ఉస్మానియా విద్యార్థుల పోరాటం, 369 మంది అమరుల త్యాగాలు ఈ ఉద్యమంలో కీలక ఘట్టాలు.",
      },
    ],
    summaryPointsTe: [
      "హైదరాబాద్ రాజ్య చివరి ప్రధాని మీర్ లాయక్ అలీ; నిజాం మీర్ ఉస్మాన్ అలీ ఖాన్.",
      "1952లో సిటీ కాలేజీ ఘటన మరియు తొలిసారి 'గైర్ ముల్కీ గో బ్యాక్' నినాదాలు వచ్చాయి.",
      "1969 ఉద్యమ సమయంలో ప్రధానమంత్రి ఇందిరా గాంధీ ఎనిమిది సూత్రాల పథకాన్ని (8-Point Formula) ఏప్రిల్ 1969లో ప్రకటించారు.",
      "1972 జై ఆంధ్ర ఉద్యమం తర్వాత 1973లో ఆరు సూత్రాల పథకం (6-Point Formula) మరియు 371-D రాజ్యాంగ అధికరణం అమల్లోకి వచ్చాయి.",
    ],
    officialSyllabusMapping: "Paper I: Unit 11 - History of Telangana with special emphasis on Movement for Telangana Statehood",
    sourceReferences: ["Telangana History & Culture - Telugu Akademi", "TGPSC Official Syllabus 07/G/ES/2026"],
    lastVerifiedDate: "2026-10-30",
  },
];
