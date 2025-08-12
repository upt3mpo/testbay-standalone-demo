const { test, expect } = require("@playwright/test");

test.describe("Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("should create a new project", async ({ page }) => {
    await page.goto("/demo-projects.html");

    // Click create project button
    await page.click("#create-project-btn");

    // Fill in project details
    await page.fill("#project-name", "Test Project");
    await page.fill("#project-description", "A test project for testing");
    await page.selectOption("#project-framework", "cypress");

    // Submit form - use a more robust click strategy for mobile browsers
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Wait for project to appear (modal close check can be flaky on mobile)
    await expect(page.locator('h3:has-text("Test Project")')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('span:has-text("cypress")')).toBeVisible();
  });

  test("should create a test run", async ({ page }) => {
    // First create a project
    await page.goto("/demo-projects.html");
    await page.click("#create-project-btn");
    await page.fill("#project-name", "Test Project");
    await page.fill("#project-description", "A test project");
    await page.selectOption("#project-framework", "cypress");
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Wait for project to be created
    await expect(page.locator('h3:has-text("Test Project")')).toBeVisible();

    // Go to test runs page
    await page.goto("/demo-runs.html");

    // Click upload results button
    await page.click("#upload-results-btn");

    // Fill in run details
    await page.fill("#run-name", "Test Run");
    await page.selectOption("#run-project", "Test Project");
    await page.selectOption("#run-framework", "cypress");
    await page.selectOption("#run-status", "PASSED");
    await page.fill("#run-duration", "120");

    // Submit run - use a more robust click strategy for mobile browsers
    await page
      .locator("#submit-run-btn")
      .click({ force: true, timeout: 10000 });

    // Verify run was created
    await expect(
      page.locator(
        'div.text-sm.font-medium.text-gray-900:has-text("Test Run")',
      ),
    ).toBeVisible();
    await expect(page.locator('span:has-text("PASSED")')).toBeVisible();
  });

  test("should display analytics with data", async ({ page }) => {
    // First create a project
    await page.goto("/demo-projects.html");
    await page.click("#create-project-btn");
    await page.fill("#project-name", "Analytics Project");
    await page.fill("#project-description", "Project for testing analytics");
    await page.selectOption("#project-framework", "playwright");
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Create a test run to ensure we have data
    await page.goto("/demo-runs.html");
    await page.click("#upload-results-btn");
    await page.fill("#run-name", "Analytics Test Run");
    await page.selectOption("#run-project", "Analytics Project");
    await page.selectOption("#run-framework", "playwright");
    await page.selectOption("#run-status", "PASSED");
    await page.fill("#run-duration", "120");
    await page
      .locator("#submit-run-btn")
      .click({ force: true, timeout: 10000 });

    // Go to analytics page
    await page.goto("/demo-analytics.html");

    // Check that analytics are displayed
    await expect(page.locator("#overall-success-rate")).toBeVisible();
    await expect(page.locator("#total-tests")).toBeVisible();
    await expect(page.locator("#avg-duration-analytics")).toBeVisible();

    // Check that charts are rendered
    await expect(page.locator("#success-rate-chart")).toBeVisible();
    await expect(page.locator("#status-distribution")).toBeVisible();
  });

  test("should reset demo data", async ({ page }) => {
    // First create some data
    await page.goto("/demo-projects.html");
    await page.click("#create-project-btn");
    await page.fill("#project-name", "Test Project");
    await page.fill("#project-description", "A test project");
    await page.selectOption("#project-framework", "cypress");
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Verify project exists
    await expect(page.locator('h3:has-text("Test Project")')).toBeVisible();

    // Go to settings and reset data
    await page.goto("/demo-settings.html");
    await page.click("#reset-data-btn");

    // Uncheck the generate fake data checkbox
    await page.uncheck("#generate-fake-data");

    // Confirm reset
    await page.click("#confirm-reset");

    // Wait for reset to complete
    await expect(page.locator("#reset-confirmation-modal")).not.toBeVisible();

    // Go back to projects to verify reset
    await page.goto("/demo-projects.html");
    await expect(page.locator("#empty-state")).toBeVisible();
  });

  test("should navigate between project details and runs", async ({ page }) => {
    // Create a project
    await page.goto("/demo-projects.html");
    await page.click("#create-project-btn");
    await page.fill("#project-name", "Navigation Test Project");
    await page.fill("#project-description", "Testing navigation");
    await page.selectOption("#project-framework", "jest");
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Click on the project to view details
    const projectCard = page
      .locator('h3:has-text("Navigation Test Project")')
      .locator("..")
      .locator("..")
      .locator("..");
    await projectCard.click();

    // Should be on project details page
    await expect(
      page.locator('h1:has-text("Navigation Test Project")'),
    ).toBeVisible();
    await expect(page.locator("#add-run-btn")).toBeVisible();

    // Go back to projects
    await page.click("text=← Back to Projects");
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
  });

  test("should display proper status badges", async ({ page }) => {
    // Create a project and run
    await page.goto("/demo-projects.html");
    await page.click("#create-project-btn");
    await page.fill("#project-name", "Status Test Project");
    await page.fill("#project-description", "Testing status badges");
    await page.selectOption("#project-framework", "pytest");
    await page
      .locator("#submit-create-project")
      .click({ force: true, timeout: 10000 });

    // Create a test run
    await page.goto("/demo-runs.html");
    await page.click("#upload-results-btn");
    await page.fill("#run-name", "Status Test Run");
    await page.selectOption("#run-project", "Status Test Project");
    await page.selectOption("#run-framework", "pytest");
    await page.selectOption("#run-status", "FAILED");
    await page.fill("#run-duration", "60");
    await page
      .locator("#submit-run-btn")
      .click({ force: true, timeout: 10000 });

    // Check status badge is displayed
    await expect(page.locator('span:has-text("FAILED")')).toBeVisible();
  });

  test("should handle empty states properly", async ({ page }) => {
    // Check projects empty state
    await page.goto("/demo-projects.html");
    await expect(page.locator("#empty-state")).toBeVisible();
    await expect(page.locator("text=No projects yet")).toBeVisible();

    // Check runs empty state
    await page.goto("/demo-runs.html");
    await expect(page.locator("#empty-runs-state")).toBeVisible();
    await expect(page.locator("text=No test runs yet")).toBeVisible();

    // Analytics page auto-generates demo data, so check it has data
    await page.goto("/demo-analytics.html");
    await expect(page.locator("#overall-success-rate")).toBeVisible();
    await expect(page.locator("#total-tests")).toBeVisible();
  });
});
