#!/usr/bin/env node

/**
 * Workflow Automation System
 * Based on awesome-claude-code workflow patterns
 * Provides automated development workflows with AI agent coordination
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const AgentOrchestrator = require('./agent-orchestrator');
const ContextManager = require('./context-manager');

/**
 * Sanitize string for safe use in shell commands
 * Removes/escapes characters that could be used for command injection
 */
function sanitizeShellArg(str) {
  if (typeof str !== 'string') return '';
  // Remove characters that could be used for command injection
  return str
    .replace(/[;&|`$(){}[\]<>\\!#*?~^]/g, '')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim()
    .slice(0, 200); // Limit length
}

/**
 * Validate git branch name
 */
function isValidBranchName(name) {
  if (typeof name !== 'string') return false;
  // Git branch naming rules (simplified)
  return /^[a-zA-Z0-9._/-]+$/.test(name) && name.length <= 100;
}

class WorkflowAutomation {
  constructor() {
    this.projectRoot = path.join(__dirname, '../..');
    this.workflowsDir = path.join(this.projectRoot, 'workflows');
    this.templatesDir = path.join(this.workflowsDir, 'templates');
    
    // Initialize dependencies
    this.orchestrator = new AgentOrchestrator();
    this.contextManager = new ContextManager();
    
    // Predefined automated workflows
    this.automatedWorkflows = {
      'tdd': {
        name: 'Test-Driven Development',
        description: 'Write tests first, then implementation',
        steps: [
          { type: 'input', prompt: 'Component or feature to develop' },
          { type: 'agent', agent: 'testing-agent', action: 'generate-spec' },
          { type: 'agent', agent: 'pattern-generator', action: 'implement' },
          { type: 'agent', agent: 'testing-agent', action: 'validate' },
          { type: 'agent', agent: 'typescript-guardian', action: 'type-check' },
          { type: 'git', action: 'commit', message: 'feat: implement with TDD' }
        ]
      },
      'feature-complete': {
        name: 'Complete Feature Development',
        description: 'Full feature implementation with all checks',
        steps: [
          { type: 'input', prompt: 'Feature description' },
          { type: 'context', action: 'prime' },
          { type: 'agent', agent: 'pattern-generator', action: 'generate' },
          { type: 'agent', agent: 'testing-agent', action: 'generate-tests' },
          { type: 'agent', agent: 'design-agent', action: 'validate' },
          { type: 'agent', agent: 'typescript-guardian', action: 'fix' },
          { type: 'build', action: 'verify' },
          { type: 'git', action: 'commit', message: 'feat: complete feature' },
          { type: 'agent', agent: 'progress-agent', action: 'update' }
        ]
      },
      'quality-check': {
        name: 'Quality Assurance Check',
        description: 'Comprehensive quality validation',
        steps: [
          { type: 'context', action: 'snapshot', description: 'Before QA' },
          { type: 'parallel', agents: [
            { agent: 'testing-agent', action: 'coverage' },
            { agent: 'design-agent', action: 'analyze' },
            { agent: 'typescript-guardian', action: 'validate' }
          ]},
          { type: 'build', action: 'production' },
          { type: 'report', action: 'quality' }
        ]
      },
      'hotfix': {
        name: 'Emergency Hotfix',
        description: 'Quick fix with minimal disruption',
        steps: [
          { type: 'git', action: 'stash' },
          { type: 'git', action: 'checkout', branch: 'hotfix' },
          { type: 'input', prompt: 'Issue to fix' },
          { type: 'agent', agent: 'typescript-guardian', action: 'fix-specific' },
          { type: 'agent', agent: 'testing-agent', action: 'test-affected' },
          { type: 'build', action: 'verify' },
          { type: 'git', action: 'commit', message: 'fix: emergency hotfix' },
          { type: 'git', action: 'merge', target: 'main' }
        ]
      },
      'refactor': {
        name: 'Safe Refactoring',
        description: 'Refactor with safety checks',
        steps: [
          { type: 'context', action: 'snapshot', description: 'Before refactor' },
          { type: 'agent', agent: 'testing-agent', action: 'baseline' },
          { type: 'input', prompt: 'Refactoring target and approach' },
          { type: 'agent', agent: 'design-agent', action: 'refactor-plan' },
          { type: 'execute', action: 'refactor' },
          { type: 'agent', agent: 'testing-agent', action: 'compare-baseline' },
          { type: 'agent', agent: 'typescript-guardian', action: 'validate' },
          { type: 'git', action: 'commit', message: 'refactor: improve code structure' }
        ]
      },
      'pattern-implementation': {
        name: 'AI Pattern Implementation',
        description: 'Implement new AI design pattern',
        steps: [
          { type: 'input', prompt: 'Pattern name (e.g., guided-learning)' },
          { type: 'agent', agent: 'pattern-generator', action: 'scaffold' },
          { type: 'agent', agent: 'pattern-generator', action: 'implement' },
          { type: 'agent', agent: 'testing-agent', action: 'generate-demo-tests' },
          { type: 'agent', agent: 'design-agent', action: 'ensure-consistency' },
          { type: 'build', action: 'verify' },
          { type: 'agent', agent: 'progress-agent', action: 'update' }
        ]
      },
      'pre-commit': {
        name: 'Pre-commit Checks',
        description: 'Automated checks before committing',
        steps: [
          { type: 'lint', action: 'check' },
          { type: 'agent', agent: 'typescript-guardian', action: 'type-check' },
          { type: 'agent', agent: 'testing-agent', action: 'run-affected' },
          { type: 'build', action: 'verify' }
        ]
      },
      'documentation': {
        name: 'Documentation Generation',
        description: 'Generate and update documentation',
        steps: [
          { type: 'scan', action: 'components' },
          { type: 'agent', agent: 'documentation', action: 'generate-api' },
          { type: 'agent', agent: 'documentation', action: 'update-readme' },
          { type: 'agent', agent: 'documentation', action: 'update-claude-md' },
          { type: 'git', action: 'commit', message: 'docs: update documentation' }
        ]
      }
    };

    this.initializeWorkflowDir();
  }

  /**
   * Initialize workflow directory
   */
  initializeWorkflowDir() {
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir, { recursive: true });
    }
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }

  /**
   * Execute automated workflow
   */
  async executeWorkflow(workflowName, options = {}) {
    const workflow = this.automatedWorkflows[workflowName];
    if (!workflow) {
      throw new Error(`Unknown workflow: ${workflowName}`);
    }

    console.log(`\n🚀 Executing Workflow: ${workflow.name}`);
    console.log(`📝 ${workflow.description}`);
    console.log('='.repeat(50));

    // Create workflow session
    const sessionId = this.contextManager.createWorkflowSession(workflowName);
    const results = [];
    
    try {
      for (const step of workflow.steps) {
        const result = await this.executeStep(step, sessionId, options);
        results.push(result);
        
        // Update session
        this.contextManager.updateWorkflowSession(sessionId, {
          step: {
            type: step.type,
            action: step.action,
            result: result.success
          }
        });
        
        if (!result.success && !options.continueOnError) {
          throw new Error(`Step failed: ${result.error}`);
        }
      }

      // Mark workflow as completed
      this.contextManager.updateWorkflowSession(sessionId, {
        status: 'completed',
        endTime: new Date().toISOString()
      });

      console.log('\n✨ Workflow completed successfully!');
      return { success: true, sessionId, results };

    } catch (error) {
      // Mark workflow as failed
      this.contextManager.updateWorkflowSession(sessionId, {
        status: 'failed',
        error: error.message,
        endTime: new Date().toISOString()
      });

      console.error(`\n❌ Workflow failed: ${error.message}`);
      return { success: false, sessionId, error: error.message, results };
    }
  }

  /**
   * Execute individual workflow step
   */
  async executeStep(step, sessionId, options) {
    console.log(`\n▶️  Executing: ${step.type} - ${step.action || ''}`);
    
    try {
      switch (step.type) {
        case 'input':
          return await this.handleInput(step, options);
        
        case 'agent':
          return await this.handleAgent(step, sessionId);
        
        case 'parallel':
          return await this.handleParallel(step, sessionId);
        
        case 'context':
          return await this.handleContext(step);
        
        case 'git':
          return await this.handleGit(step, options);
        
        case 'build':
          return await this.handleBuild(step);
        
        case 'lint':
          return await this.handleLint(step);
        
        case 'report':
          return await this.handleReport(step);
        
        default:
          console.warn(`Unknown step type: ${step.type}`);
          return { success: true, warning: 'Unknown step type' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle input step
   */
  async handleInput(step, options) {
    if (options.inputs && options.inputs[step.prompt]) {
      const value = options.inputs[step.prompt];
      console.log(`  Input: ${value}`);
      return { success: true, value };
    }
    
    // In automated mode, skip if no input provided
    if (options.automated) {
      console.log(`  Skipping input (automated mode)`);
      return { success: true, skipped: true };
    }
    
    // Would normally prompt for input here
    console.log(`  Required input: ${step.prompt}`);
    return { success: true, prompt: step.prompt };
  }

  /**
   * Handle agent execution
   */
  async handleAgent(step, sessionId) {
    const agentContext = this.contextManager.getAgentContext(step.agent);
    
    // Execute agent with context
    const result = await this.orchestrator.executeAgent(
      step.agent,
      step.action,
      { context: agentContext, sessionId }
    );
    
    // Update agent context
    this.contextManager.updateAgentContext(step.agent, {
      action: step.action,
      success: result.exitCode === 0,
      duration: result.duration,
      output: result.output
    });
    
    return { 
      success: result.exitCode === 0, 
      agent: step.agent,
      action: step.action,
      duration: result.duration
    };
  }

  /**
   * Handle parallel agent execution
   */
  async handleParallel(step, sessionId) {
    const tasks = step.agents.map(agent => ({
      agent: agent.agent,
      action: agent.action,
      options: { sessionId }
    }));
    
    const results = await this.orchestrator.executeParallel(tasks);
    
    return {
      success: results.failed.length === 0,
      parallel: true,
      successful: results.successful.length,
      failed: results.failed.length
    };
  }

  /**
   * Handle context operations
   */
  async handleContext(step) {
    switch (step.action) {
      case 'prime':
        this.contextManager.primeContext();
        break;
      
      case 'snapshot':
        this.contextManager.createSnapshot(step.description || 'Workflow snapshot');
        break;
      
      case 'restore':
        this.contextManager.restoreSnapshot(step.snapshotId);
        break;
      
      default:
        console.warn(`Unknown context action: ${step.action}`);
    }
    
    return { success: true, context: step.action };
  }

  /**
   * Handle git operations (with command injection protection)
   */
  async handleGit(step, options) {
    try {
      switch (step.action) {
        case 'commit':
          const rawMessage = step.message || options.commitMessage || 'Auto-commit';
          const message = sanitizeShellArg(rawMessage);
          // Use spawnSync with array args to prevent injection
          execSync('git add .', { cwd: this.projectRoot, stdio: 'pipe' });
          spawnSync('git', ['commit', '-m', message], {
            cwd: this.projectRoot,
            stdio: 'pipe'
          });
          console.log(`  ✅ Committed: ${message}`);
          break;

        case 'stash':
          execSync('git stash', { cwd: this.projectRoot, stdio: 'pipe' });
          console.log('  ✅ Changes stashed');
          break;

        case 'checkout':
          const branch = step.branch || 'main';
          if (!isValidBranchName(branch)) {
            throw new Error(`Invalid branch name: ${branch}`);
          }
          // Try to create branch, fall back to checkout existing
          const createResult = spawnSync('git', ['checkout', '-b', branch], {
            cwd: this.projectRoot,
            stdio: 'pipe'
          });
          if (createResult.status !== 0) {
            spawnSync('git', ['checkout', branch], {
              cwd: this.projectRoot,
              stdio: 'pipe'
            });
          }
          console.log(`  ✅ Checked out: ${branch}`);
          break;

        case 'merge':
          const target = step.target || 'main';
          if (!isValidBranchName(target)) {
            throw new Error(`Invalid branch name: ${target}`);
          }
          spawnSync('git', ['merge', target], { cwd: this.projectRoot, stdio: 'pipe' });
          console.log(`  ✅ Merged with: ${target}`);
          break;
      }

      return { success: true, git: step.action };
    } catch (error) {
      return { success: false, error: `Git operation failed: ${error.message}` };
    }
  }

  /**
   * Handle build operations
   */
  async handleBuild(step) {
    try {
      switch (step.action) {
        case 'verify':
          execSync('npm run build', { 
            cwd: this.projectRoot, 
            stdio: 'inherit' 
          });
          break;
        
        case 'production':
          execSync('npm run build:production', { 
            cwd: this.projectRoot, 
            stdio: 'inherit' 
          });
          break;
      }
      
      return { success: true, build: step.action };
    } catch (error) {
      return { success: false, error: `Build failed: ${error.message}` };
    }
  }

  /**
   * Handle lint operations
   */
  async handleLint(step) {
    try {
      execSync('npm run lint', { 
        cwd: this.projectRoot, 
        stdio: 'inherit' 
      });
      
      return { success: true, lint: 'passed' };
    } catch (error) {
      return { success: false, error: `Lint failed: ${error.message}` };
    }
  }

  /**
   * Handle report generation
   */
  async handleReport(step) {
    switch (step.action) {
      case 'quality':
        await this.generateQualityReport();
        break;
      
      case 'progress':
        execSync('npm run progress-report', { 
          cwd: this.projectRoot, 
          stdio: 'inherit' 
        });
        break;
    }
    
    return { success: true, report: step.action };
  }

  /**
   * Generate quality report
   */
  async generateQualityReport() {
    console.log('\n📊 Quality Report');
    console.log('='.repeat(40));
    
    // Get test coverage
    try {
      const coverage = execSync('npm run test:coverage -- --silent', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      console.log('✅ Test Coverage: Check');
    } catch {
      console.log('⚠️  Test Coverage: Failed');
    }
    
    // Check TypeScript
    try {
      execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      console.log('✅ TypeScript: No errors');
    } catch {
      console.log('❌ TypeScript: Has errors');
    }
    
    // Check lint
    try {
      execSync('npm run lint', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      console.log('✅ Linting: Passed');
    } catch {
      console.log('⚠️  Linting: Has warnings');
    }
  }

  /**
   * Create custom workflow
   */
  createCustomWorkflow(name, description, steps) {
    this.automatedWorkflows[name] = {
      name,
      description,
      steps,
      custom: true
    };
    
    // Save to file
    const workflowFile = path.join(this.workflowsDir, `${name}.json`);
    fs.writeFileSync(workflowFile, JSON.stringify({
      name,
      description,
      steps
    }, null, 2));
    
    console.log(`✅ Created custom workflow: ${name}`);
  }

  /**
   * Load custom workflows
   */
  loadCustomWorkflows() {
    const files = fs.readdirSync(this.workflowsDir)
      .filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(this.workflowsDir, file), 'utf8');
      const workflow = JSON.parse(content);
      const name = file.replace('.json', '');
      
      this.automatedWorkflows[name] = {
        ...workflow,
        custom: true
      };
    });
  }

  /**
   * Display help
   */
  displayHelp() {
    console.log(`
🔄 Workflow Automation System

Usage:
  node scripts/workflow-automation.js [command] [options]

Commands:
  run <workflow>              Execute automated workflow
  list                        List available workflows
  create <name>              Create custom workflow
  help                       Show this help message

Available Workflows:
${Object.entries(this.automatedWorkflows).map(([key, wf]) => 
  `  ${key.padEnd(20)} - ${wf.description}`
).join('\n')}

Options:
  --automated                Run in automated mode (skip prompts)
  --continue-on-error        Continue workflow even if steps fail
  --inputs <json>           Provide inputs as JSON

Examples:
  node scripts/workflow-automation.js run tdd
  node scripts/workflow-automation.js run feature-complete --automated
  node scripts/workflow-automation.js run quality-check
  node scripts/workflow-automation.js list
    `);
  }
}

// CLI Interface
async function main() {
  const automation = new WorkflowAutomation();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    automation.displayHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'run':
        if (args.length < 2) {
          console.error('Usage: run <workflow>');
          console.log('Available:', Object.keys(automation.automatedWorkflows));
          return;
        }
        
        const options = {
          automated: args.includes('--automated'),
          continueOnError: args.includes('--continue-on-error')
        };
        
        // Parse inputs if provided
        const inputsIndex = args.indexOf('--inputs');
        if (inputsIndex > -1 && args[inputsIndex + 1]) {
          try {
            options.inputs = JSON.parse(args[inputsIndex + 1]);
          } catch {
            console.error('Invalid JSON for inputs');
          }
        }
        
        await automation.executeWorkflow(args[1], options);
        break;

      case 'list':
        console.log('\n📋 Available Workflows:');
        console.log('='.repeat(50));
        Object.entries(automation.automatedWorkflows).forEach(([key, wf]) => {
          const icon = wf.custom ? '⚡' : '🔧';
          console.log(`${icon} ${key}:`);
          console.log(`   ${wf.description}`);
          console.log(`   Steps: ${wf.steps.length}`);
        });
        break;

      case 'create':
        console.log('Interactive workflow creation not yet implemented');
        console.log('Please create workflow JSON files manually in:', automation.workflowsDir);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        automation.displayHelp();
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = WorkflowAutomation;