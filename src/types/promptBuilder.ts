export type AITool = 'claude' | 'cursor' | 'chatgpt' | 'copilot' | 'figma' | 'generic';

export type UseCase = 'project-setup' | 'component' | 'code-help' | 'custom';

export type FileType = 'cursorrules' | 'clinerules' | 'claude-md' | 'txt';

export interface DesignSystem {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  componentLibrary?: string;
}

export interface PromptFormData {
  aiTool: AITool | '';
  useCase: UseCase | '';
  designSystem: DesignSystem;
  projectContext: string;
  specificTask: string;
  template?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: UseCase;
  defaultValues: Partial<PromptFormData>;
  promptTemplate: string;
}

export interface GeneratedPrompt {
  content: string;
  fileType: FileType;
  filename: string;
  characterCount: number;
  lineCount: number;
}
