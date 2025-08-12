// Demo Settings JavaScript
class DemoSettings {
  constructor() {
    this.init();
  }

  init() {
    this.updateDataStats();
    this.setupEventListeners();
  }

  updateDataStats() {
    const projects = DemoUtils.getProjects();
    const runs = DemoUtils.getRuns();

    // Update counts
    document.getElementById("projects-count").textContent = projects.length;
    document.getElementById("runs-count").textContent = runs.length;

    // Calculate storage size (rough estimate)
    const projectsSize = JSON.stringify(projects).length;
    const runsSize = JSON.stringify(runs).length;
    const totalSize = projectsSize + runsSize;
    const sizeKB = Math.round(totalSize / 1024);

    document.getElementById("storage-size").textContent = `${sizeKB} KB`;
  }

  setupEventListeners() {
    // Reset data button
    document.getElementById("reset-data-btn")?.addEventListener("click", () => {
      this.showResetConfirmation();
    });

    // Reset confirmation modal
    document
      .getElementById("reset-confirmation-modal")
      ?.addEventListener("click", (e) => {
        if (e.target.id === "reset-confirmation-modal") {
          this.hideResetConfirmation();
        }
      });

    // Cancel reset
    document.getElementById("cancel-reset")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hideResetConfirmation();
    });

    // Confirm reset
    document.getElementById("confirm-reset")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.resetAllData();
    });

    // Prevent modal content clicks from closing the modal
    const modalContent = document
      .getElementById("reset-confirmation-modal")
      ?.querySelector(".relative.top-20.mx-auto.p-5.border.w-96.shadow-lg.rounded-md.bg-white");
    
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }

  showResetConfirmation() {
    document
      .getElementById("reset-confirmation-modal")
      .classList.remove("hidden");
  }

  hideResetConfirmation() {
    document.getElementById("reset-confirmation-modal").classList.add("hidden");
  }

  resetAllData() {
    try {
      // Clear all data
      DemoUtils.clearAllData();

      // Check if user wants to generate fake data
      const generateFakeData =
        document.getElementById("generate-fake-data").checked;

      if (generateFakeData && typeof DemoDataGenerator !== "undefined") {
        DemoDataGenerator.initializeDemoData();
        DemoUtils.showSuccess(
          "Demo data has been reset and new sample data generated!",
        );
      } else {
        DemoUtils.showSuccess("All demo data has been reset!");
      }

      // Update stats
      this.updateDataStats();

      // Hide modal
      this.hideResetConfirmation();

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "demo-dashboard.html";
      }, 1500);
    } catch (error) {
      console.error("Error resetting data:", error);
      DemoUtils.showError("Reset failed. Please try again.");
    }
  }
}

// Initialize settings when DOM is loaded
let demoSettings;
document.addEventListener("DOMContentLoaded", () => {
  demoSettings = new DemoSettings();
  DemoUtils.initializeClass("demoSettings", demoSettings);
});
