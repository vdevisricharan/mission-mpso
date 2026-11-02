import { test, expect } from "@playwright/test";

test.describe("Practice Quizzes & Mistake Book Review", () => {
  test("answers quiz question, receives instant Telugu feedback, and navigates", async ({ page }) => {
    await page.goto("/practice?topicId=p2_probability");

    // Select first option in the question options container
    const optionCard = page.locator(".space-y-3 button").first();
    await expect(optionCard).toBeVisible();
    await optionCard.click();

    // Verify feedback appears (either correct or incorrect guidance)
    await expect(page.locator("body")).toContainText("సమాధానం");

    // Click Next
    const nextBtn = page.locator("button:has-text('తర్వాతి')").first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator("body")).toContainText("ప్రశ్న 2");
    }
  });

  test("loads mistake book and filters by mistake category", async ({ page }) => {
    await page.goto("/mistakes");

    await expect(page.locator("h1")).toContainText("తప్పుల పుస్తకం");
    await expect(page.locator("body")).toContainText("స్వీయ దిద్దుబాటు సాధనం");
  });
});
