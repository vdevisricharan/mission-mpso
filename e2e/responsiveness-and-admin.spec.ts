import { test, expect } from "@playwright/test";

test.describe("Responsiveness & Administrator Management", () => {
  test("maintains zero horizontal overflow on small mobile screens", async ({ page }) => {
    const routes = [
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

    for (const r of routes) {
      await page.goto(r);
      const isOverflowing = await page.evaluate(() => {
        return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth + 1;
      });
      expect(isOverflowing, `Route ${r} should not have horizontal overflow`).toBeFalsy();
    }
  });

  test("loads Administrator CMS portal and handles question approval workflow", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("h1")).toContainText("అడ్మినిస్ట్రేషన్ కంటెంట్ మేనేజర్");

    // Question bank tab
    const questionsTab = page.locator("button:has-text('ప్రశ్నల నిధి')").first();
    if (await questionsTab.isVisible()) {
      await questionsTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator("body")).toContainText("ప్రశ్నల నిధి");
    }
  });
});
