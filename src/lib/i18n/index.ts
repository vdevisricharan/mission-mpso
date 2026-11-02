"use client";

import { usePreferences, Language } from "@/components/layout/TextSizeProvider";

export const TRANSLATIONS = {
  te: {
    // Navigation
    nav_home: "హోమ్",
    nav_learn: "నేర్చుకోండి",
    nav_practice: "ప్రాక్టీస్",
    nav_progress: "నా ప్రగతి",
    nav_tutor: "AI ట్యూటర్",
    nav_mocks: "మాక్ టెస్ట్‌లు",
    nav_mistakes: "తప్పుల పుస్తకం",
    nav_study_plan: "చదువు ప్రణాళిక",
    nav_current_affairs: "కరెంట్ అఫైర్స్",
    nav_settings: "సెట్టింగ్‌లు",
    nav_admin: "అడ్మిన్",
    role_student: "స్టూడెంట్",
    role_admin: "అడ్మిన్ మోడ్",
    switch_to_student: "స్టూడెంట్‌గా మారండి",
    switch_to_admin: "అడ్మిన్‌గా మారండి",
    logout: "లాగ్ అవుట్ (Logout)",

    // Header & Meta
    notification_label: "నోటిఫికేషన్ 07/G/ES/2026",
    exam_tentative_month: "జనవరి 2027",
    font_size_tooltip: "ఫాంట్ పరిమాణం మార్చండి",
    language_toggle_tooltip: "భాష మార్చండి (Change Language)",

    // Dashboard
    greeting_prefix: "శుభోదయం",
    daily_affirmation: "ఈరోజు మనం కొంచెం ముందుకు వెళ్దాం. మీ లక్ష్యం కోసం రూపొందించిన నేటి చదువు ప్రణాళిక సిద్ధంగా ఉంది.",
    ask_ai_tutor: "AI ట్యూటర్‌ని అడగండి",
    official_source_pill: "అధికారిక నిబంధనల ఆధారం",
    verified_pill: "ధృవీకరించబడింది ✓",
    post_name: "మండల్ ప్లానింగ్ & స్టాటిస్టికల్ ఆఫీసర్స్ (MPSO / ASO)",
    exam_time_label: "పరీక్ష సమయం",
    tentative_tag: "(తాత్కాలికం)",
    total_questions_label: "మొత్తం ప్రశ్నలు: 300 (పేపర్ I: 150 + పేపర్ II: 150)",
    take_mock_test: "మాక్ టెస్ట్ రాయండి",

    // Metric Cards
    metric_target_time: "లక్ష్య సమయం",
    minutes_unit: "నిమిషాలు",
    daily_consistency: "రోజూ క్రమం తప్పకుండా",
    metric_completed_tasks: "పూర్తయిన పనులు",
    completed_percent: "పూర్తయింది",
    metric_mistake_book: "తప్పుల పుస్తకం",
    questions_unit: "ప్రశ్నలు",
    click_to_review: "సమీక్షించడానికి క్లిక్ చేయండి",
    metric_today_revision: "నేటి పునశ్చరణ",
    items_unit: "అంశాలు",
    spaced_repetition_queue: "స్పేస్డ్ రివిజన్ క్యూ",

    // Study Plan Section
    today_plan_title: "నేటి చదువు ప్రణాళిక (Today's Plan)",
    today_plan_sub: "మీ అభ్యాస పురోగతి ఆధారంగా రూపొందించిన టాస్కులు",
    tasks_completed_count: "పూర్తయ్యాయి",
    start_task: "ప్రారంభించండి",

    // Quick Links
    official_syllabus_card: "అధికారిక సిలబస్",
    official_syllabus_desc: "పేపర్ I & II అంశాలు చదవండి",
    topic_practice_card: "టాపిక్ వారీ ప్రాక్టీస్",
    topic_practice_desc: "ధృవీకరించిన ప్రశ్నలు",
    progress_report_card: "నా ప్రగతి రిపోర్ట్",
    progress_report_desc: "సామర్థ్య స్థాయిల విశ్లేషణ",

    // Curriculum & Learn
    curriculum_title: "నేర్చుకోండి — అధికారిక సిలబస్ & పాఠాలు",
    curriculum_desc: "తెలంగాణ పబ్లిక్ సర్వీస్ కమిషన్ MPSO/ASO నోటిఫికేషన్ నెం. 07/G/ES/2026 అనుబంధం-II ఆధారంగా రూపొందించిన పూర్తి పాఠ్య ప్రణాళిక.",
    paper_2_title: "పేపర్ II: స్టాటిస్టిక్స్",
    paper_2_subtitle: "డిగ్రీ స్థాయి • 8 యూనిట్లు • 150 మార్కులు",
    paper_1_title: "పేపర్ I: జనరల్ స్టడీస్",
    paper_1_subtitle: "తెలంగాణ & జాతీయ • 13 విభాగాలు • 150 మార్కులు",
    unit_label: "యూనిట్",
    read_lesson: "పాఠం చదవండి",
    practice_topic: "ప్రాక్టీస్ చేయండి",
    back_to_syllabus: "సిలబస్ జాబితాకు తిరిగి వెళ్లండి",
    study_duration: "నిమిషాల చదువు",
    key_concepts: "కీలక భావనలు (Key Concepts)",
    formulas_title: "ముఖ్యమైన గణిత సూత్రాలు (Formulas)",
    formula_symbols_desc: "సూత్రంలోని చిహ్నాల వివరణ:",
    sample_calculation: "ఉదాహరణ లెక్క:",
    worked_examples_title: "దశలవారీగా సాధించిన ఉదాహరణలు (Worked Examples)",
    problem_label: "సమస్య:",
    given_data_label: "ఇచ్చిన దత్తాంశం:",
    step_label: "దశ",
    final_answer_label: "తుది సమాధానం:",
    key_takeaway_label: "ముఖ్యాంశం:",
    common_mistakes_title: "విద్యార్థులు సాధారణంగా చేసే తప్పులు & జాగ్రత్తలు",
    mistake_label: "❌ తప్పు:",
    correction_label: "✓ సరైన విధానం:",
    reason_label: "కారణం:",
    quick_summary_title: "🎯 సారాంశ ముఖ్యాంశాలు (Quick Summary)",
    lesson_finished_prompt: "ఈ పాఠం పూర్తయిందా? మీ అవగాహనను తక్షణమే పరీక్షించుకోండి.",
    start_practice_quiz: "ప్రాక్టీస్ క్విజ్ ప్రారంభించండి",

    // Quiz & Practice
    quiz_completed_title: "క్విజ్ పూర్తయింది!",
    quiz_completed_desc: "మీ ప్రయత్నం నమోదు చేయబడింది. ఫలితాల సారాంశం క్రింద చూడండి.",
    total_q_label: "మొత్తం ప్రశ్నలు",
    correct_label: "సరైనవి",
    incorrect_label: "తప్పులు",
    accuracy_label: "ఖచ్చితత్వం",
    mistakes_saved_note: "తప్పులు 'తప్పుల పుస్తకం' (Mistake Book) లో భద్రపరచబడ్డాయి",
    mistakes_saved_desc: "మీరు తప్పు చేసిన ప్రశ్నలు స్పేస్డ్ రివిజన్ షెడ్యూల్‌లోకి జోడించబడ్డాయి. తదుపరి సమీక్ష రేపు నిర్ణయించబడింది.",
    go_to_home: "హోమ్‌కి వెళ్లండి",
    view_mistake_book: "తప్పుల పుస్తకం చూడండి",
    question_counter: "ప్రశ్న",
    submit_quiz: "క్విజ్ సమర్పించండి (Submit)",
    next_question: "తర్వాతి ప్రశ్న",
    previous_question: "మునుపటి",
    correct_feedback: "✓ అద్భుతం! సరైన సమాధానం.",
    incorrect_feedback: "✗ మీ సమాధానం తప్పు.",
    formula_used_label: "ఉపయోగించిన సూత్రం:",
    why_mistake_prompt: "ఈ తప్పు ఏ కారణం వల్ల జరిగింది? (స్వీయ సమీక్ష):",
    mistake_concept: "భావన అర్థం కాలేదు",
    mistake_formula: "సూత్రం గుర్తురాలేదు",
    mistake_calc: "లెక్కించడంలో తప్పు",
    mistake_reading: "ప్రశ్న సరిగ్గా చదవలేదు",

    // Mock Exams
    mock_page_title: "పూర్తి స్థాయి మాక్ పరీక్షలు (Mock Examinations)",
    mock_page_desc: "కమిషన్ నిబంధనల ప్రకారం 150 ప్రశ్నలు, 150 నిమిషాలు, కౌంట్‌డౌన్ టైమర్ మరియు OMR-శైలి ప్రశ్నల ప్యాలెట్‌తో నిజమైన పరీక్షా అనుభవాన్ని పొందండి.",
    negative_marking_warning: "నెగెటివ్ మార్కింగ్: అధికారికంగా ఇంకా నిర్ధారించబడలేదు",
    negative_marking_notice: "నోటిఫికేషన్ 07/G/ES/2026 లో నెగెటివ్ మార్కింగ్ నియమం పేర్కొనబడలేదు. అందువల్ల తప్పు సమాధానాలకు ఎలాంటి పెనాల్టీ విధించబడదు.",
    start_exam_btn: "పరీక్ష ప్రారంభించండి",
    submit_exam_btn: "సమర్పించండి",
    finish_exam_btn: "పరీక్షను పూర్తి చేయండి",
    mark_for_review_btn: "రివ్యూ కోసం గుర్తించు (Mark for Review)",
    clear_response_btn: "సమాధానం తొలగించు",
    question_palette_title: "ప్రశ్నల ప్యాలెట్ (Question Palette)",
    status_answered: "సమాధానం ఇచ్చినవి",
    status_unanswered: "సమాధానం ఇవ్వనివి",
    status_marked: "రివ్యూ కోసం ఉంచినవి",
    status_not_visited: "చూడని ప్రశ్నలు",
    confirm_submit_title: "పరీక్షను సమర్పించాలనుకుంటున్నారా?",
    confirm_submit_desc: "సమర్పించిన తర్వాత సమాధానాలను మార్చడం సాధ్యం కాదు. మీ పరీక్షా ఫలితాలు మరియు విశ్లేషణ వెంటనే ప్రదర్శించబడతాయి.",
    resume_exam_btn: "తిరిగి రాయండి",
    confirm_submit_action: "ఖచ్చితంగా సమర్పించు",

    // Mistakes Page
    mistakes_title: "తప్పుల పుస్తకం (Mistake Book)",
    mistakes_desc: "మీరు ప్రాక్టీస్ లేదా మాక్ పరీక్షలలో తప్పు చేసిన ప్రతి ప్రశ్న ఇక్కడ భద్రపరచబడుతుంది. తప్పుల నుండి నేర్చుకోవడమే అసలైన విజయం.",
    pending_reviews_label: "పెండింగ్ సమీక్షలు",
    resolved_label: "పరిష్కరించబడినవి",
    your_answer_label: "మీరు పెట్టిన సమాధానం:",
    correct_answer_label: "సరైన సమాధానం:",
    explanation_solution_label: "వివరణ & పరిష్కార మార్గం:",
    solve_with_tutor: "AI ట్యూటర్‌తో ఈ లెక్క సాధించండి",
    next_revision_label: "తదుపరి పునశ్చరణ: రేపు షెడ్యూల్ చేయబడింది",

    // Tutor Chat
    tutor_header_title: "తెలుగు AI ట్యూటర్ (Telugu Learning Companion)",
    tutor_header_sub: "సిలబస్ ఆధారిత ధృవీకృత సమాధానాలు • TGPSC 07/G/ES/2026",
    tutor_input_placeholder: "ఈ అంశంలో మీ సందేహాన్ని అడగండి...",
    tutor_listening: "వింటున్నాను...",
    listen_in_telugu: "తెలుగులో వినండి (Audio)",

    // Settings
    settings_title: "సెట్టింగ్‌లు (Settings)",
    settings_desc: "మీ అభ్యాస అనుభవాన్ని, ఫాంట్ పరిమాణాన్ని మరియు రోజువారీ సమయాన్ని మీ సౌలభ్యానికి తగినట్లు మార్చుకోండి.",
    student_name_label: "విద్యార్థిని పేరు (Display Name)",
    text_size_label: "అక్షరాల పరిమాణం (Text Size)",
    language_label: "ప్రాథమిక భాష (Language)",
    daily_study_time_label: "రోజువారీ చదువు సమయం",
    voice_learning_label: "తెలుగు వాయిస్ ట్యూటర్ (Voice Learning)",
    voice_learning_sub: "వివరణలను తెలుగులో చదివి వినిపిస్తుంది",
    save_settings_btn: "సెట్టింగ్‌లను భద్రపరచండి (Save)",
    saved_success: "✓ సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి!",
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_learn: "Learn",
    nav_practice: "Practice",
    nav_progress: "Progress",
    nav_tutor: "AI Tutor",
    nav_mocks: "Mock Tests",
    nav_mistakes: "Mistake Book",
    nav_study_plan: "Study Plan",
    nav_current_affairs: "Current Affairs",
    nav_settings: "Settings",
    nav_admin: "Admin",
    role_student: "Student",
    role_admin: "Admin Mode",
    switch_to_student: "Switch to Student",
    switch_to_admin: "Switch to Admin",
    logout: "Log out",

    // Header & Meta
    notification_label: "Notification 07/G/ES/2026",
    exam_tentative_month: "January 2027",
    font_size_tooltip: "Change font size",
    language_toggle_tooltip: "Switch language (భాష మార్చండి)",

    // Dashboard
    greeting_prefix: "Good morning",
    daily_affirmation: "Let's take another confident step forward today. Your personalized study plan is ready.",
    ask_ai_tutor: "Ask AI Tutor",
    official_source_pill: "Official Source of Truth",
    verified_pill: "Verified ✓",
    post_name: "Mandal Planning and Statistical Officers / Assistant Statistical Officers",
    exam_time_label: "Examination Schedule",
    tentative_tag: "(Tentative)",
    total_questions_label: "Total Questions: 300 (Paper I: 150 + Paper II: 150)",
    take_mock_test: "Take Mock Exam",

    // Metric Cards
    metric_target_time: "Target Study Time",
    minutes_unit: "minutes",
    daily_consistency: "Daily habit tracker",
    metric_completed_tasks: "Completed Tasks",
    completed_percent: "completed",
    metric_mistake_book: "Mistake Book",
    questions_unit: "questions",
    click_to_review: "Click to review errors",
    metric_today_revision: "Today's Revision",
    items_unit: "items",
    spaced_repetition_queue: "Spaced repetition queue",

    // Study Plan Section
    today_plan_title: "Today's Study Plan",
    today_plan_sub: "Tasks prioritized based on your baseline accuracy and knowledge gaps",
    tasks_completed_count: "completed",
    start_task: "Start Task",

    // Quick Links
    official_syllabus_card: "Official Syllabus",
    official_syllabus_desc: "Browse Paper I & II units",
    topic_practice_card: "Topic-wise Practice",
    topic_practice_desc: "Verified exam questions",
    progress_report_card: "My Progress Report",
    progress_report_desc: "Topic mastery analytics",

    // Curriculum & Learn
    curriculum_title: "Learn — Official Syllabus & Lessons",
    curriculum_desc: "Structured curriculum mapped directly to TGPSC MPSO/ASO Notification No. 07/G/ES/2026 Annexure-II.",
    paper_2_title: "Paper II: Statistics",
    paper_2_subtitle: "Degree Level • 8 Units • 150 Marks",
    paper_1_title: "Paper I: General Studies",
    paper_1_subtitle: "Telangana & National • 13 Units • 150 Marks",
    unit_label: "Unit",
    read_lesson: "Read Lesson",
    practice_topic: "Practice Topic",
    back_to_syllabus: "Back to Syllabus",
    study_duration: "min read",
    key_concepts: "Key Concepts",
    formulas_title: "Essential Mathematical Formulas",
    formula_symbols_desc: "Notation and Symbol Definitions:",
    sample_calculation: "Worked Calculation:",
    worked_examples_title: "Step-by-Step Worked Examples",
    problem_label: "Problem:",
    given_data_label: "Given Data:",
    step_label: "Step",
    final_answer_label: "Final Answer:",
    key_takeaway_label: "Core Takeaway:",
    common_mistakes_title: "Common Student Misconceptions & Corrections",
    mistake_label: "❌ Mistake:",
    correction_label: "✓ Correct Approach:",
    reason_label: "Why:",
    quick_summary_title: "🎯 Summary & Key Points",
    lesson_finished_prompt: "Finished reading? Test your understanding immediately.",
    start_practice_quiz: "Start Practice Quiz",

    // Quiz & Practice
    quiz_completed_title: "Quiz Completed!",
    quiz_completed_desc: "Your attempt has been recorded. Review your performance summary below.",
    total_q_label: "Total Questions",
    correct_label: "Correct",
    incorrect_label: "Incorrect",
    accuracy_label: "Accuracy",
    mistakes_saved_note: "Errors saved to Mistake Book",
    mistakes_saved_desc: "Questions answered incorrectly have been queued for spaced repetition starting tomorrow.",
    go_to_home: "Return to Home",
    view_mistake_book: "Open Mistake Book",
    question_counter: "Question",
    submit_quiz: "Submit Quiz",
    next_question: "Next Question",
    previous_question: "Previous",
    correct_feedback: "✓ Excellent! Correct Answer.",
    incorrect_feedback: "✗ Incorrect Answer.",
    formula_used_label: "Formula Applied:",
    why_mistake_prompt: "Why did this error occur? (Self-Diagnosis):",
    mistake_concept: "Concept Misunderstanding",
    mistake_formula: "Formula Confusion",
    mistake_calc: "Calculation Error",
    mistake_reading: "Question Reading Mistake",

    // Mock Exams
    mock_page_title: "Full-Length Mock Examinations",
    mock_page_desc: "Experience authentic test conditions with 150 questions, 150 minutes, countdown timer, and OMR-style navigation palette.",
    negative_marking_warning: "Negative Marking: Unconfirmed in Notification",
    negative_marking_notice: "Notification 07/G/ES/2026 does not specify negative marking. Therefore, zero penalty is configured by default.",
    start_exam_btn: "Start Examination",
    submit_exam_btn: "Submit Exam",
    finish_exam_btn: "Finish Examination",
    mark_for_review_btn: "Mark for Review",
    clear_response_btn: "Clear Response",
    question_palette_title: "Question Palette",
    status_answered: "Answered",
    status_unanswered: "Unanswered",
    status_marked: "Marked for Review",
    status_not_visited: "Not Visited",
    confirm_submit_title: "Ready to submit your examination?",
    confirm_submit_desc: "Answers cannot be modified after submission. Your score and detailed topic report will be generated immediately.",
    resume_exam_btn: "Return to Test",
    confirm_submit_action: "Confirm & Submit",

    // Mistakes Page
    mistakes_title: "Mistake Book (తప్పుల పుస్తకం)",
    mistakes_desc: "Every wrong attempt is securely logged here to convert mistakes into mastery through spaced review.",
    pending_reviews_label: "Pending Reviews",
    resolved_label: "Resolved",
    your_answer_label: "Your Submitted Answer:",
    correct_answer_label: "Official Correct Answer:",
    explanation_solution_label: "Explanation & Method:",
    solve_with_tutor: "Solve with AI Tutor",
    next_revision_label: "Next review: Scheduled for tomorrow",

    // Tutor Chat
    tutor_header_title: "Telugu AI Tutor (Learning Companion)",
    tutor_header_sub: "Curriculum-grounded pedagogical tutoring • TGPSC 07/G/ES/2026",
    tutor_input_placeholder: "Ask a question about this topic in Telugu or English...",
    tutor_listening: "Listening...",
    listen_in_telugu: "Listen in Telugu (Audio)",

    // Settings
    settings_title: "Settings & Preferences",
    settings_desc: "Customize your learning experience, text size, and daily study capacity.",
    student_name_label: "Student Display Name",
    text_size_label: "Text Size",
    language_label: "Primary Language",
    daily_study_time_label: "Daily Study Capacity",
    voice_learning_label: "Telugu Voice Tutor (Audio)",
    voice_learning_sub: "Reads explanations aloud in natural Telugu",
    save_settings_btn: "Save Preferences",
    saved_success: "✓ Preferences saved successfully!",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.te;

export function useTranslation() {
  const { language, setLanguage } = usePreferences();

  const t = (key: TranslationKey): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.te;
    return (langDict as any)[key] || TRANSLATIONS.te[key] || key;
  };

  /**
   * Helper to pick either English or Telugu field from any object
   * based on current language preference.
   */
  const pick = <T extends Record<string, any>>(
    obj: T | undefined | null,
    field: string
  ): string => {
    if (!obj) return "";
    const enField = `${field}En`;
    const teField = `${field}Te`;

    if (language === "en" && obj[enField]) {
      return obj[enField];
    }
    return obj[teField] || obj[enField] || "";
  };

  return {
    language,
    setLanguage,
    t,
    pick,
    isTelugu: language === "te",
    isEnglish: language === "en",
  };
}
