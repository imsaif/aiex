import { Pattern } from '../types';
import { contextualassistance } from './patterns/patterns/contextual-assistance';
import { progressivedisclosure } from './patterns/patterns/progressive-disclosure';
import { humanintheloop } from './patterns/patterns/human-in-the-loop';
import { explainableai } from './patterns/patterns/explainable-ai';
import { conversationalui } from './patterns/patterns/conversational-ui';
import { adaptiveinterfaces } from './patterns/patterns/adaptive-interfaces';
import { multimodalinteraction } from './patterns/patterns/multimodal-interaction';
import { guidedlearning } from './patterns/patterns/guided-learning';
import { augmentedcreation } from './patterns/patterns/augmented-creation';
import { responsibleaidesign } from './patterns/patterns/responsible-ai-design';
import { errorrecovery } from './patterns/patterns/error-recovery';
import { collaborativeai } from './patterns/patterns/collaborative-ai';
import { ambientintelligence } from './patterns/patterns/ambient-intelligence';
import { safeexploration } from './patterns/patterns/safe-exploration';

export const patterns: Pattern[] = [
  contextualassistance,
  progressivedisclosure,
  humanintheloop,
  explainableai,
  conversationalui,
  adaptiveinterfaces,
  multimodalinteraction,
  guidedlearning,
  augmentedcreation,
  responsibleaidesign,
  errorrecovery,
  collaborativeai,
  ambientintelligence,
  safeexploration
];

export default patterns;

