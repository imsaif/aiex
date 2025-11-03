#!/usr/bin/env node

/**
 * Agent Orchestrator
 * Based on awesome-claude-code patterns for sub-agent orchestration
 * Coordinates multiple specialized agents working in parallel
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const EventEmitter = require('events');

class AgentOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.projectRoot = path.join(__dirname, '..');
    this.agentsDir = path.join(this.projectRoot, 'scripts');
    this.contextFile = path.join(this.projectRoot, '.agent-context.json');
    this.workflowsDir = path.join(this.projectRoot, 'workflows');
    
    // Agent registry with capabilities
    this.agents = {
      'pattern-generator': {
        script: 'ai-pattern-generator.js',
        capabilities: ['generate-pattern', 'validate-pattern', 'list-patterns'],
        description: 'Generates AI design pattern implementations',
        priority: 'high'
      },
      'guide-generator': {
        script: 'ai-guide-generator.js',
        capabilities: ['generate-guide', 'validate-guide', 'list-guides'],
        description: 'Generates Designer Guide learning paths',
        priority: 'high'
      },
      'testing-agent': {
        script: 'component-testing-agent.js',
        capabilities: ['generate-tests', 'validate-tests', 'coverage-report'],
        description: 'Creates comprehensive test suites',
        priority: 'medium'
      },
      'design-agent': {
        script: 'design-consistency-agent.js',
        capabilities: ['analyze-design', 'fix-design', 'generate-style-guide'],
        description: 'Ensures design system consistency',
        priority: 'medium'
      },
      'typescript-guardian': {
        script: 'typescript-guardian-agent.js',
        capabilities: ['type-check', 'fix-types', 'validate-types'],
        description: 'Manages TypeScript type safety',
        priority: 'high'
      },
      'progress-agent': {
        script: 'project-progress-agent.js',
        capabilities: ['track-progress', 'coordinate-agents', 'report-status'],
        description: 'Monitors and coordinates all agents',
        priority: 'critical'
      }
    };

    // Workflow patterns
    this.workflows = {
      'full-pattern-implementation': {
        steps: [
          { agent: 'pattern-generator', action: 'generate', parallel: false },
          { agent: 'testing-agent', action: 'generate-tests', parallel: true },
          { agent: 'design-agent', action: 'analyze', parallel: true },
          { agent: 'typescript-guardian', action: 'validate', parallel: false },
          { agent: 'progress-agent', action: 'update', parallel: false }
        ]
      },
      'guide-generation': {
        steps: [
          { agent: 'guide-generator', action: 'generate', parallel: false },
          { agent: 'design-agent', action: 'analyze', parallel: true },
          { agent: 'progress-agent', action: 'update', parallel: false }
        ]
      },
      'aiux-sprint': {
        steps: [
          { agent: 'pattern-generator', action: 'generate', parallel: false },
          { agent: 'guide-generator', action: 'generate', parallel: false },
          { agent: 'testing-agent', action: 'generate-tests', parallel: true },
          { agent: 'design-agent', action: 'analyze', parallel: true },
          { agent: 'typescript-guardian', action: 'validate', parallel: false },
          { agent: 'progress-agent', action: 'update', parallel: false }
        ]
      },
      'quality-assurance': {
        steps: [
          { agent: 'testing-agent', action: 'coverage-report', parallel: true },
          { agent: 'design-agent', action: 'analyze', parallel: true },
          { agent: 'typescript-guardian', action: 'type-check', parallel: true },
          { agent: 'progress-agent', action: 'report', parallel: false }
        ]
      },
      'fix-all-issues': {
        steps: [
          { agent: 'typescript-guardian', action: 'fix-types', parallel: false },
          { agent: 'design-agent', action: 'fix-design', parallel: false },
          { agent: 'testing-agent', action: 'generate-missing', parallel: false },
          { agent: 'progress-agent', action: 'sync', parallel: false }
        ]
      }
    };

    // Running agents tracking
    this.runningAgents = new Map();
    this.agentResults = new Map();
    
    // Load context
    this.loadContext();
  }

  /**
   * Load shared context for all agents
   */
  loadContext() {
    try {
      if (fs.existsSync(this.contextFile)) {
        this.context = JSON.parse(fs.readFileSync(this.contextFile, 'utf8'));
      } else {
        this.context = {
          projectState: {},
          agentHistory: [],
          sharedData: {}
        };
      }
    } catch (error) {
      console.error('Error loading context:', error);
      this.context = { projectState: {}, agentHistory: [], sharedData: {} };
    }
  }

  /**
   * Save shared context
   */
  saveContext() {
    try {
      fs.writeFileSync(this.contextFile, JSON.stringify(this.context, null, 2));
    } catch (error) {
      console.error('Error saving context:', error);
    }
  }

  /**
   * Execute an agent with specific action
   */
  async executeAgent(agentName, action, options = {}) {
    const agent = this.agents[agentName];
    if (!agent) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const scriptPath = path.join(this.agentsDir, agent.script);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Agent script not found: ${scriptPath}`);
    }

    console.log(`🤖 Executing ${agentName}: ${action}`);
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const agentProcess = spawn('node', [scriptPath, action, ...this.buildArgs(options)], {
        cwd: this.projectRoot,
        env: { ...process.env, AGENT_CONTEXT: JSON.stringify(this.context) }
      });

      let output = '';
      let errorOutput = '';

      agentProcess.stdout.on('data', (data) => {
        const str = data.toString();
        output += str;
        if (!options.silent) {
          process.stdout.write(`  [${agentName}] ${str}`);
        }
      });

      agentProcess.stderr.on('data', (data) => {
        const str = data.toString();
        errorOutput += str;
        if (!options.silent) {
          process.stderr.write(`  [${agentName}] ${str}`);
        }
      });

      agentProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        const result = {
          agent: agentName,
          action,
          exitCode: code,
          output,
          errorOutput,
          duration,
          timestamp: new Date().toISOString()
        };

        // Update context with agent result
        this.context.agentHistory.push(result);
        this.saveContext();

        if (code === 0) {
          console.log(`✅ ${agentName} completed in ${duration}ms`);
          resolve(result);
        } else {
          console.error(`❌ ${agentName} failed with code ${code}`);
          reject(new Error(`Agent ${agentName} failed: ${errorOutput}`));
        }
      });

      // Track running agent
      this.runningAgents.set(agentName, agentProcess);
    });
  }

  /**
   * Execute multiple agents in parallel
   */
  async executeParallel(agents) {
    console.log(`⚡ Executing ${agents.length} agents in parallel`);
    const promises = agents.map(({ agent, action, options }) => 
      this.executeAgent(agent, action, options)
    );
    
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    if (failed.length > 0) {
      console.warn(`⚠️  ${failed.length} agents failed`);
      failed.forEach(f => console.error(`  - ${f.reason}`));
    }
    
    return {
      successful: successful.map(s => s.value),
      failed: failed.map(f => f.reason)
    };
  }

  /**
   * Execute a predefined workflow
   */
  async executeWorkflow(workflowName, options = {}) {
    const workflow = this.workflows[workflowName];
    if (!workflow) {
      throw new Error(`Unknown workflow: ${workflowName}`);
    }

    console.log(`\n🔄 Executing workflow: ${workflowName}`);
    console.log('='.repeat(50));

    const results = [];
    let currentStep = 1;

    for (const step of workflow.steps) {
      console.log(`\n📍 Step ${currentStep}/${workflow.steps.length}: ${step.agent} - ${step.action}`);
      
      try {
        if (step.parallel && workflow.steps[currentStep]) {
          // Collect parallel steps
          const parallelSteps = [step];
          let nextIndex = currentStep;
          
          while (workflow.steps[nextIndex] && workflow.steps[nextIndex].parallel) {
            parallelSteps.push(workflow.steps[nextIndex]);
            nextIndex++;
          }

          // Execute in parallel
          const parallelResults = await this.executeParallel(
            parallelSteps.map(s => ({
              agent: s.agent,
              action: s.action,
              options: options[s.agent] || {}
            }))
          );
          
          results.push(...parallelResults.successful);
          currentStep = nextIndex;
        } else {
          // Execute sequentially
          const result = await this.executeAgent(
            step.agent,
            step.action,
            options[step.agent] || {}
          );
          results.push(result);
          currentStep++;
        }
      } catch (error) {
        console.error(`❌ Step failed: ${error.message}`);
        if (!options.continueOnError) {
          throw error;
        }
      }
    }

    console.log('\n✨ Workflow completed');
    return results;
  }

  /**
   * Get agent capabilities
   */
  getCapabilities(agentName) {
    const agent = this.agents[agentName];
    return agent ? agent.capabilities : [];
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability) {
    return Object.entries(this.agents)
      .filter(([_, agent]) => agent.capabilities.includes(capability))
      .map(([name, _]) => name);
  }

  /**
   * Build command line arguments from options
   */
  buildArgs(options) {
    const args = [];
    for (const [key, value] of Object.entries(options)) {
      if (typeof value === 'boolean' && value) {
        args.push(`--${key}`);
      } else if (value !== undefined && value !== null) {
        args.push(`--${key}`, String(value));
      }
    }
    return args;
  }

  /**
   * Monitor agent health
   */
  async checkAgentHealth() {
    console.log('🏥 Checking agent health...');
    const health = {};

    for (const [name, agent] of Object.entries(this.agents)) {
      const scriptPath = path.join(this.agentsDir, agent.script);
      health[name] = {
        exists: fs.existsSync(scriptPath),
        capabilities: agent.capabilities,
        priority: agent.priority
      };

      // Try to run help command
      try {
        execSync(`node ${scriptPath} help`, { 
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
        health[name].responsive = true;
      } catch {
        health[name].responsive = false;
      }
    }

    return health;
  }

  /**
   * Create custom workflow
   */
  createWorkflow(name, steps) {
    this.workflows[name] = { steps };
    this.saveWorkflow(name);
    console.log(`✅ Created workflow: ${name}`);
  }

  /**
   * Save workflow to file
   */
  saveWorkflow(name) {
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir, { recursive: true });
    }
    
    const workflowFile = path.join(this.workflowsDir, `${name}.json`);
    fs.writeFileSync(
      workflowFile,
      JSON.stringify(this.workflows[name], null, 2)
    );
  }

  /**
   * Load workflows from directory
   */
  loadWorkflows() {
    if (!fs.existsSync(this.workflowsDir)) {
      return;
    }

    const files = fs.readdirSync(this.workflowsDir)
      .filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const name = file.replace('.json', '');
      const content = fs.readFileSync(path.join(this.workflowsDir, file), 'utf8');
      this.workflows[name] = JSON.parse(content);
    });
  }

  /**
   * Display help
   */
  displayHelp() {
    console.log(`
🎯 Agent Orchestrator - Coordinate Multiple AI Agents

Usage:
  node scripts/agent-orchestrator.js [command] [options]

Commands:
  execute <agent> <action>    Execute a single agent
  workflow <name>             Execute a predefined workflow
  parallel <agents...>        Execute multiple agents in parallel
  health                      Check health of all agents
  list-agents                 List all available agents
  list-workflows             List all available workflows
  create-workflow            Create a new workflow
  help                       Show this help message

Available Workflows:
${Object.keys(this.workflows).map(w => `  - ${w}`).join('\n')}

Available Agents:
${Object.entries(this.agents).map(([name, agent]) => 
  `  - ${name}: ${agent.description}`
).join('\n')}

Examples:
  node scripts/agent-orchestrator.js execute pattern-generator generate
  node scripts/agent-orchestrator.js workflow full-pattern-implementation
  node scripts/agent-orchestrator.js parallel testing-agent:generate design-agent:analyze
  node scripts/agent-orchestrator.js health
    `);
  }
}

// CLI Interface
async function main() {
  const orchestrator = new AgentOrchestrator();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    orchestrator.displayHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'execute':
        if (args.length < 3) {
          console.error('Usage: execute <agent> <action>');
          return;
        }
        await orchestrator.executeAgent(args[1], args[2]);
        break;

      case 'workflow':
        if (args.length < 2) {
          console.error('Usage: workflow <name>');
          console.log('Available workflows:', Object.keys(orchestrator.workflows));
          return;
        }
        await orchestrator.executeWorkflow(args[1]);
        break;

      case 'parallel':
        if (args.length < 2) {
          console.error('Usage: parallel <agent:action> [agent:action...]');
          return;
        }
        const parallelTasks = args.slice(1).map(spec => {
          const [agent, action] = spec.split(':');
          return { agent, action, options: {} };
        });
        await orchestrator.executeParallel(parallelTasks);
        break;

      case 'health':
        const health = await orchestrator.checkAgentHealth();
        console.log('\n🏥 Agent Health Report:');
        console.log('='.repeat(40));
        for (const [name, status] of Object.entries(health)) {
          const icon = status.exists && status.responsive ? '✅' : '❌';
          console.log(`${icon} ${name}:`);
          console.log(`   Exists: ${status.exists}`);
          console.log(`   Responsive: ${status.responsive}`);
          console.log(`   Priority: ${status.priority}`);
        }
        break;

      case 'list-agents':
        console.log('\n🤖 Available Agents:');
        console.log('='.repeat(40));
        for (const [name, agent] of Object.entries(orchestrator.agents)) {
          console.log(`\n${name}:`);
          console.log(`  Description: ${agent.description}`);
          console.log(`  Priority: ${agent.priority}`);
          console.log(`  Capabilities: ${agent.capabilities.join(', ')}`);
        }
        break;

      case 'list-workflows':
        console.log('\n📋 Available Workflows:');
        console.log('='.repeat(40));
        for (const [name, workflow] of Object.entries(orchestrator.workflows)) {
          console.log(`\n${name}:`);
          console.log('  Steps:');
          workflow.steps.forEach((step, i) => {
            console.log(`    ${i + 1}. ${step.agent}: ${step.action} ${step.parallel ? '(parallel)' : ''}`);
          });
        }
        break;

      default:
        console.error(`Unknown command: ${command}`);
        orchestrator.displayHelp();
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

module.exports = AgentOrchestrator;