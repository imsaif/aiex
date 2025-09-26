#!/usr/bin/env node

/**
 * Cline Integration Script
 * Provides a bridge for Cline to interact with the Agent Orchestrator.
 */

const { exec } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const orchestratorScript = path.join(projectRoot, 'scripts', 'agent-orchestrator.js');

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stderr: ${stderr}`);
        return reject(error);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const subArgs = args.slice(1).join(' ');

  console.log(`Cline Integration: Running command '${command}' with args '${subArgs}'`);

  try {
    let result;
    switch (command) {
      case 'orchestrate':
        result = await runCommand(`node ${orchestratorScript} ${subArgs}`);
        break;
      case 'test':
        result = await runCommand(`npm test ${subArgs}`);
        break;
      case 'lint':
        result = await runCommand(`npm run lint ${subArgs}`);
        break;
      case 'ts-validate':
        result = await runCommand(`npm run ts-validate ${subArgs}`);
        break;
      case 'design-analyze':
        result = await runCommand(`npm run design-analyze ${subArgs}`);
        break;
      case 'usage-report':
        result = await runCommand(`npm run usage:daily ${subArgs}`);
        break;
      case 'error-status':
        result = await runCommand(`npm run error-status ${subArgs}`);
        break;
      // Add more commands as needed to expose project scripts to Cline
      default:
        console.error(`Unknown Cline integration command: ${command}`);
        process.exit(1);
    }
    console.log(`Command '${command}' completed successfully.`);
    console.log(result);
  } catch (error) {
    console.error(`Error executing Cline integration command '${command}':`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
