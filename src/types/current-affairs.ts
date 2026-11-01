import { Question } from "./question";

export type CurrentAffairsCategory =
  | "telangana_policies"
  | "telangana_economy"
  | "science_tech"
  | "environment_disaster"
  | "national_international"
  | "awards_sports";

export interface CurrentAffairsItem {
  id: string;
  category: CurrentAffairsCategory;
  titleTe: string;
  titleEn: string;
  eventDate: string; // YYYY-MM-DD
  publishedDate: string; // YYYY-MM-DD
  summaryTe: string;
  summaryEn?: string;
  bulletPointsTe: string[];
  officialSourceUrl: string;
  sourceOrganization: string;
  isVerifiedByAdmin: boolean;
  relatedQuestions?: Question[];
  tags: string[];
}
