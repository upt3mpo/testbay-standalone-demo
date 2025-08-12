// Demo Run Details JavaScript
class DemoRunDetails {
  constructor() {
    this.runId = null;
    this.run = null;
    this.testResults = [];
    this.init();
  }

  init() {
    this.loadRunFromUrl();
    this.setupEventListeners();
  }

  loadRunFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.runId = urlParams.get("id");
    if (this.runId) {
      this.loadRunData();
    } else {
      this.showError("No run ID provided");
    }
  }

  loadRunData() {
    const allRuns = DemoUtils.getRuns();
    this.run = allRuns.find((r) => r.id === this.runId);

    if (!this.run) {
      this.showError("Test run not found");
      return;
    }

    this.testResults = this.run.testResults || [];
    this.renderRunDetails();
    this.renderRunStats();
    this.renderTestResults();
  }

  renderRunDetails() {
    // Update page title
    document.title = `${this.run.name} - TestBay Demo`;

    // Update run header
    document.getElementById("run-name").textContent = this.run.name;
    document.getElementById("run-project").textContent =
      this.run.project || "Unknown Project";
    document.getElementById("run-timestamp").textContent =
      DemoUtils.formatTimeAgo(this.run.timestamp);

    // Update status
    const statusElement = document.getElementById("run-status");
    statusElement.innerHTML = DemoUtils.getStatusBadge(this.run.status);
    statusElement.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${DemoUtils.getStatusBadgeClasses(this.run.status)}`;

    // Update back to project link if we have project info
    const backToProjectLink = document.getElementById("back-to-project-link");
    if (this.run.project) {
      const projects = DemoUtils.getProjects();
      const project = projects.find((p) => p.id === this.run.project);
      if (project) {
        backToProjectLink.href = `demo-project-details.html?id=${project.id}`;
        backToProjectLink.classList.remove("hidden");
      }
    }

    // Update view project button
    const viewProjectBtn = document.getElementById("view-project-btn");
    if (this.run.project) {
      const projects = DemoUtils.getProjects();
      const project = projects.find((p) => p.id === this.run.project);
      if (project) {
        viewProjectBtn.href = `demo-project-details.html?id=${project.id}`;
      }
    }
  }

  renderRunStats() {
    // Update stats
    document.getElementById("run-duration").textContent =
      `${this.run.duration || 0}s`;
    document.getElementById("tests-passed").textContent =
      this.testResults.filter((t) => t.status === "PASSED").length;
    document.getElementById("tests-failed").textContent =
      this.testResults.filter((t) => t.status === "FAILED").length;
    document.getElementById("tests-skipped").textContent =
      this.testResults.filter((t) => t.status === "SKIPPED").length;

    // Update run information
    document.getElementById("run-framework").textContent =
      this.run.framework || "Unknown";
    document.getElementById("run-environment").textContent =
      this.run.environment || "Development";
    document.getElementById("run-branch").textContent =
      this.run.branch || "main";
    document.getElementById("run-commit").textContent =
      this.run.commit || "abc1234";
  }

  renderTestResults() {
    const container = document.getElementById("test-results-container");
    if (!container) return;

    if (this.testResults.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No test results available</p>
        </div>
      `;
      return;
    }

    // Group tests by status
    const passedTests = this.testResults.filter((t) => t.status === "PASSED");
    const failedTests = this.testResults.filter((t) => t.status === "FAILED");
    const skippedTests = this.testResults.filter((t) => t.status === "SKIPPED");

    let html = "";

    // Render passed tests
    if (passedTests.length > 0) {
      html += this.renderTestGroup(
        "Passed Tests",
        passedTests,
        "text-green-600",
        "check-circle",
      );
    }

    // Render failed tests
    if (failedTests.length > 0) {
      html += this.renderTestGroup(
        "Failed Tests",
        failedTests,
        "text-red-600",
        "x-circle",
      );
    }

    // Render skipped tests
    if (skippedTests.length > 0) {
      html += this.renderTestGroup(
        "Skipped Tests",
        skippedTests,
        "text-yellow-600",
        "skip-forward",
      );
    }

    container.innerHTML = html;

    // Recreate icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  renderTestGroup(title, tests, textColor, icon) {
    return `
      <div class="mb-6">
        <h4 class="text-lg font-medium ${textColor} mb-3 flex items-center">
          <i data-lucide="${icon}" class="h-5 w-5 mr-2"></i>
          ${title} (${tests.length})
        </h4>
        <div class="space-y-2">
          ${tests.map((test) => this.renderTestItem(test)).join("")}
        </div>
      </div>
    `;
  }

  renderTestItem(test) {
    return `
      <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-${test.status === "PASSED" ? "green" : test.status === "FAILED" ? "red" : "yellow"}-500">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-medium text-gray-900">${test.name}</p>
            <p class="text-sm text-gray-600 mt-1">${test.message || "No message"}</p>
            <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Duration: ${test.duration}s</span>
              <span>${DemoUtils.formatTimeAgo(test.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Delete run button
    document.getElementById("delete-run-btn")?.addEventListener("click", () => {
      this.showDeleteModal();
    });

    // Download results button
    document
      .getElementById("download-results-btn")
      ?.addEventListener("click", () => {
        this.downloadResults();
      });

    // Share results button
    document
      .getElementById("share-results-btn")
      ?.addEventListener("click", () => {
        this.shareResults();
      });

    // Delete confirmation modal
    document.getElementById("delete-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "delete-modal") {
        this.hideDeleteModal();
      }
    });

    // Cancel delete
    document.getElementById("cancel-delete")?.addEventListener("click", () => {
      this.hideDeleteModal();
    });

    // Confirm delete
    document.getElementById("confirm-delete")?.addEventListener("click", () => {
      this.deleteRun();
    });
  }

  showDeleteModal() {
    document.getElementById("delete-modal").classList.remove("hidden");
  }

  hideDeleteModal() {
    document.getElementById("delete-modal").classList.add("hidden");
  }

  deleteRun() {
    // Delete run from localStorage
    const allRuns = DemoUtils.getRuns();
    const updatedRuns = allRuns.filter((r) => r.id !== this.runId);
    DemoUtils.saveRuns(updatedRuns);

    DemoUtils.showSuccess("Test run deleted successfully!");

    // Redirect back to runs page
    setTimeout(() => {
      window.location.href = "demo-runs.html";
    }, 1000);
  }

  downloadResults() {
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(this.run, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${this.run.name.replace(/\s+/g, "_")}_results.json`;
    link.click();

    DemoUtils.showSuccess("Results downloaded successfully!");
  }

  shareResults() {
    // Create a shareable link (in a real app, this would generate a shareable URL)
    const shareData = {
      title: `Test Results: ${this.run.name}`,
      text: `View test results for ${this.run.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          DemoUtils.showSuccess("Link copied to clipboard!");
        })
        .catch(() => {
          DemoUtils.showError("Failed to copy link");
        });
    }
  }

  showError(message) {
    const container = document.querySelector(".max-w-7xl");
    if (container) {
      container.innerHTML = `
        <div class="text-center py-16">
          <i data-lucide="alert-circle" class="h-24 w-24 text-red-500 mx-auto mb-6"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p class="text-gray-500 mb-6">${message}</p>
          <a href="demo-runs.html" class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Back to Test Runs
          </a>
        </div>
      `;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }
}

// Initialize run details when DOM is loaded
let demoRunDetails;
document.addEventListener("DOMContentLoaded", () => {
  demoRunDetails = new DemoRunDetails();
  DemoUtils.initializeClass("demoRunDetails", demoRunDetails);
});
