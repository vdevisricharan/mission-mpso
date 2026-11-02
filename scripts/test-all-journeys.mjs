import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "UX_TEST_SCREENSHOTS");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runJourneys() {
  console.log("=== STARTING FULL STUDENT JOURNEY SIMULATION (12 JOURNEYS + ADMIN) ===");
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 360, height: 800 }, // Android phone viewport
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  const journeyResults = [];

  const recordJourney = (id, name, status, details = {}) => {
    journeyResults.push({ id, name, status, details });
    console.log(`[JOURNEY ${id}] ${name}: ${status}`);
  };

  // ----------------------------------------------------
  // JOURNEY 01 — First Visit & Login
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 01: First Visit ---");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J01_01_landing_initial.png") });

    const loginLink = page.locator('a[href="/login"]').first();
    await loginLink.click();
    await page.waitForURL("**/login");
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J01_02_login_screen.png") });

    const studentLoginBtn = page.locator("button:has-text('భాగ్య')").first();
    await studentLoginBtn.click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J01_03_dashboard_after_login.png") });

    recordJourney("01", "First Visit & Login", "PASSED", { destination: page.url() });
  } catch (err) {
    recordJourney("01", "First Visit & Login", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 02 — Onboarding Flow
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 02: Onboarding Flow ---");
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J02_01_onboarding_form.png") });

    const nameInput = page.locator("input[placeholder='ఉదా: భాగ్య']");
    if (await nameInput.isVisible()) {
      await nameInput.fill("భాగ్య గౌడ్");
    }
    const continueBtn = page.locator("button:has-text('ప్రారంభ నిర్ధారణ పరీక్ష')").first();
    await continueBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J02_02_onboarding_to_diagnostic.png") });

    recordJourney("02", "Onboarding Preferences", "PASSED");
  } catch (err) {
    recordJourney("02", "Onboarding Preferences", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 03 — Diagnostic Test
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 03: Diagnostic Test ---");
    const startDiagBtn = page.locator("button:has-text('పరీక్ష ప్రారంభించండి')").first();
    if (await startDiagBtn.isVisible()) {
      await startDiagBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J03_01_diagnostic_q1.png") });

      // Answer 2 questions
      for (let i = 0; i < 2; i++) {
        const optionBtn = page.locator("button:has-text('A')").or(page.locator("button:has-text('B')")).first();
        if (await optionBtn.isVisible()) {
          await optionBtn.click();
        }
        await page.waitForTimeout(300);
        const nextBtn = page.locator("button:has-text('తర్వాతి ప్రశ్న')").first();
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(300);
        }
      }
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J03_02_diagnostic_midway.png") });

      // Finish button if on last question or click directly
      const finishBtn = page.locator("button:has-text('నిర్ధారణ పరీక్ష ముగించండి')").first();
      if (await finishBtn.isVisible()) {
        await finishBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J03_03_diagnostic_results.png") });
      }
    }
    recordJourney("03", "Diagnostic Assessment", "PASSED");
  } catch (err) {
    recordJourney("03", "Diagnostic Assessment", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 04 — Daily Dashboard & Controls
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 04: Daily Dashboard ---");
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J04_01_dashboard_view.png") });

    // Test text size toggle in header
    const textSizeBtn = page.locator('button[title*="పరిమాణం"]').or(page.locator('button:has-text("A+")')).first();
    if (await textSizeBtn.isVisible()) {
      await textSizeBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J04_02_dashboard_large_text.png") });
      // Reset back
      await textSizeBtn.click();
      await textSizeBtn.click();
    }

    recordJourney("04", "Daily Dashboard", "PASSED");
  } catch (err) {
    recordJourney("04", "Daily Dashboard", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 05 — Learning a Statistics Topic
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 05: Learning a Statistics Topic ---");
    await page.goto(`${BASE_URL}/learn`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J05_01_curriculum_catalog.png") });

    // Open Probability lesson
    await page.goto(`${BASE_URL}/learn/p2_probability`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J05_02_probability_lesson.png") });

    const mathFormula = page.locator(".katex").first();
    const hasMath = await mathFormula.isVisible().catch(() => false);
    console.log(`[Journey 05] LaTeX formula rendered: ${hasMath}`);

    recordJourney("05", "Learning a Statistics Topic", "PASSED", { hasMath });
  } catch (err) {
    recordJourney("05", "Learning a Statistics Topic", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 06 — AI Tutor Interaction
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 06: AI Tutor Interaction ---");
    await page.goto(`${BASE_URL}/tutor`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J06_01_tutor_initial.png") });

    // Click quick suggested follow-up chip
    const followUpChip = page.locator("button:has-text('సంభావ్యత')").or(page.locator("button:has-text('కేంద్రీయ')")).first();
    if (await followUpChip.isVisible()) {
      await followUpChip.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J06_02_tutor_chip_response.png") });
    }

    // Type a specific question: "Bayes Theorem ని సులభంగా వివరించు"
    const chatInput = page.locator("input[placeholder*='అడగండి']").or(page.locator("input[type='text']")).first();
    if (await chatInput.isVisible()) {
      await chatInput.fill("Bayes Theorem ని సులభంగా వివరించు");
      const sendBtn = page.locator("button:has(svg.lucide-send)").or(page.locator("button:has-text('అడగండి')")).first();
      await sendBtn.click();
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J06_03_tutor_custom_response.png") });
    }

    recordJourney("06", "AI Tutor Interaction", "PASSED");
  } catch (err) {
    recordJourney("06", "AI Tutor Interaction", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 07 — Topic-Wise Practice Quiz
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 07: Topic-Wise Practice Quiz ---");
    await page.goto(`${BASE_URL}/practice?topicId=p2_probability`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J07_01_practice_quiz_q1.png") });

    // Select Option A
    const quizOption = page.locator("button:has-text('A')").first();
    if (await quizOption.isVisible()) {
      await quizOption.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J07_02_practice_feedback.png") });
    }

    recordJourney("07", "Topic-Wise Practice Quiz", "PASSED");
  } catch (err) {
    recordJourney("07", "Topic-Wise Practice Quiz", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 08 — Mistakes Review
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 08: Mistakes Review ---");
    await page.goto(`${BASE_URL}/mistakes`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J08_01_mistakes_screen.png") });

    recordJourney("08", "Mistakes Review", "PASSED");
  } catch (err) {
    recordJourney("08", "Mistakes Review", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 09 — Mock Examination
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 09: Mock Examination ---");
    await page.goto(`${BASE_URL}/mocks`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J09_01_mocks_list.png") });

    // Start Mini Mock
    const startMockBtn = page.locator('a[href*="/mocks/"]').first();
    await startMockBtn.click();
    await page.waitForURL("**/mocks/*", { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J09_02_mock_exam_in_progress.png") });

    // Select option A
    const mockOption = page.locator("button:has-text('A')").first();
    if (await mockOption.isVisible()) {
      await mockOption.click();
      await page.waitForTimeout(300);
    }

    // Toggle Mark for review
    const markReviewBtn = page.locator("button:has-text('రివ్యూ')").first();
    if (await markReviewBtn.isVisible()) {
      await markReviewBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J09_03_mock_marked_review.png") });
    }

    // Submit mock
    const submitBtn = page.locator("button:has-text('సమర్పించండి')").first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J09_04_mock_submit_modal.png") });

      const confirmSubmitBtn = page.locator(".fixed.inset-0 button:has-text('సమర్పించు')").or(page.locator("button:has-text('ఖచ్చితంగా సమర్పించు')")).first();
      if (await confirmSubmitBtn.isVisible()) {
        await confirmSubmitBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J09_05_mock_results.png") });
      }
    }

    recordJourney("09", "Mock Examination Simulator", "PASSED");
  } catch (err) {
    recordJourney("09", "Mock Examination Simulator", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 10 — Revision System
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 10: Revision ---");
    await page.goto(`${BASE_URL}/revision`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J10_01_revision_queue.png") });

    recordJourney("10", "Revision Module", "PASSED");
  } catch (err) {
    recordJourney("10", "Revision Module", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 11 — Progress Dashboard
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 11: Progress Dashboard ---");
    await page.goto(`${BASE_URL}/progress`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J11_01_progress_charts.png") });

    recordJourney("11", "Progress Analytics", "PASSED");
  } catch (err) {
    recordJourney("11", "Progress Analytics", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // JOURNEY 12 — Inactivity & Return
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Journey 12: Inactivity & Return ---");
    await page.goto(`${BASE_URL}/study-plan`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "J12_01_study_plan.png") });

    recordJourney("12", "Study Plan & Resuming", "PASSED");
  } catch (err) {
    recordJourney("12", "Study Plan & Resuming", "FAILED", { error: err.message });
  }

  // ----------------------------------------------------
  // ADMIN JOURNEY — Admin Portal
  // ----------------------------------------------------
  try {
    console.log("\n--- Testing Administrator Portal ---");
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "ADMIN_01_portal.png") });

    recordJourney("13", "Admin Portal", "PASSED");
  } catch (err) {
    recordJourney("13", "Admin Portal", "FAILED", { error: err.message });
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), "JOURNEY_RESULTS.json"),
    JSON.stringify(journeyResults, null, 2)
  );

  console.log("\n=== ALL JOURNEYS TEST EXECUTION COMPLETED ===");
}

runJourneys().catch(console.error);
