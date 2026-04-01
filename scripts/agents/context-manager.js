#!/usr/bin/env node

/**
 * Context Manager for AI Agents
 * Based on awesome-claude-code context management patterns
 * Provides shared context, memory, and state management for all agents
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ContextManager {
  constructor() {
    this.projectRoot = path.join(__dirname, '../..');
    this.contextDir = path.join(this.projectRoot, '.agent-context');
    this.mainContextFile = path.join(this.contextDir, 'main-context.json');
    this.memoryFile = path.join(this.contextDir, 'memory.json');
    this.terminologyFile = path.join(this.contextDir, 'terminology.json');
    this.workflowStateFile = path.join(this.contextDir, 'workflow-state.json');
    
    // Initialize context directory
    this.initializeContextDir();
    
    // Load all context data
    this.loadContext();
  }

  /**
   * Initialize context directory structure
   */
  initializeContextDir() {
    if (!fs.existsSync(this.contextDir)) {
      fs.mkdirSync(this.contextDir, { recursive: true });
    }

    // Create subdirectories
    const subdirs = ['agents', 'workflows', 'sessions', 'snapshots'];
    subdirs.forEach(dir => {
      const dirPath = path.join(this.contextDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  /**
   * Load all context data
   */
  loadContext() {
    this.mainContext = this.loadJsonFile(this.mainContextFile, {
      project: {
        name: 'ai-design-patterns',
        version: '0.1.0',
        description: 'AI Design Patterns showcase with Next.js',
        lastUpdated: new Date().toISOString()
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      },
      agents: {},
      workflows: {},
      sessions: []
    });

    this.memory = this.loadJsonFile(this.memoryFile, {
      shortTerm: [],
      longTerm: {},
      patterns: {},
      decisions: []
    });

    this.terminology = this.loadJsonFile(this.terminologyFile, {
      patterns: {
        'contextual-assistance': 'AI providing help based on user context',
        'progressive-disclosure': 'Revealing information gradually as needed',
        'human-in-the-loop': 'Keeping humans involved in AI decisions',
        'adaptive-interfaces': 'UI that adapts to user behavior',
        'ambient-intelligence': 'AI that works in the background',
        'augmented-creation': 'AI enhancing creative processes',
        'collaborative-ai': 'AI working together with humans',
        'conversational-ui': 'Natural language interfaces',
        'error-recovery': 'Graceful handling of errors',
        'explainable-ai': 'AI that can explain its decisions',
        'guided-learning': 'AI-assisted learning experiences',
        'multimodal-interaction': 'Multiple input/output modalities',
        'responsible-ai-design': 'Ethical AI implementation',
        'safe-exploration': 'Risk-free experimentation with AI'
      },
      technologies: {
        'next': 'Next.js 15 React framework',
        'react': 'React 19 with concurrent features',
        'typescript': 'TypeScript for type safety',
        'tailwind': 'Tailwind CSS for styling',
        'jest': 'Testing framework',
        'framer-motion': 'Animation library'
      },
      conventions: {
        'kebab-case': 'lowercase-with-hyphens naming',
        'component-structure': 'Organized by feature and type',
        'test-coverage': 'Target 70% coverage minimum'
      }
    });

    this.workflowState = this.loadJsonFile(this.workflowStateFile, {
      active: [],
      completed: [],
      queued: []
    });
  }

  /**
   * Load JSON file with default fallback
   */
  loadJsonFile(filepath, defaultValue = {}) {
    try {
      if (fs.existsSync(filepath)) {
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
      }
      return defaultValue;
    } catch (error) {
      console.warn(`Failed to load ${filepath}:`, error.message);
      return defaultValue;
    }
  }

  /**
   * Save JSON file
   */
  saveJsonFile(filepath, data) {
    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to save ${filepath}:`, error.message);
      return false;
    }
  }

  /**
   * Get agent-specific context
   */
  getAgentContext(agentName) {
    const agentFile = path.join(this.contextDir, 'agents', `${agentName}.json`);
    const agentContext = this.loadJsonFile(agentFile, {
      name: agentName,
      lastRun: null,
      runCount: 0,
      state: {},
      history: []
    });

    // Merge with main context
    return {
      ...this.mainContext,
      agent: agentContext,
      memory: this.memory,
      terminology: this.terminology
    };
  }

  /**
   * Update agent context after execution
   */
  updateAgentContext(agentName, executionData) {
    const agentFile = path.join(this.contextDir, 'agents', `${agentName}.json`);
    const agentContext = this.loadJsonFile(agentFile, {
      name: agentName,
      lastRun: null,
      runCount: 0,
      state: {},
      history: []
    });

    // Update agent context
    agentContext.lastRun = new Date().toISOString();
    agentContext.runCount++;
    agentContext.history.push({
      timestamp: new Date().toISOString(),
      action: executionData.action,
      success: executionData.success,
      duration: executionData.duration,
      output: executionData.output?.substring(0, 500) // Store first 500 chars
    });

    // Keep only last 50 history entries
    if (agentContext.history.length > 50) {
      agentContext.history = agentContext.history.slice(-50);
    }

    // Update state if provided
    if (executionData.state) {
      agentContext.state = { ...agentContext.state, ...executionData.state };
    }

    // Save agent context
    this.saveJsonFile(agentFile, agentContext);

    // Update main context
    this.mainContext.agents[agentName] = {
      lastRun: agentContext.lastRun,
      runCount: agentContext.runCount
    };
    this.saveJsonFile(this.mainContextFile, this.mainContext);

    // Add to memory
    this.addToMemory('agent_execution', {
      agent: agentName,
      action: executionData.action,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add information to memory
   */
  addToMemory(type, data) {
    // Add to short-term memory
    this.memory.shortTerm.push({
      type,
      data,
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 short-term memories
    if (this.memory.shortTerm.length > 100) {
      this.memory.shortTerm = this.memory.shortTerm.slice(-100);
    }

    // Add to long-term memory if important
    if (this.isImportantMemory(type, data)) {
      const key = this.generateMemoryKey(type, data);
      this.memory.longTerm[key] = {
        type,
        data,
        timestamp: new Date().toISOString(),
        accessCount: 1
      };
    }

    this.saveJsonFile(this.memoryFile, this.memory);
  }

  /**
   * Determine if memory is important enough for long-term storage
   */
  isImportantMemory(type, data) {
    const importantTypes = [
      'pattern_created',
      'test_generated',
      'design_fixed',
      'workflow_completed',
      'error_resolved'
    ];
    
    return importantTypes.includes(type) || 
           (data.priority && data.priority === 'high');
  }

  /**
   * Generate unique key for memory item
   */
  generateMemoryKey(type, data) {
    const content = JSON.stringify({ type, data });
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
  }

  /**
   * Get relevant memories for a task
   */
  getRelevantMemories(taskDescription) {
    const keywords = this.extractKeywords(taskDescription);
    const relevant = [];

    // Search short-term memory
    this.memory.shortTerm.forEach(mem => {
      if (this.isRelevantToKeywords(mem, keywords)) {
        relevant.push(mem);
      }
    });

    // Search long-term memory
    Object.values(this.memory.longTerm).forEach(mem => {
      if (this.isRelevantToKeywords(mem, keywords)) {
        mem.accessCount++;
        relevant.push(mem);
      }
    });

    // Sort by relevance and recency
    relevant.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });

    return relevant.slice(0, 10); // Return top 10 relevant memories
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
  }

  /**
   * Check if memory is relevant to keywords
   */
  isRelevantToKeywords(memory, keywords) {
    const memoryText = JSON.stringify(memory).toLowerCase();
    return keywords.some(keyword => memoryText.includes(keyword));
  }

  /**
   * Create workflow session
   */
  createWorkflowSession(workflowName) {
    const sessionId = crypto.randomBytes(8).toString('hex');
    const session = {
      id: sessionId,
      workflow: workflowName,
      startTime: new Date().toISOString(),
      status: 'active',
      steps: [],
      context: {}
    };

    const sessionFile = path.join(this.contextDir, 'sessions', `${sessionId}.json`);
    this.saveJsonFile(sessionFile, session);

    // Add to workflow state
    this.workflowState.active.push(sessionId);
    this.saveJsonFile(this.workflowStateFile, this.workflowState);

    return sessionId;
  }

  /**
   * Update workflow session
   */
  updateWorkflowSession(sessionId, update) {
    const sessionFile = path.join(this.contextDir, 'sessions', `${sessionId}.json`);
    const session = this.loadJsonFile(sessionFile);
    
    if (!session) {
      console.error(`Session ${sessionId} not found`);
      return;
    }

    // Apply updates
    Object.assign(session, update);
    
    // Add step if provided
    if (update.step) {
      session.steps.push({
        ...update.step,
        timestamp: new Date().toISOString()
      });
    }

    this.saveJsonFile(sessionFile, session);

    // Update workflow state if status changed
    if (update.status === 'completed') {
      this.workflowState.active = this.workflowState.active.filter(id => id !== sessionId);
      this.workflowState.completed.push(sessionId);
      this.saveJsonFile(this.workflowStateFile, this.workflowState);
    }
  }

  /**
   * Create context snapshot
   */
  createSnapshot(description) {
    const snapshotId = crypto.randomBytes(8).toString('hex');
    const snapshot = {
      id: snapshotId,
      description,
      timestamp: new Date().toISOString(),
      context: this.mainContext,
      memory: this.memory,
      workflowState: this.workflowState
    };

    const snapshotFile = path.join(this.contextDir, 'snapshots', `${snapshotId}.json`);
    this.saveJsonFile(snapshotFile, snapshot);

    console.log(`📸 Created snapshot: ${snapshotId} - ${description}`);
    return snapshotId;
  }

  /**
   * Restore from snapshot
   */
  restoreSnapshot(snapshotId) {
    const snapshotFile = path.join(this.contextDir, 'snapshots', `${snapshotId}.json`);
    const snapshot = this.loadJsonFile(snapshotFile);
    
    if (!snapshot) {
      console.error(`Snapshot ${snapshotId} not found`);
      return false;
    }

    // Restore all context data
    this.mainContext = snapshot.context;
    this.memory = snapshot.memory;
    this.workflowState = snapshot.workflowState;

    // Save restored data
    this.saveJsonFile(this.mainContextFile, this.mainContext);
    this.saveJsonFile(this.memoryFile, this.memory);
    this.saveJsonFile(this.workflowStateFile, this.workflowState);

    console.log(`✅ Restored from snapshot: ${snapshotId}`);
    return true;
  }

  /**
   * Prime context with project information
   */
  primeContext() {
    console.log('🧠 Priming context with project information...');

    // Load CLAUDE.md
    const claudePath = path.join(this.projectRoot, 'CLAUDE.md');
    if (fs.existsSync(claudePath)) {
      const claudeContent = fs.readFileSync(claudePath, 'utf8');
      this.mainContext.project.guidelines = this.extractGuidelines(claudeContent);
      console.log('  ✅ Loaded CLAUDE.md guidelines');
    }

    // Load package.json
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      this.mainContext.project.dependencies = Object.keys(packageJson.dependencies || {});
      this.mainContext.project.scripts = Object.keys(packageJson.scripts || {});
      console.log('  ✅ Loaded package.json');
    }

    // Scan project structure
    this.mainContext.project.structure = this.scanProjectStructure();
    console.log('  ✅ Scanned project structure');

    // Save primed context
    this.saveJsonFile(this.mainContextFile, this.mainContext);
    console.log('✨ Context priming complete');
  }

  /**
   * Extract guidelines from CLAUDE.md
   */
  extractGuidelines(content) {
    const guidelines = [];
    const lines = content.split('\n');
    
    let inGuideline = false;
    let currentGuideline = '';
    
    lines.forEach(line => {
      if (line.startsWith('###') || line.startsWith('##')) {
        if (currentGuideline) {
          guidelines.push(currentGuideline.trim());
          currentGuideline = '';
        }
        inGuideline = line.toLowerCase().includes('practice') || 
                     line.toLowerCase().includes('convention') ||
                     line.toLowerCase().includes('requirement');
      } else if (inGuideline && line.startsWith('-')) {
        currentGuideline += line + '\n';
      }
    });
    
    if (currentGuideline) {
      guidelines.push(currentGuideline.trim());
    }
    
    return guidelines;
  }

  /**
   * Scan project structure
   */
  scanProjectStructure() {
    const structure = {
      components: [],
      patterns: [],
      tests: [],
      scripts: []
    };

    // Scan components
    const componentsDir = path.join(this.projectRoot, 'src', 'components');
    if (fs.existsSync(componentsDir)) {
      structure.components = this.scanDirectory(componentsDir, '.tsx');
    }

    // Scan patterns
    const patternsDir = path.join(this.projectRoot, 'src', 'data', 'patterns', 'patterns');
    if (fs.existsSync(patternsDir)) {
      structure.patterns = fs.readdirSync(patternsDir)
        .filter(f => fs.statSync(path.join(patternsDir, f)).isDirectory());
    }

    // Scan tests
    structure.tests = structure.components
      .filter(f => f.includes('__tests__') || f.endsWith('.test.tsx'));

    // Scan scripts
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    if (fs.existsSync(scriptsDir)) {
      structure.scripts = fs.readdirSync(scriptsDir)
        .filter(f => f.endsWith('.js'));
    }

    return structure;
  }

  /**
   * Recursively scan directory for files
   */
  scanDirectory(dir, extension) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.scanDirectory(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath.replace(this.projectRoot + path.sep, ''));
      }
    });
    
    return files;
  }

  /**
   * Display context status
   */
  displayStatus() {
    console.log('\n📊 Context Manager Status');
    console.log('='.repeat(50));
    
    console.log('\n🧠 Main Context:');
    console.log(`  Project: ${this.mainContext.project.name} v${this.mainContext.project.version}`);
    console.log(`  Agents tracked: ${Object.keys(this.mainContext.agents).length}`);
    console.log(`  Active workflows: ${this.workflowState.active.length}`);
    
    console.log('\n💾 Memory:');
    console.log(`  Short-term memories: ${this.memory.shortTerm.length}`);
    console.log(`  Long-term memories: ${Object.keys(this.memory.longTerm).length}`);
    console.log(`  Pattern memories: ${Object.keys(this.memory.patterns).length}`);
    
    console.log('\n📚 Terminology:');
    console.log(`  Patterns defined: ${Object.keys(this.terminology.patterns).length}`);
    console.log(`  Technologies: ${Object.keys(this.terminology.technologies).length}`);
    
    console.log('\n📸 Snapshots:');
    const snapshotsDir = path.join(this.contextDir, 'snapshots');
    if (fs.existsSync(snapshotsDir)) {
      const snapshots = fs.readdirSync(snapshotsDir);
      console.log(`  Total snapshots: ${snapshots.length}`);
    }
  }

  /**
   * Display help
   */
  displayHelp() {
    console.log(`
🧠 Context Manager - Shared Context for AI Agents

Usage:
  node scripts/context-manager.js [command] [options]

Commands:
  prime                       Prime context with project information
  status                      Display context status
  snapshot <description>      Create context snapshot
  restore <id>               Restore from snapshot
  memory <query>             Search memories
  clear-memory               Clear short-term memory
  help                       Show this help message

Examples:
  node scripts/context-manager.js prime
  node scripts/context-manager.js status
  node scripts/context-manager.js snapshot "Before major refactor"
  node scripts/context-manager.js restore abc123
  node scripts/context-manager.js memory "pattern generation"
    `);
  }
}

// CLI Interface
async function main() {
  const manager = new ContextManager();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help') {
    manager.displayHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'prime':
        manager.primeContext();
        break;

      case 'status':
        manager.displayStatus();
        break;

      case 'snapshot':
        if (args.length < 2) {
          console.error('Usage: snapshot <description>');
          return;
        }
        manager.createSnapshot(args.slice(1).join(' '));
        break;

      case 'restore':
        if (args.length < 2) {
          console.error('Usage: restore <snapshot-id>');
          return;
        }
        manager.restoreSnapshot(args[1]);
        break;

      case 'memory':
        if (args.length < 2) {
          console.error('Usage: memory <query>');
          return;
        }
        const memories = manager.getRelevantMemories(args.slice(1).join(' '));
        console.log('\n🔍 Relevant Memories:');
        memories.forEach((mem, i) => {
          console.log(`\n${i + 1}. ${mem.type} (${mem.timestamp})`);
          console.log(`   ${JSON.stringify(mem.data).substring(0, 100)}...`);
        });
        break;

      case 'clear-memory':
        manager.memory.shortTerm = [];
        manager.saveJsonFile(manager.memoryFile, manager.memory);
        console.log('✅ Short-term memory cleared');
        break;

      default:
        console.error(`Unknown command: ${command}`);
        manager.displayHelp();
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

module.exports = ContextManager;