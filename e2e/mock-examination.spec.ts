import { test, expect } from "@playwright/test";

test.describe("Mock Examination Simulator", () => {
  test("runs simulated timed examination, marks for review, and submits", async ({ page }) => {
    // Navigate to a fresh session to test in-progress exam interface
    const testSessionId = `test_mock_${Date.now()}`;
    await page.goto(`/mocks/${testSessionId}`);

    // Authoritative countdown timer verification
    const timer = page.locator("[role='timer']");
    await expect(timer).toBeVisible();

    // Select option A
    const optionA = page.locator("button:has-text('A')").first();
    await optionA.click();

    // Mark for review
    const markReviewBtn = page.locator("button:has-text('రివ్యూ')").first();
    if (await markReviewBtn.isVisible()) {
      await markReviewBtn.click();
    }

    // Submit mock test
    const submitBtn = page.locator("button:has-text('సమర్పించండి')").first();
    await submitBtn.click();

    // Confirm submission modal
    const confirmModalBtn = page.locator(".fixed.inset-0 button:has-text('సమర్పించు')").or(page.locator("button:has-text('ఖచ్చితంగా సమర్పించు')")).first();
    await expect(confirmModalBtn).toBeVisible();
    await confirmModalBtn.click();

    // Results screen verification
    await page.waitForTimeout(1000);
    await expect(page.locator("body")).toContainText("ఫలితం");
  });
});
