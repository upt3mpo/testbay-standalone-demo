// TestBay Demo Application
class TestBayApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DemoDataGenerator to be available
    if (typeof DemoDataGenerator !== "undefined") {
      this.setupLocalStorage();
    } else {
      // Retry after a short delay
      setTimeout(() => this.init(), 100);
      return;
    }
    this.setupEventListeners();
    console.log("TestBay Demo initialized");
  }

  setupLocalStorage() {
    // Initialize demo data for first-time users, or ensure existing data has test results
    const dataGenerated = DemoDataGenerator.initializeDemoData();
    if (dataGenerated) {
      console.log("Demo data generated for first-time user");
    } else {
      console.log("Existing demo data updated with test results");
    }
  }

  setupEventListeners() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Add loading states to buttons
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", function () {
        if (this.type !== "submit") {
          this.classList.add("opacity-75");
          setTimeout(() => {
            this.classList.remove("opacity-75");
          }, 200);
        }
      });
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TestBayApp();
});
