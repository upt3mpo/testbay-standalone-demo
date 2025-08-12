# TestBay Standalone Demo

A completely standalone demo of the TestBay test result management platform. This demo runs entirely in the browser with no backend dependencies.

## 🚀 **Features**

- **No Frameworks Required** - Pure HTML, CSS, and JavaScript
- **Local Data Storage** - All data persists in your browser using localStorage
- **Full Functionality** - Projects, test runs, analytics, and settings
- **File Upload Support** - Upload and parse test result files
- **Responsive Design** - Works on all devices
- **GitHub Pages Ready** - Deploy anywhere with static hosting

## 📁 **File Structure**

```
standalone-demo/
├── index.html          # Landing page
├── pricing.html        # Pricing page
├── demo.html           # Demo overview page
├── demo-dashboard.html # Dashboard functionality
├── demo-projects.html  # Project management
├── demo-runs.html      # Test run management
├── demo-analytics.html # Analytics and insights
├── demo-settings.html  # Demo settings and data management
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── app.js          # Main application logic
│   ├── dashboard.js    # Dashboard functionality
│   ├── projects.js     # Projects functionality
│   └── runs.js         # Test runs functionality
└── assets/             # Images and other assets
```

## 🌐 **Deployment Options**

### **GitHub Pages (Recommended)**

1. Create a new repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your demo will be available at `https://username.github.io/repository-name`

### **Netlify**

1. Drag and drop the `standalone-demo` folder to Netlify
2. Your demo will be deployed instantly
3. Get a custom URL and optional custom domain

### **Vercel**

1. Connect your GitHub repository
2. Vercel will automatically deploy and update
3. Get preview deployments for every commit

### **Any Static Hosting**

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Traditional web hosting

## 🛠 **Local Development**

1. **Clone or download** the standalone-demo folder
2. **Open in browser** - Just double-click `index.html`
3. **Use local server** (recommended):

   ```bash
   cd standalone-demo
   python -m http.server 8000
   # or
   python3 -m http.server 8000
   # or
   npx serve .
   ```

4. **Visit** `http://localhost:8000`

## 🧪 **Testing**

The demo includes a comprehensive Playwright test suite to ensure all functionality works correctly.

### **Quick Test Run**

```bash
cd standalone-demo

# Run all tests (Linux/Mac)
./run-tests.sh

# Run all tests (Windows)
run-tests.bat

# Or use npm directly
npm install
npm run install-browsers
npm test
```

### **Test Options**

- `npm test` - Run all tests
- `npm run test:headed` - Run tests with browser visible
- `npm run test:ui` - Run tests with Playwright UI
- `npm run test:debug` - Run tests in debug mode
- `npm run test:report` - View test report

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 📱 **Demo Functionality**

### **Dashboard**

- View project and test run statistics
- See success rates and performance metrics
- Real-time data from localStorage

### **Projects**

- Create new test projects
- Set framework and description
- View project statistics
- Delete projects

### **Test Runs**

- Upload test result files (.txt, .log, .xml, .json)
- Paste test output directly
- Automatic parsing and analysis
- View test results and statistics

### **Analytics**

- Framework performance comparison
- Test success trends
- Performance metrics
- Real-time calculations

### **Settings**

- View current demo data statistics
- Clear demo data (projects, runs, analytics)
- Start fresh anytime

## 🔧 **Customization**

### **Styling**

- Edit `css/styles.css` for custom styles
- Modify Tailwind classes in HTML files
- Add your own branding and colors

### **Data**

- Modify default projects/runs in `js/app.js`
- Add new test frameworks
- Customize parsing logic

### **Features**

- Add new demo pages
- Implement additional functionality
- Integrate with external services

## 📊 **Test File Support**

The demo supports various test result formats:

- **Text files** (.txt, .log) - Line-by-line parsing
- **XML files** (.xml) - JUnit, TestNG, etc.
- **JSON files** (.json) - Custom test result formats
- **Direct input** - Paste test output into textarea

### **Parsing Logic**

```javascript
// Example test output parsing
✓ Test 1 passed
✗ Test 2 failed
✓ Test 3 passed
PASS Test 4
FAIL Test 5
```

## 🎯 **Use Cases**

- **Product Demos** - Showcase your platform
- **Sales Presentations** - Demonstrate functionality
- **User Testing** - Get feedback on features
- **Documentation** - Interactive examples
- **Portfolio** - Show your development skills

## 🔒 **Security & Privacy**

- **No Backend** - Nothing is sent to external servers
- **Local Storage** - All data stays in user's browser
- **No Analytics** - No tracking or data collection
- **Completely Private** - Users control their own data

## 🚀 **Performance**

- **Fast Loading** - No framework overhead
- **Lightweight** - Minimal JavaScript bundle
- **Responsive** - Optimized for all devices
- **Accessible** - Follows web standards

## 📞 **Support**

This is a standalone demo - no backend support required. For questions about the demo:

1. Check the code comments
2. Review the JavaScript console for errors
3. Verify localStorage is enabled in your browser
4. Ensure all files are in the correct directory structure

## 🎉 **Ready to Deploy!**

Your standalone demo is ready to go! Simply upload the files to any static hosting service and you'll have a fully functional TestBay demo running anywhere on the web.

No servers, no databases, no authentication - just pure frontend magic! ✨
