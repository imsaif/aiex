import { CodeExample } from '../../../../types';
import { errorRecoveryDemoCode } from './_code/error-recovery-demo';

export const codeExamples: CodeExample[] = [
  {
    title: "Error Recovery & Graceful Degradation",
    description: "Comprehensive demo showcasing error recovery patterns including network failures, API errors, timeouts, state preservation, retry logic, and graceful degradation to basic functionality when AI services fail.",
    language: "tsx",
    componentId: "error-recovery-demo",
    code: errorRecoveryDemoCode
  }
];
