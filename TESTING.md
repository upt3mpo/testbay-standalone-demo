# Testing Guide for TestBay Standalone Demo

This document describes how to run and maintain the Playwright test suite for the TestBay standalone demo.

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ installed
- Python 3.x for local server

### **Installation**
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

## 🧪 **Test Structure**

### **Test Files**
- `tests/navigation.spec.js` - Navigation and basic functionality tests
- `tests/functionality.spec.js` - Core feature tests (CRUD operations)
- `tests/demo-data.spec.js` - Demo data generation and analytics tests

### **Test Categories**

#### **Navigation Tests**
- Landing page loading
- Demo overview navigation
- Page-to-page navigation
- Navigation consistency across pages

#### **Functionality Tests**
- Project creation and management
- Test run creation and management
- Analytics display
- Data reset functionality
- Status badge display
- Empty state handling

#### **Demo Data Tests**
- Automatic demo data generation
- Analytics chart rendering
- Settings reset with/without demo data
- Test result details display
- Project details with runs
- Status distribution handling

## 🔧 **Test Configuration**

### **Playwright Config**
- **Base URL**: `http://localhost:8000`
- **Test Directory**: `./tests`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Web Server**: Automatically starts Python HTTP server
- **Screenshots**: On failure only
- **Videos**: On failure only
- **Traces**: On first retry

### **Test Isolation**
Each test:
- Clears localStorage before execution
- Uses fresh browser context
- Is independent of other tests

## 🎯 **Test Patterns**

### **Page Object Model**
Tests use direct page interactions rather than page objects for simplicity:
```javascript
// Navigate to page
await page.goto('/demo-projects.html');

// Interact with elements
await page.click('#create-project-btn');
await page.fill('#project-name', 'Test Project');

// Assert results
await expect(page.locator('text=Test Project')).toBeVisible();
```

### **Data Setup**
Tests create their own data as needed:
```javascript
// Create project for testing
await page.goto('/demo-projects.html');
await page.click('#create-project-btn');
// ... fill form and submit
```

### **Cleanup**
Tests automatically clean up via `beforeEach`:
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
});
```

## 🚨 **Common Issues & Solutions**

### **Timing Issues**
- Use `page.waitForTimeout(1000)` for demo data generation
- Wait for modals to close before assertions
- Use `toBeVisible()` instead of `toBeAttached()` for dynamic content

### **Element Selection**
- Use ID selectors when possible (`#element-id`)
- Use text content for dynamic elements (`text=Project Name`)
- Use CSS classes for groups (`.bg-white`)

### **Browser Compatibility**
- Tests run on multiple browsers
- Mobile viewport tests included
- Responsive design validation

## 📊 **Test Reports**

### **HTML Report**
```bash
npm run test:report
```
Opens detailed HTML report with:
- Test results summary
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

### **Console Output**
```bash
npm test
```
Shows:
- Test progress
- Pass/fail status
- Error details
- Execution time

## 🔍 **Debugging Tests**

### **Debug Mode**
```bash
npm run test:debug
```
- Opens browser in debug mode
- Step through test execution
- Inspect page state
- Pause at breakpoints

### **UI Mode**
```bash
npm run test:ui
```
- Interactive test runner
- Real-time test execution
- Visual test debugging
- Step-by-step execution

### **Headed Mode**
```bash
npm run test:headed
```
- See browser actions
- Watch test execution
- Debug visual issues
- Verify interactions

## 📝 **Adding New Tests**

### **Test File Structure**
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });
});
```

### **Best Practices**
- Use descriptive test names
- Test one behavior per test
- Clean up data in `beforeEach`
- Use meaningful assertions
- Handle async operations properly

### **Test Data**
- Create minimal test data
- Use realistic but simple values
- Avoid dependencies between tests
- Clear data after each test

## 🚀 **CI/CD Integration**

### **GitHub Actions Example**
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run install-browsers
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 **Resources**

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Selectors](https://playwright.dev/docs/selectors)

## 🤝 **Contributing**

When adding new tests:
1. Follow existing test patterns
2. Ensure tests are isolated
3. Add appropriate assertions
4. Test both success and failure cases
5. Update this documentation if needed
