import { test, expect } from "@playwright/test";

test.describe("Learning Experience & AI Tutor Interactions", () => {
  test("renders Statistics lesson with worked examples and KaTeX mathematical notation", async ({ page }) => {
    await page.goto("/learn/p2_probability");

    // Title verification
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).toContainText("సంభావ్యత");

    // KaTeX formula verification
    const katexEl = page.locator(".katex").first();
    await expect(katexEl).toBeVisible();

    // Verify key concepts block
    await expect(page.locator("body")).toContainText("కీలక భావనలు");
  });

  test("interacts with AI Tutor via contextual quick chips", async ({ page }) => {
    await page.goto("/tutor");

    // Initial greeting check
    await expect(page.locator("body")).toContainText("నమస్కారం భాగ్య గారూ");

    // Click quick chip
    const chip = page.locator("button:has-text('సంభావ్యత')").or(page.locator("button:has-text('కేంద్రీయ')")).first();
    if (await chip.isVisible()) {
      await chip.click();
      await page.waitForTimeout(2000);
      await expect(page.locator("body")).toContainText("సిద్ధాంతం");
    }
  });

  test("interacts with AI Tutor via custom Telugu questions", async ({ page }) => {
    await page.goto("/tutor");

    const input = page.locator("input[placeholder*='అడగండి']").first();
    if (await input.isVisible()) {
      await input.fill("బేయెస్ సిద్ధాంతం వివరించండి");
      const sendBtn = page.locator("button:has(svg.lucide-send)").first();
      await sendBtn.click();

      // Expect tutor response
      await page.waitForTimeout(2000);
      await expect(page.locator("body")).toContainText("సిద్ధాంతం");
    }
  });
});
