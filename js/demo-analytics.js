// Demo Analytics JavaScript
class DemoAnalytics {
  constructor() {
    this.runs = [];
    this.projects = [];
    this.init();
  }

  init() {
    this.loadData();
    this.renderAnalytics();
  }

  setupEventListeners() {
    // Generate demo data button
    document.getElementById("generate-demo-data-btn")?.addEventListener("click", () => {
      this.generateDemoData();
    });
  }

  generateDemoData() {
    try {
      if (typeof DemoDataGenerator !== "undefined") {
        DemoDataGenerator.initializeDemoData();
        this.loadData();
        this.renderAnalytics();
        DemoUtils.showSuccess("Demo data generated successfully!");
      } else {
        DemoUtils.showError("Demo data generator not available");
      }
    } catch (error) {
      console.error("Failed to generate demo data:", error);
      DemoUtils.showError("Failed to generate demo data");
    }
  }

  loadData() {
    this.runs = DemoUtils.getRuns();
    this.projects = DemoUtils.getProjects();
  }

  renderAnalytics() {
    if (this.runs.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    this.updateKeyMetrics();
    this.renderSuccessRateChart();
    this.renderFrameworkDistribution();
    this.renderStatusDistribution();
    this.renderProjectSuccessChart();
    this.renderProjectPerformance();
    this.renderRecentActivity();
  }

  showEmptyState() {
    document.getElementById("empty-analytics")?.classList.remove("hidden");
  }

  hideEmptyState() {
    document.getElementById("empty-analytics")?.classList.add("hidden");
  }

  updateKeyMetrics() {
    // Overall success rate
    const totalTests = this.runs.reduce((sum, run) => {
      return sum + (run.testResults ? run.testResults.length : 0);
    }, 0);
    
    const passedTests = this.runs.reduce((sum, run) => {
      if (!run.testResults) return sum;
      return sum + run.testResults.filter(test => test.status === "PASSED").length;
    }, 0);
    
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    document.getElementById("overall-success-rate").textContent = `${successRate}%`;
    
    // Total tests
    document.getElementById("total-tests").textContent = totalTests;
    
    // Average duration
    if (this.runs.length > 0) {
      const totalDuration = this.runs.reduce((sum, run) => sum + (run.duration || 0), 0);
      const avgDuration = Math.round(totalDuration / this.runs.length);
      document.getElementById("avg-duration-analytics").textContent = `${avgDuration}s`;
    }
    
    // Tests this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentRuns = this.runs.filter(run => new Date(run.timestamp) > oneWeekAgo);
    const testsThisWeek = recentRuns.reduce((sum, run) => {
      return sum + (run.testResults ? run.testResults.length : 0);
    }, 0);
    document.getElementById("tests-this-week").textContent = testsThisWeek;
  }

  renderSuccessRateChart() {
    const chartContainer = document.getElementById("success-rate-chart");
    if (!chartContainer) return;

    // Generate last 7 days of data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    // Calculate success rate for each day
    const dailySuccessRates = last7Days.map(date => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRuns = this.runs.filter(run => {
        const runDate = new Date(run.timestamp);
        return runDate >= dayStart && runDate <= dayEnd;
      });

      if (dayRuns.length === 0) return 0;

      const totalTests = dayRuns.reduce((sum, run) => {
        return sum + (run.testResults ? run.testResults.length : 0);
      }, 0);

      const passedTests = dayRuns.reduce((sum, run) => {
        if (!run.testResults) return sum;
        return sum + run.testResults.filter(test => test.status === "PASSED").length;
      }, 0);

      return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    });

    // Render chart bars
    chartContainer.innerHTML = dailySuccessRates.map((rate, index) => {
      const height = Math.max(10, (rate / 100) * 200); // Min height of 10px
      const date = last7Days[index];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return `
        <div class="flex flex-col items-center">
          <div 
            class="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
            style="height: ${height}px;"
            title="${dayName}: ${rate}%"
          ></div>
          <span class="text-xs text-gray-500 mt-2">${dayName}</span>
        </div>
      `;
    }).join("");
  }

  renderFrameworkDistribution() {
    const container = document.getElementById("framework-distribution");
    if (!container) return;

    // Count runs by framework
    const frameworkCounts = {};
    this.runs.forEach(run => {
      const framework = run.framework || "Unknown";
      frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1;
    });

    // Sort by count
    const sortedFrameworks = Object.entries(frameworkCounts)
      .sort(([,a], [,b]) => b - a);

    container.innerHTML = sortedFrameworks.map(([framework, count]) => {
      const percentage = Math.round((count / this.runs.length) * 100);
      const barWidth = Math.max(20, percentage * 2); // Min width of 20px
      
      return `
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">${framework}</span>
          <div class="flex items-center space-x-3">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style="width: ${barWidth}px;"
              ></div>
            </div>
            <span class="text-sm text-gray-600 w-12 text-right">${percentage}%</span>
          </div>
        </div>
      `;
    }).join("");
  }

  renderStatusDistribution() {
    const container = document.getElementById("status-distribution");
    if (!container) return;

    // Count runs by status
    const statusCounts = {};
    this.runs.forEach(run => {
      const status = run.status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Sort by count
    const sortedStatuses = Object.entries(statusCounts)
      .sort(([,a], [,b]) => b - a);

    container.innerHTML = sortedStatuses.map(([status, count]) => {
      const percentage = Math.round((count / this.runs.length) * 100);
      const color = status === "PASSED" ? "bg-green-500" : 
                   status === "FAILED" ? "bg-red-500" : "bg-yellow-500";
      
      return `
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 ${color} rounded-full"></div>
            <span class="text-sm font-medium text-gray-900">${status}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div 
                class="${color} h-2 rounded-full transition-all duration-300"
                style="width: ${percentage * 2.4}px;"
              ></div>
            </div>
            <span class="text-sm text-gray-600 w-12 text-right">${percentage}%</span>
          </div>
        </div>
      `;
    }).join("");
  }

  renderProjectSuccessChart() {
    const container = document.getElementById("project-success-chart");
    if (!container) return;

    // Calculate success rate for each project
    const projectSuccessRates = this.projects.map(project => {
      const projectRuns = this.runs.filter(run => run.project === project.id);
      if (projectRuns.length === 0) return { project, successRate: 0, runCount: 0 };

      const totalTests = projectRuns.reduce((sum, run) => {
        return sum + (run.testResults ? run.testResults.length : 0);
      }, 0);

      const passedTests = projectRuns.reduce((sum, run) => {
        if (!run.testResults) return sum;
        return sum + run.testResults.filter(test => test.status === "PASSED").length;
      }, 0);

      const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
      return { project, successRate, runCount: projectRuns.length };
    });

    // Sort by success rate
    projectSuccessRates.sort((a, b) => b.successRate - a.successRate);

    container.innerHTML = projectSuccessRates.map(({ project, successRate, runCount }) => {
      const barWidth = Math.max(20, successRate * 2); // Min width of 20px
      const color = successRate >= 80 ? "bg-green-500" : 
                   successRate >= 60 ? "bg-yellow-500" : "bg-red-500";
      
      return `
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-900">${project.name}</span>
              <span class="text-sm text-gray-600">${runCount} runs</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="${color} h-2 rounded-full transition-all duration-300"
                style="width: ${barWidth}px;"
              ></div>
            </div>
          </div>
          <span class="text-sm font-medium text-gray-900 ml-4 w-16 text-right">${successRate}%</span>
        </div>
      `;
    }).join("");
  }

  renderProjectPerformance() {
    const container = document.getElementById("project-performance");
    if (!container) return;

    // Calculate performance metrics for each project
    const projectPerformance = this.projects.map(project => {
      const projectRuns = this.runs.filter(run => run.project === project.id);
      if (projectRuns.length === 0) return { project, avgDuration: 0, totalRuns: 0 };

      const totalDuration = projectRuns.reduce((sum, run) => sum + (run.duration || 0), 0);
      const avgDuration = Math.round(totalDuration / projectRuns.length);

      return { project, avgDuration, totalRuns: projectRuns.length };
    });

    // Sort by total runs
    projectPerformance.sort((a, b) => b.totalRuns - a.totalRuns);

    container.innerHTML = projectPerformance.map(({ project, avgDuration, totalRuns }) => {
      return `
        <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div class="flex items-center space-x-3">
            <i data-lucide="folder" class="h-5 w-5 text-blue-600"></i>
            <div>
              <p class="text-sm font-medium text-gray-900">${project.name}</p>
              <p class="text-xs text-gray-500">${project.framework || "Unknown"}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">${avgDuration}s</p>
            <p class="text-xs text-gray-500">${totalRuns} runs</p>
          </div>
        </div>
      `;
    }).join("");

    // Recreate icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  renderRecentActivity() {
    const container = document.getElementById("recent-activity");
    if (!container) return;

    // Get recent runs (last 10)
    const recentRuns = this.runs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    if (recentRuns.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">No recent activity</p>';
      return;
    }

    container.innerHTML = recentRuns.map(run => {
      const project = this.projects.find(p => p.id === run.project);
      const projectName = project ? project.name : "Unknown Project";
      
      return `
        <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
          <div class="flex-shrink-0">
            <i data-lucide="${DemoUtils.getStatusIcon(run.status)}" class="h-5 w-5 ${
              run.status === "PASSED" ? "text-green-600" : 
              run.status === "FAILED" ? "text-red-600" : "text-yellow-600"
            }"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">${run.name}</p>
            <p class="text-xs text-gray-500">${projectName} • ${DemoUtils.formatTimeAgo(run.timestamp)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">${run.duration}s</p>
          </div>
        </div>
      `;
    }).join("");

    // Recreate icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

// Initialize analytics when DOM is loaded
let demoAnalytics;
document.addEventListener("DOMContentLoaded", () => {
  demoAnalytics = new DemoAnalytics();
  DemoUtils.initializeClass("demoAnalytics", demoAnalytics);
});
