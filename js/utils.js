// Shared utilities for TestBay Demo
class DemoUtils {
  // Generate unique ID
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Format timestamp to relative time
  static formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  }

  // Show notification message
  static showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Get status badge HTML
  static getStatusBadge(status) {
    const statusConfig = {
      PASSED: { text: "PASSED", classes: "bg-green-100 text-green-800", icon: "✓" },
      FAILED: { text: "FAILED", classes: "bg-red-100 text-red-800", icon: "✗" },
      SKIPPED: { text: "SKIPPED", classes: "bg-yellow-100 text-yellow-800", icon: "⏭" },
      RUNNING: { text: "RUNNING", classes: "bg-blue-100 text-blue-800", icon: "▶" },
      UNSTABLE: { text: "UNSTABLE", classes: "bg-yellow-100 text-yellow-800", icon: "⚠" },
      CRITICAL: { text: "CRITICAL", classes: "bg-red-100 text-red-800", icon: "🚨" },
      UNKNOWN: { text: "UNKNOWN", classes: "bg-gray-100 text-gray-800", icon: "?" }
    };

    const config = statusConfig[status] || statusConfig.UNKNOWN;
    return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.classes}">
      ${config.icon} ${config.text}
    </span>`;
  }

  // Get status badge classes only
  static getStatusBadgeClasses(status) {
    const statusConfig = {
      PASSED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800", 
      SKIPPED: "bg-yellow-100 text-yellow-800",
      RUNNING: "bg-blue-100 text-blue-800",
      UNSTABLE: "bg-yellow-100 text-yellow-800",
      CRITICAL: "bg-red-100 text-red-800",
      UNKNOWN: "bg-gray-100 text-gray-800"
    };
    return statusConfig[status] || statusConfig.UNKNOWN;
  }

  // Get status icon for display
  static getStatusIcon(status) {
    const iconMap = {
      PASSED: "check-circle",
      FAILED: "x-circle", 
      SKIPPED: "skip-forward",
      RUNNING: "play-circle",
      UNSTABLE: "alert-triangle",
      CRITICAL: "alert-octagon",
      UNKNOWN: "help-circle"
    };
    return iconMap[status] || "help-circle";
  }

  // LocalStorage operations
  static getProjects() {
    return JSON.parse(localStorage.getItem("demo_projects") || "[]");
  }

  static saveProjects(projects) {
    localStorage.setItem("demo_projects", JSON.stringify(projects));
  }

  static getRuns() {
    return JSON.parse(localStorage.getItem("demo_runs") || "[]");
  }

  static saveRuns(runs) {
    localStorage.setItem("demo_runs", JSON.stringify(runs));
  }

  static clearAllData() {
    localStorage.removeItem("demo_projects");
    localStorage.removeItem("demo_runs");
  }

  // Common initialization pattern
  static initializeClass(className, instance) {
    if (typeof window !== "undefined") {
      window[className] = instance;
    }
  }

  // Error handling
  static showError(message) {
    this.showNotification(message, "error");
  }

  static showSuccess(message) {
    this.showNotification(message, "success");
  }
}
