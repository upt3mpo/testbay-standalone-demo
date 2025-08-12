// Demo Data Generator Utility
class DemoDataGenerator {
  static generateFakeDemoData() {
    // Generate sample projects
    const sampleProjects = [
      {
        id: "1",
        name: "E-commerce Platform",
        description:
          "A comprehensive e-commerce solution with user management, product catalog, and payment processing",
        framework: "cypress",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      },
      {
        id: "2",
        name: "Mobile Banking App",
        description:
          "Secure mobile banking application with biometric authentication and real-time transactions",
        framework: "playwright",
        createdAt: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 14 days ago
      },
      {
        id: "3",
        name: "API Gateway Service",
        description:
          "High-performance API gateway with rate limiting, authentication, and monitoring",
        framework: "jest",
        createdAt: new Date(
          Date.now() - 21 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 21 days ago
      },
      {
        id: "4",
        name: "Data Analytics Dashboard",
        description:
          "Real-time analytics dashboard with interactive charts and data visualization",
        framework: "pytest",
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 30 days ago
      },
      {
        id: "5",
        name: "IoT Device Manager",
        description:
          "Internet of Things device management platform with remote monitoring and control",
        framework: "selenium",
        createdAt: new Date(
          Date.now() - 45 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 45 days ago
      },
    ];

    // Generate sample test runs
    const sampleRuns = [];
    const environments = ["Development", "Staging", "Production"];
    const branches = [
      "main",
      "develop",
      "feature/user-auth",
      "feature/payment",
      "hotfix/security",
    ];

    sampleProjects.forEach((project, projectIndex) => {
      // Generate 3-8 runs per project
      const runsCount = Math.floor(Math.random() * 6) + 3;

      // Some projects are more stable than others
      const projectStability = Math.random();
      const isStableProject = projectStability > 0.3; // 70% of projects are stable

      for (let i = 0; i < runsCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago

        // Generate test results with project-specific stability
        const testResults =
          DemoDataGenerator.generateTestResults(isStableProject);
        const runStatus = DemoDataGenerator.determineRunStatus(testResults);
        const totalDuration = testResults.reduce(
          (sum, test) => sum + test.duration,
          0,
        );

        sampleRuns.push({
          id: DemoDataGenerator.generateId(),
          name: `Test Run ${i + 1}`,
          project: project.id,
          framework: project.framework,
          environment:
            environments[Math.floor(Math.random() * environments.length)],
          status: runStatus,
          duration: totalDuration,
          timestamp: new Date(
            Date.now() - daysAgo * 24 * 60 * 60 * 1000,
          ).toISOString(),
          branch: branches[Math.floor(Math.random() * branches.length)],
          commit: DemoDataGenerator.generateCommitHash(),
          testResults: testResults,
        });
      }
    });

    return { projects: sampleProjects, runs: sampleRuns };
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static generateCommitHash() {
    const chars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 7; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  static generateTestResults(isStableProject = true, runType = "MINOR_ISSUES") {
    // Generate realistic test results
    const testCount = Math.floor(Math.random() * 50) + 10; // 10-60 tests
    const results = [];

    // Define test categories for more realistic naming
    const testCategories = [
      "User Authentication",
      "Database Operations",
      "API Endpoints",
      "UI Components",
      "Business Logic",
      "Integration Tests",
      "Performance Tests",
      "Security Tests",
      "Data Validation",
    ];

    for (let i = 1; i <= testCount; i++) {
      const status = DemoDataGenerator.getRandomTestStatus(
        isStableProject,
        runType,
      );
      const duration = Math.floor(Math.random() * 10) + 1; // 1-10 seconds
      const category =
        testCategories[Math.floor(Math.random() * testCategories.length)];

      results.push({
        id: `test-${i}`,
        name: `${category} - Test ${i}`,
        status: status,
        duration: duration,
        message: DemoDataGenerator.getTestMessage(status, i, category),
        timestamp: new Date().toISOString(),
      });
    }

    return results;
  }

  static getTestMessage(status, testNumber, category) {
    const failureReasons = [
      `Assertion failed: expected 'true' but got 'false'`,
      `Element not found: button with id 'submit-btn'`,
      `API response status 500 instead of 200`,
      `Database connection timeout after 30s`,
      `Validation error: email format invalid`,
    ];

    const skipReasons = [
      `Skipped: environment variable 'TEST_DB' not set`,
      `Skipped: test requires external service that is down`,
      `Skipped: test data not available`,
      `Skipped: test marked as flaky in previous runs`,
    ];

    const criticalReasons = [
      `Test suite crashed: OutOfMemoryError`,
      `Test runner stopped: connection to CI server lost`,
      `Test environment corrupted: cannot initialize database`,
      `Test framework error: unable to load test configuration`,
    ];

    switch (status) {
      case "PASSED":
        return ""; // No message for passed tests
      case "FAILED":
        return failureReasons[
          Math.floor(Math.random() * failureReasons.length)
        ];
      case "SKIPPED":
        return skipReasons[Math.floor(Math.random() * skipReasons.length)];
      case "CRITICAL":
        return criticalReasons[
          Math.floor(Math.random() * criticalReasons.length)
        ];
      default:
        return "";
    }
  }

  static determineRunType(runIndex, totalRuns, isStableProject) {
    // Determine if this run should be completely passing or have some failures
    const rand = Math.random();

    if (isStableProject) {
      // For stable projects, 80% of runs should be completely passing
      if (rand < 0.8) return "PERFECT";
      // 15% have minor issues
      if (rand < 0.95) return "MINOR_ISSUES";
      // 5% have significant issues
      return "SIGNIFICANT_ISSUES";
    } else {
      // For less stable projects, 60% of runs should be completely passing
      if (rand < 0.6) return "PERFECT";
      // 30% have minor issues
      if (rand < 0.9) return "MINOR_ISSUES";
      // 10% have significant issues
      return "SIGNIFICANT_ISSUES";
    }
  }

  static getRandomTestStatus(isStableProject = true, runType = "MINOR_ISSUES") {
    const rand = Math.random();

    if (runType === "PERFECT") {
      // Perfect runs have 100% pass rate (no failures, no skips)
      return "PASSED";
    } else if (runType === "MINOR_ISSUES") {
      // Minor issues: mostly passes, very few failures, rare critical
      if (isStableProject) {
        if (rand < 0.92) return "PASSED";
        if (rand < 0.97) return "FAILED";
        if (rand < 0.99) return "SKIPPED";
        return "CRITICAL";
      } else {
        if (rand < 0.85) return "PASSED";
        if (rand < 0.93) return "FAILED";
        if (rand < 0.97) return "SKIPPED";
        return "CRITICAL";
      }
    } else {
      // Significant issues: more failures, more critical
      if (isStableProject) {
        if (rand < 0.6) return "PASSED";
        if (rand < 0.85) return "FAILED";
        if (rand < 0.95) return "SKIPPED";
        return "CRITICAL";
      } else {
        if (rand < 0.5) return "PASSED";
        if (rand < 0.8) return "FAILED";
        if (rand < 0.9) return "SKIPPED";
        return "CRITICAL";
      }
    }
  }

  static determineRunStatus(testResults) {
    // Determine run status based on test results
    const criticalTests = testResults.filter(
      (t) => t.status === "CRITICAL",
    ).length;
    const failedTests = testResults.filter((t) => t.status === "FAILED").length;
    const totalTests = testResults.length;

    // Critical tests are very rare, only make run critical if multiple critical tests
    if (criticalTests > 1) {
      return "CRITICAL";
    }

    // Calculate failure percentage
    const failureRate = failedTests / totalTests;

    // Allow very low failure rates to still be PASSED (more realistic)
    if (failedTests === 0 && criticalTests === 0) {
      return "PASSED";
    } else if (failureRate > 0.1) {
      return "FAILED"; // More than 10% failures = failed
    } else if (failureRate > 0.05) {
      return "UNSTABLE"; // 5-10% failures = unstable
    } else {
      return "PASSED"; // 0-5% failures = passed (realistic for good runs)
    }
  }

  static isFirstTimeUser() {
    return (
      !localStorage.getItem("demo_projects") &&
      !localStorage.getItem("demo_runs")
    );
  }

  static initializeDemoData() {
    if (this.isFirstTimeUser()) {
      const data = this.generateFakeDemoData();
      localStorage.setItem("demo_projects", JSON.stringify(data.projects));
      localStorage.setItem("demo_runs", JSON.stringify(data.runs));
      return true; // Indicates data was generated
    } else {
      // Ensure existing runs have test results
      this.ensureRunsHaveTestResults();
    }
    return false; // Indicates no data was generated
  }

  static ensureRunsHaveTestResults() {
    const runs = JSON.parse(localStorage.getItem("demo_runs") || "[]");
    let updated = false;

    runs.forEach((run) => {
      if (!run.testResults) {
        // Generate test results for runs that don't have them
        // Assume stable project for existing runs, with minor issues
        const testResults = this.generateTestResults(true, "MINOR_ISSUES");
        run.testResults = testResults;
        run.status = this.determineRunStatus(testResults);
        run.duration = testResults.reduce(
          (sum, test) => sum + test.duration,
          0,
        );
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("demo_runs", JSON.stringify(runs));
    }
  }

  static regenerateAllTestResults() {
    const runs = JSON.parse(localStorage.getItem("demo_runs") || "[]");

    runs.forEach((run) => {
      // Generate new test results for all runs
      // Assume stable project for existing runs, with varied run types
      const runType = Math.random() < 0.6 ? "PERFECT" : "MINOR_ISSUES";
      const testResults = this.generateTestResults(true, runType);
      run.testResults = testResults;
      run.status = this.determineRunStatus(testResults);
      run.duration = testResults.reduce((sum, test) => sum + test.duration, 0);
    });

    localStorage.setItem("demo_runs", JSON.stringify(runs));
    return runs.length;
  }

  static regenerateAllDemoData() {
    // Completely regenerate all demo data with new logic
    const data = this.generateFakeDemoData();
    localStorage.setItem("demo_projects", JSON.stringify(data.projects));
    localStorage.setItem("demo_runs", JSON.stringify(data.runs));
    return { projects: data.projects.length, runs: data.runs.length };
  }
}
