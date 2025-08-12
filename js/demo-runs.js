// Demo Test Runs JavaScript
class DemoRuns {
  constructor() {
    this.runs = [];
    this.projects = [];
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
  }

  loadData() {
    this.runs = DemoUtils.getRuns();
    this.projects = DemoUtils.getProjects();
    this.renderRuns();
    this.updateStats();
  }

  saveRuns() {
    DemoUtils.saveRuns(this.runs);
  }

  setupEventListeners() {
    // Upload results button
    document
      .getElementById("upload-results-btn")
      ?.addEventListener("click", () => {
        this.showUploadModal();
      });

    // Empty state upload button
    document
      .getElementById("empty-upload-btn")
      ?.addEventListener("click", () => {
        this.showUploadModal();
      });

    // Modal close button
    document
      .getElementById("close-upload-modal")
      ?.addEventListener("click", () => {
        this.hideUploadModal();
      });

    // Cancel button
    document.getElementById("cancel-upload")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hideUploadModal();
    });

    // Form submission
    document
      .getElementById("upload-results-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.createTestRun();
      });

    // Close modal on outside click
    document
      .getElementById("upload-results-modal")
      ?.addEventListener("click", (e) => {
        if (e.target.id === "upload-results-modal") {
          this.hideUploadModal();
        }
      });

    // Prevent modal content clicks from closing the modal
    const modalContent = document
      .getElementById("upload-results-modal")
      ?.querySelector(".relative.top-20.mx-auto.p-5.border.w-96.shadow-lg.rounded-md.bg-white");
    
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Populate project select on modal show
    document
      .getElementById("upload-results-modal")
      ?.addEventListener("shown", () => {
        this.populateProjectSelect();
      });
  }

  showUploadModal() {
    document.getElementById("upload-results-modal").classList.remove("hidden");
    this.populateProjectSelect();
    document.getElementById("run-name").focus();
  }

  hideUploadModal() {
    document.getElementById("upload-results-modal").classList.add("hidden");
    document.getElementById("upload-results-form").reset();
  }

  populateProjectSelect() {
    const projectSelect = document.getElementById("run-project");
    if (!projectSelect) return;

    projectSelect.innerHTML = '<option value="">Select project</option>';

    this.projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      projectSelect.appendChild(option);
    });
  }

  createTestRun() {
    const formData = new FormData(
      document.getElementById("upload-results-form"),
    );

    const newRun = {
      id: DemoUtils.generateId(),
      name: formData.get("name"),
      project: formData.get("project"),
      framework: formData.get("framework"),
      status: formData.get("status"),
      duration: parseInt(formData.get("duration")) || 0,
      timestamp: new Date().toISOString(),
      branch: "main",
      commit: "abc1234",
      environment: "Development",
    };

    this.runs.push(newRun);
    this.saveRuns();
    this.renderRuns();
    this.updateStats();
    this.hideUploadModal();

    DemoUtils.showSuccess("Test run created successfully!");
  }

  viewRun(runId) {
    window.location.href = `demo-run-details.html?id=${runId}`;
  }

  deleteRun(runId) {
    if (confirm("Are you sure you want to delete this test run?")) {
      this.runs = this.runs.filter((r) => r.id !== runId);
      this.saveRuns();
      this.renderRuns();
      this.updateStats();
      DemoUtils.showSuccess("Test run deleted successfully!");
    }
  }

  renderRuns() {
    const tableBody = document.getElementById("runs-table-body");
    const emptyState = document.getElementById("empty-runs-state");

    if (!tableBody) return;

    if (this.runs.length === 0) {
      tableBody.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    tableBody.innerHTML = this.runs
      .map((run) => {
        const project = this.projects.find((p) => p.id === run.project);
        const projectName = project ? project.name : "Unknown Project";

        return `
        <tr class="hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer transform" onclick="demoRuns.viewRun('${run.id}')">
          <td class="px-6 py-4 whitespace-nowrap">
            ${DemoUtils.getStatusBadge(run.status)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${run.name}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${projectName}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${run.framework || "Unknown"}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${run.duration}s</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${DemoUtils.formatTimeAgo(run.timestamp)}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              onclick="event.stopPropagation(); demoRuns.deleteRun('${run.id}')"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  updateStats() {
    const totalRuns = this.runs.length;
    const passedRuns = this.runs.filter((r) => r.status === "PASSED").length;
    const failedRuns = this.runs.filter((r) => r.status === "FAILED").length;
    const avgDuration =
      totalRuns > 0
        ? Math.round(
            this.runs.reduce((sum, r) => sum + r.duration, 0) / totalRuns,
          )
        : 0;

    document.getElementById("total-runs-count").textContent = totalRuns;
    document.getElementById("passed-runs-count").textContent = passedRuns;
    document.getElementById("failed-runs-count").textContent = failedRuns;
    document.getElementById("avg-duration-display").textContent =
      `${avgDuration}s`;
  }
}

// Initialize runs when DOM is loaded
let demoRuns;
document.addEventListener("DOMContentLoaded", () => {
  demoRuns = new DemoRuns();
  DemoUtils.initializeClass("demoRuns", demoRuns);
});
