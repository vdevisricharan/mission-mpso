import { ChatMessage, TutorConversation, TutorLearningMode } from "@/types/tutor";
import { CURRICULUM_LESSONS } from "../curriculum/lessons-data";
import { OFFICIAL_SYLLABUS_TOPICS } from "../curriculum/syllabus-data";

export interface TutorResponse {
  messageTe: string;
  mathLatex?: string[];
  sourcesUsed: { topicId: string; topicTitleTe: string; reference: string; isVerified: boolean }[];
  suggestedFollowUpsTe: string[];
}

export class TeluguAITutorEngine {
  /**
   * Process a student inquiry using RAG context and the selected pedagogical mode
   */
  static async processMessage(
    userId: string,
    userQuery: string,
    mode: TutorLearningMode = "teach_me",
    topicId?: string
  ): Promise<TutorResponse> {
    // 1. Retrieve relevant curriculum lessons and formulas
    const relevantLessons = topicId
      ? CURRICULUM_LESSONS.filter((l) => l.topicId === topicId)
      : CURRICULUM_LESSONS.filter(
          (l) =>
            l.titleTe.includes(userQuery) ||
            l.overviewTe.includes(userQuery) ||
            l.keyConceptsTe.some((c) => c.concept.includes(userQuery))
        );

    const activeLesson = relevantLessons.length > 0 ? relevantLessons[0] : CURRICULUM_LESSONS[0];
    const topic = OFFICIAL_SYLLABUS_TOPICS.find((t) => t.id === activeLesson.topicId);

    const sources = [
      {
        topicId: activeLesson.topicId,
        topicTitleTe: topic ? topic.titleTe : "సిలబస్ అంశం",
        reference: activeLesson.officialSyllabusMapping,
        isVerified: true,
      },
    ];

    // Check if an external LLM is configured (e.g. GEMINI_API_KEY)
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await this.callGeminiAPI(userQuery, mode, activeLesson);
        return {
          ...response,
          sourcesUsed: sources,
        };
      } catch (err) {
        console.warn("External AI call failed, using grounded pedagogical fallback:", err);
      }
    }

    // Grounded High-Fidelity Pedagogical Tutor Generator
    return this.generateGroundedPedagogicalResponse(userQuery, mode, activeLesson, sources);
  }

  /**
   * Grounded pedagogical response generation based on the 7 official modes
   */
  private static generateGroundedPedagogicalResponse(
    userQuery: string,
    mode: TutorLearningMode,
    lesson: (typeof CURRICULUM_LESSONS)[0],
    sources: any[]
  ): TutorResponse {
    const formulas = lesson.formulas || [];
    const firstFormula = formulas[0];
    const workedExample = lesson.workedExamples?.[0];

    switch (mode) {
      case "teach_me":
        return {
          messageTe: `నమస్కారం! **${lesson.titleTe}** గురించి సులభంగా అర్థం చేసుకుందాం.\n\n### 1. ఈ భావన ఏమిటి?\n${lesson.overviewTe}\n\n### 2. ముఖ్యమైన అంశాలు:\n${lesson.keyConceptsTe
            .slice(0, 3)
            .map((k) => `• **${k.concept}**: ${k.explanation}`)
            .join("\n")}\n\n### 3. ప్రామాణిక సూత్రం:\n${
            firstFormula
              ? `ఈ లెక్కలను సాధించడానికి ఉపయోగించే సూత్రం:\n$$\n${firstFormula.latex}\n$$\n**సూత్ర వివరణ:**\n` +
                firstFormula.symbolExplanationsTe
                  .map((s) => `  - $${s.symbol}$: ${s.explanation}`)
                  .join("\n")
              : ""
          }\n\nఇప్పుడు దీనిపై ఒక ఉదాహరణ లెక్క చూద్దామా?`,
          mathLatex: firstFormula ? [firstFormula.latex] : undefined,
          sourcesUsed: sources,
          suggestedFollowUpsTe: [
            "ఒక ఉదాహరణ లెక్క చూపించండి",
            "దీనిని మరింత సరళంగా వివరించండి",
            "నా అవగాహనను పరీక్షించండి",
          ],
        };

      case "explain_simply":
        return {
          messageTe: `సరే! ఎలాంటి సంక్లిష్టమైన గణిత పదాలు లేకుండా, చాలా సరళంగా అర్థం చేసుకుందాం.\n\nమీరు ఒక తరగతి గదిలో 10 మంది విద్యార్థుల మార్కులను పరిశీలిస్తున్నారు అనుకోండి. ఆ మార్కులన్నింటికీ ఒకే ఒక్క ప్రాతినిధ్య విలువ కావాలంటే మనం **సగటు** ఉపయోగిస్తాం.\n\n- **అంకమధ్యమం**: అందరి మార్కులనూ కలిపి, విద్యార్థుల సంఖ్యతో భాగించడం.\n- **మధ్యగతం**: అందరినీ తక్కువ నుండి ఎక్కువ మార్కుల వరుసలో నిలబెడితే, సరిగ్గా నడిమధ్యలో నిలబడే వ్యక్తి మార్కులు.\n- **బాహుళకం**: ఎక్కువ మంది విద్యార్థులు తెచ్చుకున్న ఒకే రకమైన మార్కులు.\n\nచూశారా, ఎంత సహజమో! ఏదైనా సందేహం ఉంటే అడగండి.`,
          sourcesUsed: sources,
          suggestedFollowUpsTe: [
            "కలిసి ఒక లెక్క సాధిద్దాం",
            "ఈ అంశంపై ప్రశ్నలు అడగండి",
            "సూత్రాలను గుర్తుంచుకోవడానికి ఉపాయం చెప్పండి",
          ],
        };

      case "solve_together":
        return {
          messageTe: `చాలా సంతోషం! మనం కలిసి ఒక లెక్కను దశలవారీగా సాధిద్దాం.\n\n**లెక్క:**\nఒక దత్తాంశంలో పరిశీలనలు: 10, 15, 20, 25, 30.\n\nమొదటి దశగా: అన్ని పరిశీలనల మొత్తం $\\sum x_i$ ఎంత వస్తుందో కూడి చెప్పండి?\n(సహాయం: 10 + 15 + 20 + 25 + 30)`,
          mathLatex: ["\\bar{x} = \\frac{\\sum x_i}{n}"],
          sourcesUsed: sources,
          suggestedFollowUpsTe: [
            "మొత్తం = 100",
            "తర్వాతి దశ చెప్పండి",
            "సూత్రం మరోసారి చూపించండి",
          ],
        };

      case "give_another_example":
        if (workedExample) {
          return {
            messageTe: `ఖచ్చితంగా! మీ కోసం మరొక ప్రామాణిక డిగ్రీ స్థాయి ఉదాహరణ:\n\n**సమస్య:**\n${workedExample.problemTe}\n\n**దత్తాంశం:**\n${workedExample.givenDataTe.map((d) => `• ${d}`).join("\n")}\n\n**దశలవారీ సాధన:**\n${workedExample.stepByStepSolutionTe
              .map(
                (s) =>
                  `**దశ ${s.stepNumber}:** ${s.description}${
                    s.mathLatex ? `\n$$\n${s.mathLatex}\n$$` : ""
                  }`
              )
              .join("\n")}\n\n**తుది సమాధానం:** ${workedExample.finalAnswerTe}\n\n**ముఖ్యాంశం:** ${workedExample.keyTakeawayTe}`,
            mathLatex: workedExample.stepByStepSolutionTe
              .filter((s) => s.mathLatex)
              .map((s) => s.mathLatex as string),
            sourcesUsed: sources,
            suggestedFollowUpsTe: [
              "ఇలాంటిదే నేను స్వయంగా సాధిస్తాను",
              "ఈ సూత్రంపై ఒక ప్రశ్న అడగండి",
              "సాధనలో 3వ దశను మళ్లీ చెప్పండి",
            ],
          };
        }
        return {
          messageTe: "ఈ అంశానికి సంబంధించిన ప్రామాణిక ఉదాహరణను పరిశీలిస్తున్నాం.",
          sourcesUsed: sources,
          suggestedFollowUpsTe: ["మరొక ప్రశ్న అడగండి"],
        };

      case "test_understanding":
        return {
          messageTe: `మీ అవగాహనను పరీక్షించుకోవడానికి ఒక చక్కటి ప్రశ్న:\n\n**ప్రశ్న:**\nఒక పౌనఃపున్య విభాజనంలో అంకమధ్యమం = 40 మరియు మధ్యగతం = 42 అయితే, ఆనుభావిక సూత్రం (Empirical Formula) ప్రకారం బాహుళకం (Mode) విలువ ఎంత?\n\n- (A) 44\n- (B) 46\n- (C) 41\n- (D) 38\n\nమీ సమాధానాన్ని పంపించండి, సరైనదో కాదో వివరణతో చూద్దాం!`,
          mathLatex: ["\\text{Mode} = 3(\\text{Median}) - 2(\\text{Mean})"],
          sourcesUsed: sources,
          suggestedFollowUpsTe: ["సమాధానం B (46)", "సమాధానం A (44)", "నాకు సూత్రం తెలియదు"],
        };

      case "explain_mistake":
        return {
          messageTe: `ఆందోళన పడకండి! సాధన చేసేటప్పుడు తప్పులు రావడం సహజం, వాటి ద్వారానే మనం నేర్చుకుంటాం.\n\nసాధారణంగా విద్యార్థులు చేసే తప్పు:\n${
            lesson.commonMistakesTe?.[0]?.mistake ||
            "సూత్రంలో సంఖ్యలను లేదా చిహ్నాలను తారుమారు చేయడం."
          }\n\n**సరైన విధానం:**\n${
            lesson.commonMistakesTe?.[0]?.correction ||
            "ముందుగా ఇచ్చిన విలువలను ఒక క్రమంలో రాసుకుని సూత్రంలో ప్రతిక్షేపించాలి."
          }\n\n**ఎందుకంటే:**\n${
            lesson.commonMistakesTe?.[0]?.why ||
            "ఇది భావనాత్మక స్పష్టతను ఇస్తుంది."
          }`,
          sourcesUsed: sources,
          suggestedFollowUpsTe: [
            "నా సమాధానాన్ని సరిచేశాను",
            "మరోసారి ఈ ప్రశ్నను ప్రయత్నిస్తాను",
            "సత్వర సారాంశం చూపించండి",
          ],
        };

      case "quick_revision":
        return {
          messageTe: `### 🎯 సత్వర పునశ్చరణ (Quick Revision)\n\n**అంశం:** ${lesson.titleTe}\n\n${lesson.summaryPointsTe
            .map((p, i) => `${i + 1}. ${p}`)
            .join("\n\n")}\n\nఈ అంశంలో మీకు ఇంకా ఏమైనా సందేహాలు ఉన్నాయా?`,
          sourcesUsed: sources,
          suggestedFollowUpsTe: [
            "ఈ అంశంపై క్విజ్ ప్రారంభించు",
            "ముఖ్యమైన సూత్రాలను మాత్రమే చూపించు",
            "తర్వాతి అంశానికి వెళ్దాం",
          ],
        };
    }
  }

  /**
   * External LLM Caller (optional when GEMINI_API_KEY is present)
   */
  private static async callGeminiAPI(
    userQuery: string,
    mode: TutorLearningMode,
    lesson: any
  ): Promise<Omit<TutorResponse, "sourcesUsed">> {
    const prompt = `You are a respectful, patient, highly competent Telugu-medium teacher preparing a candidate for TGPSC MPSO (Mandal Planning & Statistical Officer) / ASO exam.
Target topic: ${lesson.titleTe} (${lesson.titleEn})
Approved context: ${lesson.overviewTe}
Mode requested: ${mode}
Student query: ${userQuery}

Rules:
1. Explain in clear, natural, respectful Telugu (తెలుగు).
2. For mathematical symbols, keep international notation like \\bar{x}, \\sigma, \\mu and explain symbol meanings in Telugu.
3. Be encouraging and academically rigorous.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) throw new Error("Gemini API returned error: " + res.statusText);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "క్షమించండి, సమాధానం రూపొందించడంలో సమస్య ఎదురైంది.";

    return {
      messageTe: text,
      suggestedFollowUpsTe: ["మరింత వివరించండి", "ఒక ఉదాహరణ ఇవ్వండి", "నాకు ఒక ప్రశ్న వేయండి"],
    };
  }
}
