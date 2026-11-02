import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "320x640_compact_android", width: 320, height: 640 },
  { name: "360x800_small_smartphone", width: 360, height: 800 },
  { name: "393x852_typical_smartphone", width: 393, height: 852 },
  { name: "430x932_large_smartphone", width: 430, height: 932 },
  { name: "768x1024_tablet_portrait", width: 768, height: 1024 },
  { name: "1366x768_desktop", width: 1366, height: 768 },
  { name: "1440x900_large_desktop", width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  "/",
  "/login",
  "/onboarding",
  "/dashboard",
  "/learn",
  "/learn/p2_probability",
  "/practice",
  "/tutor",
  "/mocks",
  "/revision",
  "/mistakes",
  "/progress",
  "/study-plan",
  "/settings",
  "/admin",
];

async function runResponsivenessAndA11y() {
  console.log("=== RUNNING RESPONSIVENESS AND ACCESSIBILITY AUDIT ===");
  const browser = await chromium.launch({ headless: true });
  const report = {
    testedAt: new Date().toISOString(),
    overflowFindings: [],
    touchTargetFindings: [],
    formLabelFindings: [],
    contrastFindings: [],
    viewportsTested: VIEWPORTS.length,
  };

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const urlPath of PAGES_TO_TEST) {
      try {
        await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: "networkidle", timeout: 15000 });

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const viewWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const maxW = Math.max(docWidth, bodyWidth);
          return {
            maxW,
            viewWidth,
            hasOverflow: maxW > viewWidth + 1, // allow 1px subpixel jitter
            diff: maxW - viewWidth,
          };
        });

        if (overflow.hasOverflow) {
          console.warn(`[OVERFLOW] ${urlPath} on ${vp.name}: width=${overflow.maxW} > viewport=${overflow.viewWidth} (+${overflow.diff}px)`);
          report.overflowFindings.push({
            viewport: vp.name,
            width: vp.width,
            path: urlPath,
            overflowPixels: overflow.diff,
          });
        }

        // Accessibility checks on 360x800
        if (vp.name === "360x800_small_smartphone") {
          const a11yMetrics = await page.evaluate(() => {
            const smallTargets = [];
            const buttons = Array.from(document.querySelectorAll("button, a, input, select"));
            buttons.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                if (rect.width < 44 || rect.height < 44) {
                  // check if it has sufficient touch target or padding
                  const text = (el.innerText || el.getAttribute("aria-label") || el.title || el.name || "").trim().slice(0, 30);
                  smallTargets.push({
                    tag: el.tagName,
                    text,
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                  });
                }
              }
            });

            // Form inputs without label
            const unlabeledInputs = [];
            const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
            inputs.forEach((input) => {
              if (input.type === "hidden") return;
              const id = input.id;
              const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : !!input.closest("label");
              const hasAria = !!input.getAttribute("aria-label") || !!input.getAttribute("aria-labelledby");
              if (!hasLabel && !hasAria) {
                unlabeledInputs.push({
                  type: input.type,
                  placeholder: input.placeholder || "",
                  name: input.name || "",
                });
              }
            });

            return {
              smallTargetCount: smallTargets.length,
              sampleSmallTargets: smallTargets.slice(0, 5),
              unlabeledInputs,
            };
          });

          if (a11yMetrics.smallTargetCount > 0) {
            report.touchTargetFindings.push({
              path: urlPath,
              count: a11yMetrics.smallTargetCount,
              samples: a11yMetrics.sampleSmallTargets,
            });
          }

          if (a11yMetrics.unlabeledInputs.length > 0) {
            report.formLabelFindings.push({
              path: urlPath,
              unlabeled: a11yMetrics.unlabeledInputs,
            });
          }
        }
      } catch (e) {
        console.error(`Error auditing ${urlPath} on ${vp.name}:`, e.message);
      }
    }
    await context.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), "A11Y_AND_RESPONSIVE_AUDIT.json"),
    JSON.stringify(report, null, 2)
  );

  console.log("=== RESPONSIVENESS AND A11Y AUDIT COMPLETED ===");
}

runResponsivenessAndA11y().catch(console.error);
