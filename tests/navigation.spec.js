const { test, expect } = require("@playwright/test");

test.describe("Navigation and Basic Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("should load landing page with proper navigation", async ({ page }) => {
    await page.goto("/");

    // Check main navigation elements
    await expect(page.locator('h1:has-text("TestBay")').first()).toBeVisible();
    await expect(page.locator('a[href="demo.html"]').first()).toBeVisible();
    await expect(page.locator('a[href="pricing.html"]').first()).toBeVisible();

    // Check hero section
    await expect(
      page.locator('h2:has-text("Test Results Made Simple")'),
    ).toBeVisible();
    await expect(page.locator("text=🚀 Try Live Demo")).toBeVisible();
  });

  test("should navigate to demo overview page", async ({ page }) => {
    await page.goto("/demo.html");

    // Check demo navigation
    await expect(page.locator('h1:has-text("TestBay Demo")')).toBeVisible();
    await expect(
      page.locator('a[href="demo-dashboard.html"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="demo-projects.html"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="demo-runs.html"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="demo-analytics.html"]').first(),
    ).toBeVisible();
  });

  test("should navigate to dashboard", async ({ page }) => {
    await page.goto("/demo-dashboard.html");

    // Check dashboard elements
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator("#total-projects")).toBeVisible();
    await expect(page.locator("#total-runs")).toBeVisible();
    await expect(page.locator("#success-rate")).toBeVisible();
    await expect(page.locator("#avg-duration")).toBeVisible();
  });

  test("should navigate to projects page", async ({ page }) => {
    await page.goto("/demo-projects.html");

    // Check projects page elements
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
    await expect(page.locator("#create-project-btn")).toBeVisible();
    await expect(page.locator("#empty-state")).toBeVisible();
  });

  test("should navigate to test runs page", async ({ page }) => {
    await page.goto("/demo-runs.html");

    // Check test runs page elements
    await expect(page.locator('h1:has-text("Test Runs")')).toBeVisible();
    await expect(page.locator("#upload-results-btn")).toBeVisible();
    await expect(page.locator("#empty-runs-state")).toBeVisible();
  });

  test("should navigate to analytics page", async ({ page }) => {
    await page.goto("/demo-analytics.html");

    // Check analytics page elements
    await expect(page.locator('h1:has-text("Analytics")')).toBeVisible();
    await expect(page.locator("#overall-success-rate")).toBeVisible();
    await expect(page.locator("#total-tests")).toBeVisible();
    await expect(page.locator("#avg-duration-analytics")).toBeVisible();
    await expect(page.locator("#tests-this-week")).toBeVisible();
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.goto("/demo-settings.html");

    // Check settings page elements
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
    await expect(page.locator("#reset-data-btn")).toBeVisible();
    await expect(page.locator("#projects-count")).toBeVisible();
    await expect(page.locator("#runs-count")).toBeVisible();
    await expect(page.locator("#storage-size")).toBeVisible();
  });

  test("should have consistent navigation across all pages", async ({
    page,
  }) => {
    const pages = [
      "/demo-dashboard.html",
      "/demo-projects.html",
      "/demo-runs.html",
      "/demo-analytics.html",
      "/demo-settings.html",
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check navigation consistency
      await expect(page.locator("text=TestBay").first()).toBeVisible();
      await expect(
        page.locator('a[href="demo-dashboard.html"]').first(),
      ).toBeVisible();
      await expect(
        page.locator('a[href="demo-projects.html"]').first(),
      ).toBeVisible();
      await expect(
        page.locator('a[href="demo-runs.html"]').first(),
      ).toBeVisible();
      await expect(
        page.locator('a[href="demo-analytics.html"]').first(),
      ).toBeVisible();
      await expect(page.locator('a[href="demo-settings.html"]')).toBeVisible();
    }
  });
});
