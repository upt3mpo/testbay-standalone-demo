// Demo Dashboard JavaScript
class DemoDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.loadDashboardData();
    this.setupEventListeners();
  }

  loadDashboardData() {
    const projects = DemoUtils.getProjects();
    const runs = DemoUtils.getRuns();
    this.updateStats(projects, runs);
    this.updateRecentRuns(runs);
    this.updateProjectStatus(projects);
  }

  updateStats(projects, runs) {
    // Update project count
    document.getElementById("total-projects").textContent = projects.length;

    // Update run count
    document.getElementById("total-runs").textContent = runs.length;

    // Calculate success rate
    if (runs.length > 0) {
      const passedRuns = runs.filter((r) => r.status === "PASSED").length;
      const successRate = Math.round((passedRuns / runs.length) * 100);
      document.getElementById("success-rate").textContent = `${successRate}%`;
    } else {
      document.getElementById("success-rate").textContent = "0%";
    }

    // Calculate average duration
    if (runs.length > 0) {
      const totalDuration = runs.reduce((sum, r) => sum + (r.duration || 0), 0);
      const avgDuration = Math.round(totalDuration / runs.length);
      document.getElementById("avg-duration").textContent = `${avgDuration}s`;
    } else {
      document.getElementById("avg-duration").textContent = "0s";
    }
  }

  updateRecentRuns(runs) {
    const recentRunsContainer = document.getElementById("recent-runs");
    if (!recentRunsContainer) return;

    // Get 5 most recent runs
    const recentRuns = runs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    if (recentRuns.length === 0) {
      recentRunsContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No test runs yet</p>
        </div>
      `;
      return;
    }

    recentRunsContainer.innerHTML = recentRuns
      .map((run) => {
        const project = DemoUtils.getProjects().find(
          (p) => p.id === run.project,
        );
        const projectName = project ? project.name : "Unknown Project";

        return `
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md hover:scale-[1.02] hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform" onclick="window.location.href='demo-run-details.html?id=${run.id}'">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <i data-lucide="${DemoUtils.getStatusIcon(run.status)}" class="h-5 w-5 ${
                run.status === "PASSED"
                  ? "text-green-600"
                  : run.status === "FAILED"
                    ? "text-red-600"
                    : "text-yellow-600"
              }"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">${run.name}</p>
              <p class="text-xs text-gray-500">${projectName} • ${DemoUtils.formatTimeAgo(run.timestamp)}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">${run.duration}s</p>
            <p class="text-xs text-gray-500">${run.framework || "Unknown"}</p>
          </div>
        </div>
      `;
      })
      .join("");

    // Recreate icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  updateProjectStatus(projects) {
    const projectStatusContainer = document.getElementById("project-status");
    if (!projectStatusContainer) return;

    if (projects.length === 0) {
      projectStatusContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No projects yet</p>
        </div>
      `;
      return;
    }

    projectStatusContainer.innerHTML = projects
      .map((project) => {
        const projectRuns = DemoUtils.getRuns().filter(
          (r) => r.project === project.id,
        );
        const successRate =
          projectRuns.length > 0
            ? Math.round(
                (projectRuns.filter((r) => r.status === "PASSED").length /
                  projectRuns.length) *
                  100,
              )
            : 0;

        return `
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md hover:scale-[1.02] hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform" onclick="window.location.href='demo-project-details.html?id=${project.id}'">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <i data-lucide="folder" class="h-5 w-5 text-blue-600"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">${project.name}</p>
              <p class="text-xs text-gray-500">${project.framework || "Unknown"} • ${projectRuns.length} runs</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">${successRate}%</p>
            <p class="text-xs text-gray-500">Success rate</p>
          </div>
        </div>
      `;
      })
      .join("");

    // Recreate icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  setupEventListeners() {
    // Add any dashboard-specific event listeners here
    // For now, the dashboard is mostly read-only
  }
}

// Initialize dashboard when DOM is loaded
let demoDashboard;
document.addEventListener("DOMContentLoaded", () => {
  demoDashboard = new DemoDashboard();
  DemoUtils.initializeClass("demoDashboard", demoDashboard);
});
