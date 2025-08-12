// Demo Project Details JavaScript
class DemoProjectDetails {
  constructor() {
    this.projectId = null;
    this.project = null;
    this.runs = [];
    this.init();
  }

  init() {
    this.loadProjectFromUrl();
    this.setupEventListeners();
  }

  loadProjectFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.projectId = urlParams.get("id");
    if (this.projectId) {
      this.loadProjectData();
    } else {
      this.showError("No project ID provided");
    }
  }

  loadProjectData() {
    const projects = DemoUtils.getProjects();
    this.project = projects.find((p) => p.id === this.projectId);

    if (!this.project) {
      this.showError("Project not found");
      return;
    }

    const allRuns = DemoUtils.getRuns();
    this.runs = allRuns.filter((r) => r.project === this.projectId);

    this.renderProjectDetails();
    this.renderProjectStats();
    this.renderProjectRuns();
  }

  renderProjectDetails() {
    document.getElementById("project-name").textContent = this.project.name;
    document.getElementById("project-description").textContent =
      this.project.description || "No description provided";
    document.getElementById("project-framework").textContent =
      this.project.framework || "Unknown";
    document.getElementById("project-created").textContent =
      DemoUtils.formatTimeAgo(this.project.createdAt);

    // Update page title
    document.title = `${this.project.name} - TestBay Demo`;
  }

  renderProjectStats() {
    // Total runs
    document.getElementById("total-runs").textContent = this.runs.length;

    // Success rate
    if (this.runs.length > 0) {
      const successfulRuns = this.runs.filter(
        (run) => run.status === "PASSED",
      ).length;
      const successRate = Math.round((successfulRuns / this.runs.length) * 100);
      document.getElementById("success-rate").textContent = `${successRate}%`;
    }

    // Average duration
    if (this.runs.length > 0) {
      const totalDuration = this.runs.reduce(
        (sum, run) => sum + (run.duration || 0),
        0,
      );
      const avgDuration = Math.round(totalDuration / this.runs.length);
      document.getElementById("avg-duration").textContent = `${avgDuration}s`;
    }

    // Last run
    if (this.runs.length > 0) {
      const lastRun = this.runs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      )[0];
      document.getElementById("last-run").textContent = DemoUtils.formatTimeAgo(
        lastRun.timestamp,
      );
    } else {
      document.getElementById("last-run").textContent = "Never";
    }
  }

  renderProjectRuns() {
    const tableBody = document.getElementById("project-runs-table");
    const emptyState = document.getElementById("empty-runs-state");

    if (this.runs.length === 0) {
      tableBody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    // Sort runs by timestamp (newest first)
    const sortedRuns = [...this.runs].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );

    tableBody.innerHTML = sortedRuns
      .map(
        (run) => `
      <tr class="hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer transform" onclick="demoProjectDetails.viewRun('${run.id}')">
        <td class="px-6 py-4 whitespace-nowrap">
          ${DemoUtils.getStatusBadge(run.status)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${run.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${run.framework}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${run.duration}s
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${DemoUtils.formatTimeAgo(run.timestamp)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" onclick="event.stopPropagation()">
          <button
            onclick="demoProjectDetails.deleteRun('${run.id}')"
            class="text-red-600 hover:text-red-900 transition-colors"
            title="Delete run"
          >
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </td>
      </tr>
    `,
      )
      .join("");

    // Recreate icons for new elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  setupEventListeners() {
    // Add run button
    document.getElementById("add-run-btn")?.addEventListener("click", () => {
      this.showAddRunModal();
    });

    // Edit project button
    document
      .getElementById("edit-project-btn")
      ?.addEventListener("click", () => {
        this.showEditModal();
      });

    // Delete project button
    document
      .getElementById("delete-project-btn")
      ?.addEventListener("click", () => {
        this.deleteProject();
      });

    // Modal close buttons
    document
      .getElementById("close-add-run-modal")
      ?.addEventListener("click", () => {
        this.hideAddRunModal();
      });

    document
      .getElementById("close-edit-modal")
      ?.addEventListener("click", () => {
        this.hideEditModal();
      });

    // Cancel buttons
    document.getElementById("cancel-add-run")?.addEventListener("click", () => {
      this.hideAddRunModal();
    });

    document.getElementById("cancel-edit")?.addEventListener("click", () => {
      this.hideEditModal();
    });

    // Form submissions
    document.getElementById("add-run-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addRun();
    });

    document
      .getElementById("edit-project-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.updateProject();
      });

    // Close modals on outside click
    document.getElementById("add-run-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "add-run-modal") {
        this.hideAddRunModal();
      }
    });

    document
      .getElementById("edit-project-modal")
      ?.addEventListener("click", (e) => {
        if (e.target.id === "edit-project-modal") {
          this.hideEditModal();
        }
      });
  }

  showAddRunModal() {
    document.getElementById("add-run-modal").classList.remove("hidden");
    document.getElementById("add-run-name").focus();
  }

  hideAddRunModal() {
    document.getElementById("add-run-modal").classList.add("hidden");
    document.getElementById("add-run-form").reset();
  }

  showEditModal() {
    document.getElementById("edit-project-modal").classList.remove("hidden");
    document.getElementById("edit-project-name").value = this.project.name;
    document.getElementById("edit-project-description").value =
      this.project.description || "";
    document.getElementById("edit-project-framework").value =
      this.project.framework || "";
    document.getElementById("edit-project-name").focus();
  }

  hideEditModal() {
    document.getElementById("edit-project-modal").classList.add("hidden");
  }

  addRun() {
    const formData = new FormData(document.getElementById("add-run-form"));

    // Generate test results first to determine run status
    // Assume current project is stable, with varied run types
    const runType = Math.random() < 0.8 ? "PERFECT" : "MINOR_ISSUES";
    const testResults = DemoDataGenerator.generateTestResults(true, runType);
    const runStatus = DemoDataGenerator.determineRunStatus(testResults);
    const totalDuration = testResults.reduce(
      (sum, test) => sum + test.duration,
      0,
    );

    // Create new run
    const newRun = {
      id: DemoUtils.generateId(),
      name: formData.get("name"),
      project: this.project.id,
      framework: formData.get("framework") || this.project.framework,
      environment: formData.get("environment") || "Development",
      status: runStatus,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      branch: "main",
      commit: "abc1234",
      testResults: testResults,
    };

    // Save to localStorage
    const allRuns = DemoUtils.getRuns();
    allRuns.push(newRun);
    DemoUtils.saveRuns(allRuns);

    // Hide modal and reload data
    this.hideAddRunModal();
    this.loadProjectData();
    DemoUtils.showSuccess("Test run added successfully!");
  }

  updateProject() {
    const formData = new FormData(document.getElementById("edit-project-form"));

    const updatedProject = {
      ...this.project,
      name: formData.get("name"),
      description: formData.get("description"),
      framework: formData.get("framework"),
    };

    // Update in localStorage
    const allProjects = DemoUtils.getProjects();
    const projectIndex = allProjects.findIndex((p) => p.id === this.projectId);
    if (projectIndex !== -1) {
      allProjects[projectIndex] = updatedProject;
      DemoUtils.saveProjects(allProjects);
      this.project = updatedProject;
      this.renderProjectDetails();
      this.hideEditModal();
      DemoUtils.showSuccess("Project updated successfully!");
    }
  }

  deleteProject() {
    if (
      confirm(
        "Are you sure you want to delete this project? This will also delete all associated test runs.",
      )
    ) {
      // Delete project
      const allProjects = DemoUtils.getProjects();
      const updatedProjects = allProjects.filter(
        (p) => p.id !== this.projectId,
      );
      DemoUtils.saveProjects(updatedProjects);

      // Delete associated runs
      const allRuns = DemoUtils.getRuns();
      const updatedRuns = allRuns.filter((r) => r.project !== this.projectId);
      DemoUtils.saveRuns(updatedRuns);

      // Redirect to projects page
      window.location.href = "demo-projects.html";
    }
  }

  viewRun(runId) {
    window.location.href = `demo-run-details.html?id=${runId}`;
  }

  deleteRun(runId) {
    if (confirm("Are you sure you want to delete this test run?")) {
      // Delete run
      const allRuns = DemoUtils.getRuns();
      const updatedRuns = allRuns.filter((r) => r.id !== runId);
      DemoUtils.saveRuns(updatedRuns);

      // Reload data
      this.loadProjectData();
      DemoUtils.showSuccess("Test run deleted successfully!");
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
          <a href="demo-projects.html" class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Back to Projects
          </a>
        </div>
      `;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }
}

// Initialize project details when DOM is loaded
let demoProjectDetails;
document.addEventListener("DOMContentLoaded", () => {
  demoProjectDetails = new DemoProjectDetails();
  DemoUtils.initializeClass("demoProjectDetails", demoProjectDetails);
});
