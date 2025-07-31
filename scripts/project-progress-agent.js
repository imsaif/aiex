#!/usr/bin/env node

/**
 * Project Progress Agent
 * A comprehensive tool for tracking project progress and coordinating AI agents
 * 
 * This agent monitors all other AI agents, tracks their outputs, updates project
 * status automatically, and provides intelligent progress reporting and task
 * management across the entire AI design patterns project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectProgressAgent {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.componentsDir = path.join(this.projectRoot, 'src', 'components');
    this.patternsDir = path.join(this.projectRoot, 'src', 'data', 'patterns', 'patterns');
    this.tasksFile = path.join(this.projectRoot, 'tasks', 'tasks.json');
    this.statusFile = path.join(this.projectRoot, 'docs', 'status.md');
    this.progressFile = path.join(this.projectRoot, 'ai-design-patterns.md');
    
    // Agent output monitoring configuration
    this.agentOutputs = {
      patternGenerator: {
        patternsDir: this.patternsDir,
        mainFile: path.join(this.projectRoot, 'src', 'data', 'patterns.ts')
      },
      testingAgent: {
        testDirs: [
          path.join(this.componentsDir, 'ui', '__tests__'),
          path.join(this.componentsDir, 'examples', '__tests__'),
          path.join(this.componentsDir, 'sections', '__tests__'),
          path.join(this.componentsDir, 'layout', '__tests__')
        ],
        coverageFile: path.join(this.projectRoot, 'coverage', 'coverage-final.json')
      },
      designAgent: {
        reportFile: path.join(this.projectRoot, 'consistency-report.json'),
        styleGuideFile: path.join(this.projectRoot, 'docs', 'style-guide.md')
      },
      buildSystem: {
        metricsFile: path.join(this.projectRoot, 'build-metrics.json'),
        jestConfig: path.join(this.projectRoot, 'jest.config.js')
      }
    };

    // Load current project state
    this.loadProjectState();
  }

  /**
   * Load current project state from various files
   */
  loadProjectState() {
    try {
      // Load tasks
      if (fs.existsSync(this.tasksFile)) {
        const tasksContent = fs.readFileSync(this.tasksFile, 'utf8');
        this.currentTasks = JSON.parse(tasksContent);
      } else {
        this.currentTasks = { tasks: [] };
      }

      // Load existing patterns
      this.existingPatterns = this.scanExistingPatterns();
      
      // Load test files
      this.existingTests = this.scanExistingTests();
      
      // Load design consistency data
      this.designData = this.loadDesignData();
      
      // Load build metrics
      this.buildMetrics = this.loadBuildMetrics();

    } catch (error) {
      console.error('Error loading project state:', error);
      this.currentTasks = { tasks: [] };
      this.existingPatterns = [];
      this.existingTests = [];
      this.designData = {};
      this.buildMetrics = {};
    }
  }

  /**
   * Scan for existing AI patterns
   */
  scanExistingPatterns() {
    const patterns = [];
    
    if (!fs.existsSync(this.patternsDir)) {
      return patterns;
    }

    const patternDirs = fs.readdirSync(this.patternsDir);
    
    patternDirs.forEach(dirName => {
      const patternPath = path.join(this.patternsDir, dirName);
      const stat = fs.statSync(patternPath);
      
      if (stat.isDirectory()) {
        const indexPath = path.join(patternPath, 'index.ts');
        if (fs.existsSync(indexPath)) {
          const lastModified = stat.mtime;
          patterns.push({
            id: dirName,
            path: patternPath,
            lastModified,
            status: 'implemented'
          });
        }
      }
    });

    return patterns.sort((a, b) => b.lastModified - a.lastModified);
  }

  /**
   * Scan for existing test files
   */
  scanExistingTests() {
    const tests = [];
    
    this.agentOutputs.testingAgent.testDirs.forEach(testDir => {
      if (fs.existsSync(testDir)) {
        const testFiles = fs.readdirSync(testDir)
          .filter(file => file.endsWith('.test.tsx'))
          .map(file => {
            const filePath = path.join(testDir, file);
            const stat = fs.statSync(filePath);
            return {
              name: file,
              path: filePath,
              lastModified: stat.mtime,
              directory: path.basename(testDir.replace('__tests__', ''))
            };
          });
        
        tests.push(...testFiles);
      }
    });

    return tests.sort((a, b) => b.lastModified - a.lastModified);
  }

  /**
   * Load design consistency data
   */
  loadDesignData() {
    try {
      const { reportFile, styleGuideFile } = this.agentOutputs.designAgent;
      const data = {};
      
      if (fs.existsSync(reportFile)) {
        data.consistencyReport = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
        data.lastConsistencyCheck = fs.statSync(reportFile).mtime;
      }
      
      if (fs.existsSync(styleGuideFile)) {
        data.hasStyleGuide = true;
        data.styleGuideLastUpdated = fs.statSync(styleGuideFile).mtime;
      }
      
      return data;
    } catch (error) {
      console.warn('Could not load design data:', error.message);
      return {};
    }
  }

  /**
   * Load build metrics and performance data
   */
  loadBuildMetrics() {
    try {
      const { metricsFile } = this.agentOutputs.buildSystem;
      
      if (fs.existsSync(metricsFile)) {
        const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        return {
          ...metrics,
          lastUpdated: fs.statSync(metricsFile).mtime
        };
      }
      
      return {};
    } catch (error) {
      console.warn('Could not load build metrics:', error.message);
      return {};
    }
  }

  /**
   * Check for TypeScript compilation errors
   */
  checkTypeScriptErrors() {
    try {
      execSync('npx tsc --noEmit', { 
        cwd: this.projectRoot, 
        stdio: 'pipe' 
      });
      return { hasErrors: false, errorCount: 0 };
    } catch (error) {
      const output = error.stdout ? error.stdout.toString() : error.message;
      const errorLines = output.split('\n').filter(line => line.includes('error TS'));
      return { 
        hasErrors: true, 
        errorCount: errorLines.length,
        errors: errorLines
      };
    }
  }

  /**
   * Get test coverage information
   */
  getTestCoverage() {
    try {
      const { coverageFile } = this.agentOutputs.testingAgent;
      
      if (fs.existsSync(coverageFile)) {
        const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
        const total = coverage.total;
        
        return {
          statements: total?.statements?.pct || 0,
          branches: total?.branches?.pct || 0,
          functions: total?.functions?.pct || 0,
          lines: total?.lines?.pct || 0,
          totalTests: this.existingTests.length,
          lastUpdated: fs.statSync(coverageFile).mtime
        };
      }
      
      return {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
        totalTests: this.existingTests.length
      };
    } catch (error) {
      console.warn('Could not get test coverage:', error.message);
      return { totalTests: this.existingTests.length };
    }
  }

  /**
   * Calculate overall project progress
   */
  calculateProjectProgress() {
    const totalPatterns = 14; // From project specification
    const implementedPatterns = this.existingPatterns.length;
    
    const patternProgress = (implementedPatterns / totalPatterns) * 100;
    
    // Get other metrics
    const tsErrors = this.checkTypeScriptErrors();
    const coverage = this.getTestCoverage();
    
    // Calculate weighted progress score
    const weights = {
      patterns: 0.4,    // 40% - Core patterns implementation
      tests: 0.25,      // 25% - Test coverage
      compilation: 0.2, // 20% - TypeScript compilation health
      design: 0.15      // 15% - Design consistency
    };
    
    const testScore = Math.min((coverage.totalTests / 50) * 100, 100); // Target: 50 tests
    const compilationScore = tsErrors.hasErrors ? Math.max(100 - tsErrors.errorCount, 0) : 100;
    const designScore = this.designData.consistencyReport?.summary?.averageScore || 70;
    
    const overallProgress = 
      (patternProgress * weights.patterns) +
      (testScore * weights.tests) +
      (compilationScore * weights.compilation) +
      (designScore * weights.design);

    return {
      overall: Math.round(overallProgress),
      patterns: {
        implemented: implementedPatterns,
        total: totalPatterns,
        percentage: Math.round(patternProgress)
      },
      tests: {
        count: coverage.totalTests,
        coverage: coverage.statements || 0,
        score: Math.round(testScore)
      },
      compilation: {
        hasErrors: tsErrors.hasErrors,
        errorCount: tsErrors.errorCount,
        score: Math.round(compilationScore)
      },
      design: {
        score: Math.round(designScore),
        hasReport: !!this.designData.consistencyReport
      }
    };
  }

  /**
   * Generate comprehensive progress report
   */
  async generateProgressReport() {
    console.log('📊 Generating Comprehensive Project Progress Report...\n');
    
    const progress = this.calculateProjectProgress();
    const recentActivity = this.getRecentAgentActivity();
    const nextTasks = this.getHighPriorityTasks();
    
    console.log('🎯 OVERALL PROJECT HEALTH');
    console.log('='.repeat(50));
    console.log(`📈 Overall Progress: ${progress.overall}%`);
    console.log(`🔧 Patterns: ${progress.patterns.implemented}/${progress.patterns.total} (${progress.patterns.percentage}%)`);
    console.log(`🧪 Tests: ${progress.tests.count} tests, ${progress.tests.coverage}% coverage`);
    console.log(`⚙️  Compilation: ${progress.compilation.hasErrors ? `❌ ${progress.compilation.errorCount} errors` : '✅ Clean'}`);
    console.log(`🎨 Design: ${progress.design.score}% consistency score\n`);

    console.log('🤖 RECENT AGENT ACTIVITY');
    console.log('='.repeat(50));
    
    if (recentActivity.patterns.length > 0) {
      console.log('📋 Pattern Generator:');
      recentActivity.patterns.forEach(pattern => {
        console.log(`  ✅ ${pattern.id} (${this.formatDate(pattern.lastModified)})`);
      });
    }
    
    if (recentActivity.tests.length > 0) {
      console.log('🧪 Testing Agent:');
      recentActivity.tests.forEach(test => {
        console.log(`  ✅ ${test.name} (${this.formatDate(test.lastModified)})`);
      });
    }
    
    if (this.designData.lastConsistencyCheck) {
      console.log('🎨 Design Agent:');
      console.log(`  ✅ Consistency check (${this.formatDate(this.designData.lastConsistencyCheck)})`);
    }

    console.log('\n🎯 NEXT PRIORITY TASKS');
    console.log('='.repeat(50));
    nextTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.priority} priority)`);
      if (task.dependencies && task.dependencies.length > 0) {
        console.log(`   📌 Depends on: ${task.dependencies.join(', ')}`);
      }
    });

    console.log('\n💡 AGENT RECOMMENDATIONS');
    console.log('='.repeat(50));
    const recommendations = this.generateRecommendations(progress);
    recommendations.forEach(rec => {
      console.log(`• ${rec}`);
    });

    return {
      progress,
      recentActivity,
      nextTasks,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recent activity from all agents
   */
  getRecentAgentActivity() {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      patterns: this.existingPatterns.filter(p => p.lastModified > lastWeek),
      tests: this.existingTests.filter(t => t.lastModified > lastWeek),
      design: this.designData.lastConsistencyCheck > lastWeek ? [this.designData] : []
    };
  }

  /**
   * Get high priority tasks that are actionable
   */
  getHighPriorityTasks() {
    const tasks = this.currentTasks.tasks || [];
    
    return tasks
      .filter(task => task.status === 'pending' && task.priority === 'high')
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        dependencies: task.dependencies || []
      }));
  }

  /**
   * Generate intelligent recommendations based on current state
   */
  generateRecommendations(progress) {
    const recommendations = [];
    
    // Pattern recommendations
    if (progress.patterns.percentage < 60) {
      recommendations.push(`Run 'npm run generate-pattern guided-learning' to implement next priority pattern`);
    }
    
    // Test recommendations
    if (progress.tests.coverage < 70) {
      recommendations.push(`Run 'npm run generate-all-tests' to improve test coverage (target: 70%)`);
    }
    
    // Compilation recommendations
    if (progress.compilation.hasErrors) {
      recommendations.push(`Fix ${progress.compilation.errorCount} TypeScript errors for clean builds`);
    }
    
    // Design recommendations
    if (progress.design.score < 80) {
      recommendations.push(`Run 'npm run design-fix-all' to improve design consistency`);
    }
    
    // Agent coordination recommendations
    const missingPatterns = 14 - progress.patterns.implemented;
    if (missingPatterns > 0) {
      recommendations.push(`${missingPatterns} patterns remaining - prioritize guided-learning, augmented-creation, responsible-ai-design`);
    }

    return recommendations;
  }

  /**
   * Update task status based on agent activities
   */
  async updateTaskStatus() {
    console.log('🔄 Updating task status based on agent activities...');
    
    let updated = false;
    const tasks = this.currentTasks.tasks || [];
    
    // Check pattern-related tasks
    tasks.forEach(task => {
      if (task.status === 'pending' && task.title.toLowerCase().includes('pattern')) {
        // Check if patterns have been implemented
        const relevantPatterns = this.existingPatterns.filter(p => 
          task.description.toLowerCase().includes(p.id) ||
          task.title.toLowerCase().includes(p.id)
        );
        
        if (relevantPatterns.length > 0) {
          task.status = 'done';
          task.completedBy = 'ai-pattern-generator';
          task.completedAt = new Date().toISOString();
          updated = true;
          console.log(`✅ Marked task "${task.title}" as completed by Pattern Generator`);
        }
      }
      
      // Check test-related tasks
      if (task.status === 'pending' && task.title.toLowerCase().includes('test')) {
        const coverage = this.getTestCoverage();
        if (coverage.totalTests > 100) { // Significant test coverage
          task.status = 'in-progress';
          updated = true;
          console.log(`🔄 Updated task "${task.title}" to in-progress based on test count`);
        }
      }
    });
    
    if (updated) {
      await this.saveTaskUpdates();
      console.log('💾 Task status updates saved');
    } else {
      console.log('ℹ️  No task status changes detected');
    }
    
    return updated;
  }

  /**
   * Save updated tasks to file
   */
  async saveTaskUpdates() {
    try {
      const tasksDir = path.dirname(this.tasksFile);
      if (!fs.existsSync(tasksDir)) {
        fs.mkdirSync(tasksDir, { recursive: true });
      }
      
      fs.writeFileSync(this.tasksFile, JSON.stringify(this.currentTasks, null, 2));
    } catch (error) {
      console.error('Error saving task updates:', error);
    }
  }

  /**
   * Update project status files with current progress
   */
  async updateStatusFiles() {
    console.log('📝 Updating project status files...');
    
    const progress = this.calculateProjectProgress();
    
    // Update status.md
    await this.updateStatusMarkdown(progress);
    
    // Update ai-design-patterns.md
    await this.updateProgressMarkdown(progress);
    
    console.log('✅ Status files updated successfully');
  }

  /**
   * Update the status.md file
   */
  async updateStatusMarkdown(progress) {
    try {
      if (!fs.existsSync(this.statusFile)) {
        console.warn('Status file not found, skipping update');
        return;
      }
      
      let content = fs.readFileSync(this.statusFile, 'utf8');
      
      // Update completion percentage
      const completionRegex = /### ✅ Completed Patterns \((\d+)\/14 - (\d+)%\)/;
      const newCompletion = `### ✅ Completed Patterns (${progress.patterns.implemented}/14 - ${progress.patterns.percentage}%)`;
      content = content.replace(completionRegex, newCompletion);
      
      // Add auto-update timestamp
      const timestamp = `\n\n*Last updated: ${new Date().toISOString()} by Project Progress Agent*`;
      if (!content.includes('Last updated:')) {
        content += timestamp;
      } else {
        content = content.replace(/\*Last updated:.*?\*/, timestamp.trim());
      }
      
      fs.writeFileSync(this.statusFile, content);
    } catch (error) {
      console.error('Error updating status.md:', error);
    }
  }

  /**
   * Update the ai-design-patterns.md file
   */
  async updateProgressMarkdown(progress) {
    try {
      if (!fs.existsSync(this.progressFile)) {
        console.warn('Progress file not found, skipping update');
        return;
      }
      
      let content = fs.readFileSync(this.progressFile, 'utf8');
      
      // Update implementation status
      const statusRegex = /\*\*Implementation Status: (\d+)\/14 patterns complete \((\d+)%\)\*\*/;
      const newStatus = `**Implementation Status: ${progress.patterns.implemented}/14 patterns complete (${progress.patterns.percentage}%)**`;
      content = content.replace(statusRegex, newStatus);
      
      fs.writeFileSync(this.progressFile, content);
    } catch (error) {
      console.error('Error updating ai-design-patterns.md:', error);
    }
  }

  /**
   * Show agent status and recent activities
   */
  async showAgentStatus() {
    console.log('🤖 AI AGENT STATUS REPORT');
    console.log('='.repeat(50));
    
    // Pattern Generator Status
    console.log('📋 AI Pattern Generator Agent:');
    console.log(`   • Patterns implemented: ${this.existingPatterns.length}/14`);
    console.log(`   • Most recent: ${this.existingPatterns.length > 0 ? this.existingPatterns[0].id : 'None'}`);
    console.log(`   • Status: ${this.existingPatterns.length < 14 ? 'Active - more patterns needed' : 'Complete'}`);
    
    // Testing Agent Status
    console.log('\n🧪 Component Testing Agent:');
    console.log(`   • Test files: ${this.existingTests.length}`);
    console.log(`   • Coverage: ${this.getTestCoverage().statements || 0}%`);
    console.log(`   • Status: ${this.getTestCoverage().statements < 70 ? 'Active - more tests needed' : 'Target achieved'}`);
    
    // Design Agent Status
    console.log('\n🎨 Design Consistency Agent:');
    console.log(`   • Consistency score: ${this.designData.consistencyReport?.summary?.averageScore || 'Not analyzed'}%`);
    console.log(`   • Last analysis: ${this.designData.lastConsistencyCheck ? this.formatDate(this.designData.lastConsistencyCheck) : 'Never'}`);
    console.log(`   • Status: ${this.designData.lastConsistencyCheck ? 'Recent analysis available' : 'Analysis needed'}`);
    
    // Build System Status
    const tsErrors = this.checkTypeScriptErrors();
    console.log('\n⚙️  Build System:');
    console.log(`   • TypeScript: ${tsErrors.hasErrors ? `❌ ${tsErrors.errorCount} errors` : '✅ Clean'}`);
    console.log(`   • Build metrics: ${this.buildMetrics.lastUpdated ? '✅ Available' : '❌ Not generated'}`);
    console.log(`   • Status: ${tsErrors.hasErrors ? 'Needs attention' : 'Healthy'}`);
  }

  /**
   * Suggest next actions based on current state
   */
  async suggestNextActions() {
    console.log('💡 AI AGENT COORDINATION SUGGESTIONS');
    console.log('='.repeat(50));
    
    const progress = this.calculateProjectProgress();
    const actions = [];
    
    // Pattern suggestions
    const missingPatterns = ['guided-learning', 'augmented-creation', 'responsible-ai-design'];
    const existingIds = this.existingPatterns.map(p => p.id);
    const nextPatterns = missingPatterns.filter(id => !existingIds.includes(id));
    
    if (nextPatterns.length > 0) {
      actions.push({
        agent: 'Pattern Generator',
        command: `npm run generate-pattern ${nextPatterns[0]}`,
        reason: `Implement high-priority ${nextPatterns[0]} pattern`,
        impact: 'High - Advances core feature completion'
      });
    }
    
    // Testing suggestions
    if (progress.tests.coverage < 70) {
      actions.push({
        agent: 'Testing Agent',
        command: 'npm run generate-all-tests',
        reason: 'Improve test coverage to meet 70% threshold',
        impact: 'Medium - Improves code quality and reliability'
      });
    }
    
    // Design suggestions
    if (!this.designData.consistencyReport || this.designData.consistencyReport.summary.averageScore < 80) {
      actions.push({
        agent: 'Design Consistency Agent',
        command: 'npm run design-analyze && npm run design-fix-all',
        reason: 'Improve design system consistency',
        impact: 'Medium - Enhances UI/UX quality'
      });
    }
    
    // Compilation fixes
    const tsErrors = this.checkTypeScriptErrors();
    if (tsErrors.hasErrors) {
      actions.push({
        agent: 'Manual/TypeScript',
        command: 'Fix TypeScript compilation errors',
        reason: `Resolve ${tsErrors.errorCount} compilation errors`,
        impact: 'High - Required for successful builds'
      });
    }
    
    // Display suggestions
    actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action.agent}:`);
      console.log(`   Command: ${action.command}`);
      console.log(`   Reason: ${action.reason}`);
      console.log(`   Impact: ${action.impact}\n`);
    });
    
    if (actions.length === 0) {
      console.log('🎉 All agents are in good state! Consider:');
      console.log('   • Running comprehensive tests');
      console.log('   • Performance optimization');
      console.log('   • Documentation updates');
    }
    
    return actions;
  }

  /**
   * Utility function to format dates
   */
  formatDate(date) {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  /**
   * Display usage help
   */
  displayHelp() {
    console.log(`
🚀 Project Progress Agent

Usage:
  node scripts/project-progress-agent.js [command] [options]

Commands:
  report                      Generate comprehensive progress report
  status                      Show current project status summary
  agents                      Show all AI agent status and activities
  next                        Suggest next priority actions for agents
  update                      Update task status based on agent activities
  sync                        Synchronize all status files with current state
  help                        Show this help message

Examples:
  node scripts/project-progress-agent.js report
  node scripts/project-progress-agent.js agents
  node scripts/project-progress-agent.js next
  node scripts/project-progress-agent.js update && node scripts/project-progress-agent.js sync

This agent coordinates all AI agents and provides intelligent project
progress tracking with automatic task updates and agent coordination.
    `);
  }
}

// CLI Interface
async function main() {
  const agent = new ProjectProgressAgent();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    agent.displayHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'report':
        await agent.generateProgressReport();
        break;

      case 'status':
        const progress = agent.calculateProjectProgress();
        console.log('📊 PROJECT STATUS SUMMARY');
        console.log('='.repeat(40));
        console.log(`Overall Progress: ${progress.overall}%`);
        console.log(`Patterns: ${progress.patterns.implemented}/${progress.patterns.total}`);
        console.log(`Tests: ${progress.tests.count} files`);
        console.log(`TypeScript: ${progress.compilation.hasErrors ? 'Has errors' : 'Clean'}`);
        break;

      case 'agents':
        await agent.showAgentStatus();
        break;

      case 'next':
        await agent.suggestNextActions();
        break;

      case 'update':
        await agent.updateTaskStatus();
        break;

      case 'sync':
        await agent.updateStatusFiles();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        agent.displayHelp();
    }
  } catch (error) {
    console.error(`❌ Error executing command '${command}':`, error.message);
    console.error('💡 Use "help" command for usage information');
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProjectProgressAgent;