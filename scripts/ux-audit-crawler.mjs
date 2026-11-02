import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "UX_TEST_SCREENSHOTS");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const ROUTES = [
  { path: "/", name: "01_landing" },
  { path: "/login", name: "02_login" },
  { path: "/onboarding", name: "03_onboarding" },
  { path: "/dashboard", name: "04_dashboard" },
  { path: "/learn", name: "05_learn" },
  { path: "/learn/prob-basics", name: "06_learn_topic" },
  { path: "/practice", name: "07_practice" },
  { path: "/tutor", name: "08_tutor" },
  { path: "/mocks", name: "09_mocks" },
  { path: "/revision", name: "10_revision" },
  { path: "/mistakes", name: "11_mistakes" },
  { path: "/progress", name: "12_progress" },
  { path: "/study-plan", name: "13_study_plan" },
  { path: "/current-affairs", name: "14_current_affairs" },
  { path: "/settings", name: "15_settings" },
  { path: "/admin", name: "16_admin" },
];

async function runAudit() {
  console.log("Starting Playwright UX Audit Crawler...");
  const browser = await chromium.launch({ headless: true });
  const auditReport = {
    testedAt: new Date().toISOString(),
    routes: [],
    consoleErrors: [],
    overflows: [],
  };

  // Run audit for Android mobile first (primary target: 360x800)
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      auditReport.consoleErrors.push({ url: page.url(), text: msg.text() });
      console.error(`[Console Error] [${page.url()}]: ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    auditReport.consoleErrors.push({ url: page.url(), text: err.toString() });
    console.error(`[Page Error] [${page.url()}]: ${err.toString()}`);
  });

  for (const route of ROUTES) {
    const targetUrl = `${BASE_URL}${route.path}`;
    console.log(`Auditing: ${targetUrl} (Android 360x800)`);
    try {
      const res = await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 20000 });
      const status = res?.status();

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const viewWidth = window.innerWidth;
        const hasOverflow = docWidth > viewWidth;
        return {
          docWidth,
          viewWidth,
          hasOverflow,
          overflowAmount: docWidth - viewWidth,
        };
      });

      if (overflow.hasOverflow) {
        auditReport.overflows.push({
          route: route.path,
          viewport: "360x800",
          ...overflow,
        });
        console.warn(`[OVERFLOW DETECTED] ${route.path}: scrollWidth=${overflow.docWidth} > innerWidth=${overflow.viewWidth}`);
      }

      // Capture screenshot
      const shotPath = path.join(SCREENSHOTS_DIR, `${route.name}_mobile_360.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      // Title & Heading check
      const title = await page.title();
      const h1Text = await page.evaluate(() => document.querySelector("h1")?.innerText || "");

      auditReport.routes.push({
        name: route.name,
        path: route.path,
        status,
        title,
        h1Text,
        overflow,
        screenshot: shotPath,
      });
    } catch (e) {
      console.error(`Error loading ${targetUrl}:`, e.message);
      auditReport.routes.push({
        name: route.name,
        path: route.path,
        error: e.message,
      });
    }
  }

  // Also audit Desktop viewport for landing and dashboard
  const desktopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const desktopPage = await desktopContext.newPage();

  for (const route of [{ path: "/", name: "01_landing_desktop" }, { path: "/dashboard", name: "04_dashboard_desktop" }, { path: "/mocks", name: "09_mocks_desktop" }]) {
    await desktopPage.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
    const shotPath = path.join(SCREENSHOTS_DIR, `${route.name}.png`);
    await desktopPage.screenshot({ path: shotPath, fullPage: false });
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), "UX_CRAWL_AUDIT_LOG.json"),
    JSON.stringify(auditReport, null, 2)
  );

  console.log("Playwright UX Audit Crawler finished successfully!");
}

runAudit().catch(console.error);
