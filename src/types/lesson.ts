/**
 * Structured Lesson Content Types
 * Enables rendering lessons with React components instead of HTML strings
 */

export type LessonSectionType =
  | 'intro'
  | 'heading'
  | 'text'
  | 'list'
  | 'callout'
  | 'steps'
  | 'code'
  | 'code-preview'
  | 'image'
  | 'completion';

export type IconType =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'check'
  | 'monitor'
  | 'download'
  | 'lock'
  | 'user'
  | 'key'
  | 'terminal'
  | 'code'
  | 'github'
  | 'cog'
  | 'none';

export type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';

export interface IntroSection {
  type: 'intro';
  content: string;
  icon?: IconType;
}

export interface HeadingSection {
  type: 'heading';
  level: 'h2' | 'h3' | 'h4';
  content: string;
}

export interface TextSection {
  type: 'text';
  content: string;
}

export interface ListSection {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export interface CalloutSection {
  type: 'callout';
  calloutType: CalloutType;
  title?: string;
  content: string;
  icon?: IconType;
}

export interface StepItem {
  number: number;
  title: string;
  content: string | string[];
  icon?: IconType;
}

export interface StepsSection {
  type: 'steps';
  steps: StepItem[];
}

export interface CodeSection {
  type: 'code';
  code: string;
  language?: string;
  label?: string;
}

export interface ImageSection {
  type: 'image';
  src?: string;
  alt: string;
  label?: string;
}

export interface CompletionSection {
  type: 'completion';
  title: string;
  items: string[];
  message: string;
}

export interface CodePreviewSection {
  type: 'code-preview';
  code: string;
  language?: string;
  label?: string;
  /** Maps to a specific preview component */
  previewId: string;
}

export type LessonSection =
  | IntroSection
  | HeadingSection
  | TextSection
  | ListSection
  | CalloutSection
  | StepsSection
  | CodeSection
  | CodePreviewSection
  | ImageSection
  | CompletionSection;

export interface StructuredLesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  module: string;
  sections: LessonSection[];
}
