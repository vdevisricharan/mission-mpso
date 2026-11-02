import { test, expect } from "@playwright/test";

test.describe("Student Authentication & Core Navigation", () => {
  test("allows 1-click student demo login and lands on dashboard", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h2")).toContainText("MISSION MPSO");

    // Click Student 1-click access
    const studentBtn = page.locator("button:has-text('భాగ్య')").first();
    await studentBtn.click();

    await page.waitForURL("**/dashboard");
    await expect(page.locator("h1")).toContainText("భాగ్య");
  });

  test("toggles language between Telugu and English dynamically", async ({ page }) => {
    await page.goto("/dashboard");

    // Click visible English button
    const enButton = page.locator("button:visible:has-text('EN'), button:visible:has-text('English')").first();
    await enButton.click();
    await expect(page.locator("body")).toContainText("Good day");

    // Switch back to Telugu
    const teButton = page.locator("button:visible:has-text('తె'), button:visible:has-text('తెలుగు')").first();
    await teButton.click();
    await expect(page.locator("body")).toContainText("శుభోదయం");
  });

  test("cycles text size adjuster and updates root data attribute", async ({ page }) => {
    await page.goto("/dashboard");

    const html = page.locator("html");
    const initialSize = await html.getAttribute("data-text-size");
    expect(initialSize === null || initialSize === "normal").toBeTruthy();

    const sizeBtn = page.locator("button:visible[aria-label*='పరిమాణం'], button:visible[title*='పరిమాణం']").first();
    if (await sizeBtn.isVisible()) {
      await sizeBtn.click();
      await expect(html).toHaveAttribute("data-text-size", "large");

      await sizeBtn.click();
      await expect(html).toHaveAttribute("data-text-size", "extra-large");

      await sizeBtn.click();
      await expect(html).toHaveAttribute("data-text-size", "normal");
    }
  });

  test("navigates seamlessly via mobile bottom navigation", async ({ page, isMobile }) => {
    await page.goto("/dashboard");

    if (isMobile) {
      const bottomNav = page.locator("nav.safe-bottom");
      await expect(bottomNav).toBeVisible();

      // Click Learn
      await page.locator("nav.safe-bottom a[href='/learn']").click();
      await page.waitForURL("**/learn");
      await expect(page.locator("h1")).toContainText("నేర్చుకోండి");

      // Click Practice
      await page.locator("nav.safe-bottom a[href='/practice']").click();
      await page.waitForURL("**/practice");

      // Click Progress
      await page.locator("nav.safe-bottom a[href='/progress']").click();
      await page.waitForURL("**/progress");
      await expect(page.locator("h1")).toContainText("నా ప్రగతి");
    }
  });
});
