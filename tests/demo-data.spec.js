const { test, expect } = require("@playwright/test");

test.describe("Demo Data Generation and Analytics", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("should generate demo data automatically on first visit", async ({
    page,
  }) => {
    // Visit dashboard - should trigger demo data generation
    await page.goto("/demo-dashboard.html");

    // Wait for data generation and check that data is displayed
    await expect(page.locator("#total-projects")).toBeVisible();
    await expect(page.locator("#total-runs")).toBeVisible();

    // Verify the numbers are greater than 0
    await expect(page.locator("#total-projects")).toContainText(/[1-9]/);
    await expect(page.locator("#total-runs")).toContainText(/[1-9]/);
  });

  test("should display analytics charts with generated data", async ({
    page,
  }) => {
    // Generate demo data first
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to analytics page
    await page.goto("/demo-analytics.html");

    // Check that analytics are populated
    await expect(page.locator("#overall-success-rate")).not.toHaveText("0%");
    await expect(page.locator("#total-tests")).not.toHaveText("0");

    // Check that charts are rendered
    await expect(page.locator("#success-rate-chart")).toBeVisible();
    await expect(page.locator("#framework-distribution")).toBeVisible();
    await expect(page.locator("#status-distribution")).toBeVisible();
    await expect(page.locator("#project-success-chart")).toBeVisible();

    // Verify charts have content
    const successChart = await page.locator("#success-rate-chart");
    const chartContent = await successChart.innerHTML();
    expect(chartContent).not.toContain("No data");
  });

  test("should generate demo data from settings reset", async ({ page }) => {
    // Go to settings and reset with demo data generation
    await page.goto("/demo-settings.html");
    await page.click("#reset-data-btn");

    // Ensure checkbox is checked (should be default)
    const checkbox = page.locator("#generate-fake-data");
    await expect(checkbox).toBeChecked();

    // Confirm reset
    await page.click("#confirm-reset");

    // Wait for reset to complete
    await expect(page.locator("#reset-confirmation-modal")).not.toBeVisible();

    // Go to dashboard to verify data was generated
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    const totalProjects = await page.locator("#total-projects").textContent();
    const totalRuns = await page.locator("#total-runs").textContent();

    expect(parseInt(totalProjects)).toBeGreaterThan(0);
    expect(parseInt(totalRuns)).toBeGreaterThan(0);
  });

  test("should reset without generating demo data", async ({ page }) => {
    // First generate some data
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to settings and reset without demo data
    await page.goto("/demo-settings.html");
    await page.click("#reset-data-btn");

    // Uncheck the demo data checkbox
    await page.uncheck("#generate-fake-data");

    // Confirm reset
    await page.click("#confirm-reset");

    // Wait for reset to complete
    await expect(page.locator("#reset-confirmation-modal")).not.toBeVisible();

    // Go to projects page to verify no data (dashboard auto-generates data)
    await page.goto("/demo-projects.html");

    // Check that projects page shows empty state
    await expect(page.locator("#empty-state")).toBeVisible();
    await expect(page.locator("text=No projects yet")).toBeVisible();
  });

  test("should generate demo data from analytics page", async ({ page }) => {
    // Go to analytics page with no data
    await page.goto("/demo-analytics.html");

    // Analytics page auto-generates demo data, so check it has data
    await expect(page.locator("#overall-success-rate")).toBeVisible();
    await expect(page.locator("#total-tests")).toBeVisible();

    // The generate demo data button should be hidden since data exists
    await expect(page.locator("#empty-analytics")).toHaveClass(/hidden/);

    // Since analytics page auto-generates data, we can't test the button directly
    // But we can verify that the page shows analytics data properly
    await expect(page.locator("#success-rate-chart")).toBeVisible();
    await expect(page.locator("#status-distribution")).toBeVisible();
  });

  test("should display proper test result details", async ({ page }) => {
    // Generate demo data
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to test runs page
    await page.goto("/demo-runs.html");

    // Click on a run to view details
    const firstRun = page.locator("tbody tr").first();
    await firstRun.click();

    // Should be on run details page
    await expect(page.locator("h1")).toBeVisible();

    // Check that test results are displayed
    await expect(page.locator("#test-results-container")).toBeVisible();

    // Check run stats
    await expect(page.locator("#run-duration")).toBeVisible();
    await expect(page.locator("#tests-passed")).toBeVisible();
    await expect(page.locator("#tests-failed")).toBeVisible();
    await expect(page.locator("#tests-skipped")).toBeVisible();
  });

  test("should display project details with runs", async ({ page }) => {
    // Generate demo data
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to projects page
    await page.goto("/demo-projects.html");

    // Wait for projects to load
    await page.waitForTimeout(500);

    // Click on a project to view details
    const firstProject = page.locator(".bg-white.rounded-lg.shadow").first();
    await firstProject.click();

    // Should be on project details page
    await expect(page.locator("h1")).toBeVisible();

    // Check project stats
    await expect(page.locator("#total-runs")).toBeVisible();
    await expect(page.locator("#success-rate")).toBeVisible();
    await expect(page.locator("#avg-duration")).toBeVisible();

    // Check that runs table is displayed
    await expect(page.locator("#project-runs-table")).toBeVisible();
  });

  test("should handle different test statuses correctly", async ({ page }) => {
    // Generate demo data
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to analytics page
    await page.goto("/demo-analytics.html");

    // Check status distribution chart
    await expect(page.locator("#status-distribution")).toBeVisible();

    // Verify different statuses are displayed
    const statusContainer = page.locator("#status-distribution");
    const statusContent = await statusContainer.innerHTML();

    // Should have various statuses
    expect(statusContent).toContain("PASSED");
    expect(statusContent).toContain("UNSTABLE");
    // Check for either FAILED or CRITICAL (demo data generator creates both)
    const hasFailedOrCritical = statusContent.includes("FAILED") || statusContent.includes("CRITICAL");
    expect(hasFailedOrCritical).toBe(true);
  });

  test("should display framework distribution correctly", async ({ page }) => {
    // Generate demo data
    await page.goto("/demo-dashboard.html");
    await page.waitForTimeout(1000);

    // Go to analytics page
    await page.goto("/demo-analytics.html");

    // Check framework distribution chart
    await expect(page.locator("#framework-distribution")).toBeVisible();

    // Verify framework data is displayed
    const frameworkContainer = page.locator("#framework-distribution");
    const frameworkContent = await frameworkContainer.innerHTML();

    // Should contain framework information
    expect(frameworkContent).toContain("jest");
    expect(frameworkContent).toContain("playwright");
    expect(frameworkContent.length).toBeGreaterThan(100);
  });
});
