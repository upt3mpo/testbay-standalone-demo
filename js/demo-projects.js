// Demo Projects JavaScript
class DemoProjects {
  constructor() {
    this.projects = [];
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
  }

  loadProjects() {
    this.projects = DemoUtils.getProjects();
    this.renderProjects();
  }

  saveProjects() {
    DemoUtils.saveProjects(this.projects);
  }

  setupEventListeners() {
    // Create project button
    document
      .getElementById("create-project-btn")
      ?.addEventListener("click", () => {
        this.showCreateModal();
      });

    // Empty state create button
    document
      .getElementById("empty-create-btn")
      ?.addEventListener("click", () => {
        this.showCreateModal();
      });

    // Modal close button
    document.getElementById("close-modal")?.addEventListener("click", () => {
      this.hideCreateModal();
    });

    // Cancel button
    document.getElementById("cancel-create")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hideCreateModal();
    });

    // Form submission
    document
      .getElementById("create-project-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.createProject();
      });

    // Close modal on outside click
    document
      .getElementById("create-project-modal")
      ?.addEventListener("click", (e) => {
        if (e.target.id === "create-project-modal") {
          this.hideCreateModal();
        }
      });

    // Prevent modal content clicks from closing the modal
    const modalContent = document
      .getElementById("create-project-modal")
      ?.querySelector(".relative.top-20.mx-auto.p-5.border.w-96.shadow-lg.rounded-md.bg-white");
    
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });
      
      // Also prevent any clicks within the modal content from bubbling up
      modalContent.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      
      modalContent.addEventListener("mouseup", (e) => {
        e.stopPropagation();
      });
    }
  }

  showCreateModal() {
    document.getElementById("create-project-modal").classList.remove("hidden");
    document.getElementById("project-name").focus();
  }

  hideCreateModal() {
    document.getElementById("create-project-modal").classList.add("hidden");
    document.getElementById("create-project-form").reset();
  }

  createProject() {
    const formData = new FormData(
      document.getElementById("create-project-form"),
    );

    const newProject = {
      id: DemoUtils.generateId(),
      name: formData.get("name"),
      description: formData.get("description"),
      framework: formData.get("framework"),
      createdAt: new Date().toISOString(),
      status: "active",
    };

    this.projects.push(newProject);
    this.saveProjects();
    this.renderProjects();
    this.hideCreateModal();

    DemoUtils.showSuccess("Project created successfully!");
  }

  deleteProject(projectId) {
    if (confirm("Are you sure you want to delete this project?")) {
      this.projects = this.projects.filter((p) => p.id !== projectId);
      this.saveProjects();
      this.renderProjects();
      DemoUtils.showSuccess("Project deleted successfully!");
    }
  }

  renderProjects() {
    const container = document.getElementById("projects-container");
    const emptyState = document.getElementById("empty-state");

    if (!container) return;

    if (this.projects.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    container.innerHTML = this.projects
      .map(
        (project) => `
      <div class="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer transform" data-project-id="${project.id}" onclick="demoProjects.viewProject('${project.id}')">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">${project.name}</h3>
            <p class="text-gray-600 text-sm mb-3">${project.description || "No description"}</p>
            <div class="flex items-center space-x-3">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ${project.framework || "Unknown"}
              </span>
              <span class="text-xs text-gray-500">
                Created ${DemoUtils.formatTimeAgo(project.createdAt)}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button
              class="edit-project-btn text-gray-600 hover:text-gray-800 text-sm font-medium"
              data-project-id="${project.id}"
            >
              Edit
            </button>
            <button
              class="delete-project-btn text-red-600 hover:text-red-800 text-sm font-medium"
              data-project-id="${project.id}"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    // Add event listeners to the action buttons
    container.querySelectorAll(".edit-project-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute("data-project-id");
        this.editProject(projectId);
      });
    });

    container.querySelectorAll(".delete-project-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute("data-project-id");
        this.deleteProject(projectId);
      });
    });
  }

  viewProject(projectId) {
    window.location.href = `demo-project-details.html?id=${projectId}`;
  }

  editProject(projectId) {
    // For now, just redirect to project details page
    // Could implement inline editing later
    this.viewProject(projectId);
  }
}

// Initialize projects when DOM is loaded
let demoProjects;
document.addEventListener("DOMContentLoaded", () => {
  demoProjects = new DemoProjects();
  DemoUtils.initializeClass("demoProjects", demoProjects);
});
