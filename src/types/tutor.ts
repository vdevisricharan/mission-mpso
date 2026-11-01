import { PaperId } from "./curriculum";

export type TutorLearningMode =
  | "teach_me" // బోధించు
  | "explain_simply" // సరళంగా వివరించు
  | "solve_together" // కలిసి సాధిద్దాం
  | "give_another_example" // మరో ఉదాహరణ
  | "test_understanding" // అవగాహన పరీక్షించు
  | "explain_mistake" // నా తప్పును వివరించు
  | "quick_revision"; // సత్వర పునశ్చరణ

export interface TutorModeOption {
  id: TutorLearningMode;
  titleTe: string;
  titleEn: string;
  descriptionTe: string;
  iconName: string;
}

export const TUTOR_MODES: TutorModeOption[] = [
  {
    id: "teach_me",
    titleTe: "బోధించు",
    titleEn: "Teach Me",
    descriptionTe: "మొదటినుండి స్పష్టమైన ఉదాహరణలతో పాఠం వివరించు",
    iconName: "BookOpen",
  },
  {
    id: "explain_simply",
    titleTe: "సరళంగా వివరించు",
    titleEn: "Explain Simply",
    descriptionTe: "రోజువారీ ఉదాహరణలతో తేలికైన తెలుగులో చెప్పండి",
    iconName: "Smile",
  },
  {
    id: "solve_together",
    titleTe: "కలిసి సాధిద్దాం",
    titleEn: "Solve Together",
    descriptionTe: "లెక్కను దశలవారీగా నాతో కలిసి పూర్తి చేయండి",
    iconName: "HelpCircle",
  },
  {
    id: "give_another_example",
    titleTe: "మరో ఉదాహరణ",
    titleEn: "Another Example",
    descriptionTe: "ఈ సూత్రంపై మరొక స్పష్టమైన లెక్క చూపించండి",
    iconName: "PlusCircle",
  },
  {
    id: "test_understanding",
    titleTe: "అవగాహన పరీక్షించు",
    titleEn: "Test Me",
    descriptionTe: "ఈ అంశంపై నన్ను ఒక చిన్న ప్రశ్న అడగండి",
    iconName: "CheckCircle2",
  },
  {
    id: "explain_mistake",
    titleTe: "నా తప్పును వివరించు",
    titleEn: "Explain My Mistake",
    descriptionTe: "నా సమాధానం ఎందుకు తప్పో, సరైన విధానమేంటో చెప్పండి",
    iconName: "AlertTriangle",
  },
  {
    id: "quick_revision",
    titleTe: "సత్వర పునశ్చరణ",
    titleEn: "Quick Revision",
    descriptionTe: "ముఖ్యమైన సూత్రాలు మరియు ముఖ్యాంశాలు ఒకేచోట",
    iconName: "Sparkles",
  },
];

export interface ChatMessage {
  id: string;
  sender: "user" | "tutor" | "system";
  contentTe: string;
  contentEn?: string;
  modeUsed?: TutorLearningMode;
  mathLatex?: string[];
  groundingSources?: {
    topicId: string;
    topicTitleTe: string;
    reference: string;
    isVerified: boolean;
  }[];
  suggestedFollowUpsTe?: string[];
  timestamp: string;
}

export interface TutorConversation {
  id: string;
  userId: string;
  topicId?: string;
  topicTitleTe?: string;
  paperId?: PaperId;
  messages: ChatMessage[];
  lastActiveAt: string;
  summaryTe?: string;
}
