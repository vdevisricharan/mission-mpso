export type ExamMode = "OMR" | "CBRT" | "UNKNOWN";
export type NegativeMarkingPolicy = "none" | "one_fourth" | "one_third" | "unconfirmed";
export type VerificationStatus = "verified" | "pending_official_announcement" | "unverified";

export interface ExamPaperConfig {
  id: "paper_1" | "paper_2";
  nameTe: string;
  nameEn: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  marksPerQuestion: number;
  language: "bilingual";
  syllabusUnitsCount: number;
}

export interface OfficialExamConfig {
  notificationNumber: string;
  notificationDate: string;
  recruitmentNameTe: string;
  recruitmentNameEn: string;
  authority: string;
  onlineApplicationStart: string;
  onlineApplicationEnd: string;
  tentativeExamMonth: string;
  confirmedExamDate: string | null;
  examMode: ExamMode;
  papers: ExamPaperConfig[];
  totalQuestions: number;
  totalMarks: number;
  negativeMarkingPolicy: NegativeMarkingPolicy;
  negativeMarkingPenalty: number;
  negativeMarkingNoteTe: string;
  negativeMarkingNoteEn: string;
  qualifyingMarks: {
    ocAndEws: number; // percentage (40%)
    bc: number; // percentage (35%)
    scStPh: number; // percentage (30%)
  };
  officialSourceUrl: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  configVersion: string;
}

export interface OfficialSourceDocument {
  id: string;
  titleTe: string;
  titleEn: string;
  documentType: "notification" | "syllabus" | "web_note" | "corrigendum" | "press_release";
  publicationDate: string;
  sourceUrl: string;
  fileSizeBytes?: number;
  isVerified: boolean;
  uploadedAt: string;
  notes?: string;
}

export const OFFICIAL_MPSO_EXAM_CONFIG: OfficialExamConfig = {
  notificationNumber: "07/G/ES/2026",
  notificationDate: "2026-10-28",
  recruitmentNameTe: "మండల్ ప్లానింగ్ & స్టాటిస్టికల్ ఆఫీసర్స్ / అసిస్టెంట్ స్టాటిస్టికల్ ఆఫీసర్స్",
  recruitmentNameEn: "Mandal Planning and Statistical Officers / Assistant Statistical Officers",
  authority: "TGPSC (Telangana Public Service Commission)",
  onlineApplicationStart: "2026-10-30",
  onlineApplicationEnd: "2026-11-27T17:00:00+05:30",
  tentativeExamMonth: "January 2027",
  confirmedExamDate: null,
  examMode: "UNKNOWN",
  papers: [
    {
      id: "paper_1",
      nameTe: "పేపర్ I: జనరల్ స్టడీస్ & జనరల్ ఎబిలిటీస్",
      nameEn: "Paper-I: General Studies and General Abilities",
      totalQuestions: 150,
      durationMinutes: 150,
      totalMarks: 150,
      marksPerQuestion: 1,
      language: "bilingual",
      syllabusUnitsCount: 13,
    },
    {
      id: "paper_2",
      nameTe: "పేపర్ II: స్టాటిస్టిక్స్ (డిగ్రీ స్థాయి - అందరికీ కామన్)",
      nameEn: "Paper-II: Statistics (Common for all) (Degree Level)",
      totalQuestions: 150,
      durationMinutes: 150,
      totalMarks: 150,
      marksPerQuestion: 1,
      language: "bilingual",
      syllabusUnitsCount: 8,
    },
  ],
  totalQuestions: 300,
  totalMarks: 300,
  negativeMarkingPolicy: "unconfirmed",
  negativeMarkingPenalty: 0,
  negativeMarkingNoteTe:
    "నోటిఫికేషన్ 07/G/ES/2026 లో నెగెటివ్ మార్కింగ్ నియమం స్పష్టంగా పేర్కొనబడలేదు. టిజిపిఎస్సి వెబ్ నోట్ లేదా హాల్ టికెట్ నిబంధనలు అధికారికంగా ధృవీకరించబడేవరకు నెగెటివ్ మార్కింగ్ అన్-కన్ఫర్మ్‌డ్‌గా పరిగణించబడుతుంది.",
  negativeMarkingNoteEn:
    "Negative marking is not explicitly specified in Notification 07/G/ES/2026. Until officially confirmed via TGPSC Web Note or Hall Ticket, it is marked as unconfirmed.",
  qualifyingMarks: {
    ocAndEws: 40,
    bc: 35,
    scStPh: 30,
  },
  officialSourceUrl: "https://websitenew.tgpsc.gov.in/",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-10-30T10:00:00Z",
  configVersion: "1.0.0",
};
