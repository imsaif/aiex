# Guides Section Icon-Related Implementations - Comprehensive Analysis

## Project Overview
The guides section is a comprehensive learning system for designers to understand AI tools (Claude Code, Cursor, GitHub, etc.). It uses structured lesson hierarchies with modular components and icon-based visual indicators throughout.

---

## 1. Guides Pages Structure

### Pages Organization
- **`/guides`** - Main guides listing page
  - File: `/Users/imranmohammed/aiex/src/app/guides/page.tsx`
  - Uses: `<GuidesClient />` component
  
- **`/guides/[slug]`** - Individual guide detail page  
  - File: `/Users/imranmohammed/aiex/src/app/guides/[slug]/page.tsx`
  - Uses: `<GuideClient />` component
  - Dynamic routing with slug parameter

### Client Components
1. **GuidesClient** (`/Users/imranmohammed/aiex/src/app/guides/guides-client.tsx`)
   - Lists all guides in a grid
   - Implements filtering, sorting, and search
   - Uses CourseCard component for each guide

2. **GuideClient** (`/Users/imranmohammed/aiex/src/app/guides/[slug]/guide-client.tsx`)
   - Displays single guide detail
   - Shows lessons organized in modules
   - Uses ModuleSection for module display
   - Implements tool-specific icons

---

## 2. Icon Components & Libraries

### Primary Icon Libraries Used
1. **@heroicons/react/24/outline** - Main icon library
   - Used for UI controls and lesson icons
   - Comprehensive Heroicons collection

2. **@lobehub/icons** - Tool-specific icons
   - Contains: `Claude`, `Cursor`, `Github`, `Replit`, `V0`, `Copilot`
   - Used in course cards and guide headers

### Icon Utility Files

#### A. `lessonIcons.tsx`
**Location**: `/Users/imranmohammed/aiex/src/utils/lessonIcons.tsx`

**Purpose**: Maps lesson titles to appropriate Heroicons

**Key Function**: `getLessonIcon(title: string, iconType?: string)`
- Analyzes lesson titles for keywords
- Returns appropriate Heroicons component (w-6 h-6)
- Falls back to `CodeBracketIcon` as default

**Icon Types Supported**:
- `key` → KeyIcon
- `download` → ArrowDownTrayIcon
- `settings` → Cog6ToothIcon
- `code` → CodeBracketIcon
- `git` → CodeBracketSquareIcon
- `test` → BeakerIcon
- `star` → StarIcon
- `alert` → ExclamationCircleIcon
- `lightbulb` → LightBulbIcon
- `folder` → FolderIcon
- `eye` → EyeIcon
- `pencil` → PencilIcon
- `share` → ShareIcon
- `chat` → ChatBubbleLeftIcon
- `refresh` → ArrowPathIcon

**Keyword Matching** (in order of specificity):
- 'troubleshoot', 'issue', 'problem', 'error' → ExclamationCircleIcon
- 'folder', 'directory', 'project folder' → FolderIcon
- 'see', 'view', 'live', 'preview' → EyeIcon
- 'edit', 'back to editing', 'refactor' → PencilIcon
- 'share', 'handing off', 'hand off' → ShareIcon
- 'describe', 'chat', 'prompt' → ChatBubbleLeftIcon
- 'iterate', 'iteration', 'feedback' → ArrowPathIcon
- 'api', 'key', 'anthropic' → KeyIcon
- 'install', 'setup node', 'npm install', 'download' → ArrowDownTrayIcon
- 'configure', 'config', 'initialize', 'settings' → Cog6ToothIcon
- 'generate', 'first prototype' → LightBulbIcon
- 'github', 'repository', 'git', 'branch', 'commit', 'push', 'version', 'connect' → CodeBracketSquareIcon
- 'test', 'testing', 'debug' → BeakerIcon
- 'best practice', 'practice', 'pattern', 'strategy', 'workflow' → StarIcon
- 'development', 'dev', 'server', 'code', 'interface', 'navigate' → CodeBracketIcon (default)

---

## 3. Component-Level Icon Implementation

### A. CourseCard Component
**Location**: `/Users/imranmohammed/aiex/src/components/ui/CourseCard.tsx`

**Purpose**: Displays guide cards in grid layout

**Icon Implementation**:
```tsx
// Tool-specific icons using @lobehub/icons
const getIcon = () => {
  const iconProps = { size: 56 };
  switch (course.tool?.toLowerCase()) {
    case 'claude code':
      return <div style={{ color: '#D97757' }}><Claude {...iconProps} /></div>;
    case 'cursor':
      return <div style={{ color: '#000' }}><Cursor {...iconProps} /></div>;
    case 'github':
      return <div style={{ color: '#000' }}><Github {...iconProps} /></div>;
    case 'github copilot':
      return <Copilot.Color {...iconProps} />;
    case 'replit ai':
    case 'replit':
      return <div style={{ color: '#FD5402' }}><Replit {...iconProps} /></div>;
    case 'v0 by vercel':
    case 'v0':
      return <div style={{ color: '#000' }}><V0 {...iconProps} /></div>;
    default:
      return null;
  }
};
```

**Icon Characteristics**:
- Size: 56px for guide cards
- Colors are brand colors (Claude #D97757, Replit #FD5402, etc.)
- Wrapped in divs for color styling
- Uses `Copilot.Color` for GitHub Copilot (pre-colored)

---

### B. ModuleSection Component
**Location**: `/Users/imranmohammed/aiex/src/components/ui/ModuleSection.tsx`

**Purpose**: Displays collapsible lesson modules with header icons

**Icon Implementation**:
```tsx
interface ModuleSectionProps {
  moduleTitle: string;
  moduleDescription: string;
  lessons: GuideLesson[];
  startLessonNumber: number;
  guideId: string;
  guideTitle: string;
  moduleIcon?: string;  // Icon type passed from parent
}

const getModuleIcon = (moduleTitle: string, iconType?: string) => {
  const iconProps = { className: 'w-5 h-5', style: { color: '#525252' } };

  // Use provided iconType if available
  if (iconType) {
    switch (iconType) {
      case 'cog':
        return <Cog6ToothIcon {...iconProps} />;
      case 'code':
        return <CodeBracketIcon {...iconProps} />;
      case 'monitor':
        return <ComputerDesktopIcon {...iconProps} />;
      case 'download':
        return <ArrowDownTrayIcon {...iconProps} />;
      case 'user':
        return <UserGroupIcon {...iconProps} />;
      case 'github':
        return <Github size={20} style={{ color: '#525252' }} />;
      case 'check':
        return <CheckIcon {...iconProps} />;
      default:
        break;
    }
  }

  // Fallback to title-based detection
  if (moduleTitle.includes('Setup')) return <Cog6ToothIcon {...iconProps} />;
  if (moduleTitle.includes('Prototype')) return <LightBulbIcon {...iconProps} />;
  if (moduleTitle.includes('GitHub') || moduleTitle.includes('Git')) 
    return <Github size={20} style={{ color: '#525252' }} />;
  if (moduleTitle.includes('Best Practices') || moduleTitle.includes('Practices')) 
    return <StarIcon {...iconProps} />;
  return null;
};
```

**Icon Sizing**: 
- Heroicons: w-5 h-5 (20px)
- GitHub icon: size={20}
- Color: #525252 (neutral gray)

**Icon States**:
- Render with title-based or explicit iconType
- Support expand/collapse with chevron rotation animation
- Display completion percentage with green checkmark SVG

---

### C. ModularLessonCard Component
**Location**: `/Users/imranmohammed/aiex/src/components/ui/ModularLessonCard.tsx`

**Purpose**: Individual lesson card with completion status

**Icon Implementation**:
- Uses `getLessonIcon()` from lessonIcons.tsx utility
- Displays lesson icon OR checkmark if completed
- Icon box styling:
  - Completed: `bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400`
  - Not Started: `bg-accent-subtle text-accent-primary`
- Icon sizing: w-6 h-6 (24px)
- Chevron icon for expand/collapse

---

### D. LessonRenderer Component
**Location**: `/Users/imranmohammed/aiex/src/components/ui/LessonRenderer.tsx`

**Purpose**: Renders structured lesson content with section-specific icons

**Icon System**:
```tsx
const getIcon = (iconType: IconType) => {
  const iconProps = { className: 'w-6 h-6' };
  switch (iconType) {
    case 'info':
      return <InformationCircleIcon {...iconProps} />;
    case 'warning':
      return <ExclamationTriangleIcon {...iconProps} />;
    case 'success':
      return <CheckCircleIcon {...iconProps} />;
    case 'error':
      return <XCircleIcon {...iconProps} />;
    case 'check':
      return <CheckIcon {...iconProps} />;
    case 'monitor':
      return <ComputerDesktopIcon {...iconProps} />;
    case 'download':
      return <ArrowDownTrayIcon {...iconProps} />;
    case 'lock':
      return <LockClosedIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'key':
      return <KeyIcon {...iconProps} />;
    case 'terminal':
      return <CommandLineIcon {...iconProps} />;
    case 'code':
      return <CodeBracketIcon {...iconProps} />;
    case 'github':
      return <DocumentIcon {...iconProps} />;
    case 'image':
      return <DocumentIcon {...iconProps} />;
    case 'cog':
      return <Cog6ToothIcon {...iconProps} />;
    default:
      return null;
  }
};
```

**Heading Icons**:
- 'Setup' → Cog6ToothIcon
- 'Prototype' → LightBulbIcon
- 'GitHub'/'Git' → GitHub icon from @lobehub/icons
- 'Best Practices'/'Practices' → StarIcon
- Default: null

**Callout Styles** (with icon indicator):
- info: Blue background (#eff6ff), blue border-left
- warning: Amber background (#fef3c7), amber border-left
- success: Green background (#f0fdf4), green border-left
- error: Red background (#fef2f2), red border-left
- tip: Purple background (#f5f3ff), purple border-left

---

### E. StatusBadge Component
**Location**: `/Users/imranmohammed/aiex/src/components/ui/StatusBadge.tsx`

**Purpose**: Visual status indicators (no icons, text-based)

**Statuses**:
- `not-started` → Gray background, "Not Started" label
- `in-progress` → Blue background, "In Progress" label
- `completed` → Green background, "Completed" label
- `ready` → Light green, "Ready" label (for guides)
- `work-in-progress` → Yellow background, "Work in Progress" label (for guides)

**Sizing**:
- `sm`: px-2.5 py-1 text-xs
- `md`: px-3 py-1.5 text-sm

---

## 4. Guide Data Structure & Icon Configuration

### Guide Data File
**Location**: `/Users/imranmohammed/aiex/src/data/guides.ts`

**Main Export**: `guides: Guide[]`

**Guide Structure with Icons**:
```typescript
interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  tool: GuideTool; // 'Claude Code' | 'Cursor' | 'GitHub' | etc.
  useCase: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  designDomain: string;
  readTime: number;
  author?: string;
  publishedDate: string;
  status: 'ready' | 'work-in-progress';
  thumbnail?: string;
  tags?: string[];
  lessons?: GuideLesson[];
  content: string;
  relatedPatterns?: string[];
  relatedGuides?: string[];
}
```

### Lesson Structure with Icons
```typescript
interface GuideLesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  module?: string; // "setup" | "prototype" | "github" | "practices"
  iconType?: string; // Explicit icon type for lessons
  sections?: LessonSection[];
}
```

### Available Guides
1. **Claude Code Guide for Designers**
   - Slug: `claude-code-learning-path`
   - Tool: "Claude Code"
   - Status: "ready"
   - Modules: setup, features, prototype, prototyping, collaboration, github, practices
   - Lessons: 18 total

2. **Cursor Learning Path**
   - Slug: `cursor-learning-path`
   - Tool: "Cursor"
   - Status: "ready"
   - Modules: setup, features, design-to-code, advanced
   - Lessons: 12 total

---

## 5. Lesson Content Icons (LessonSection Types)

### Icon Types Used in Lesson Sections
**Location**: `/Users/imranmohammed/aiex/src/types/lesson.ts`

```typescript
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
```

### Section Types with Icons
1. **intro** - Introduction section
   - Can include icon
   - Example: `icon: 'info'`

2. **callout** - Callout/highlight box
   - Callout types: info, warning, success, error, tip
   - Can include icon
   - Color-coded by callout type

3. **steps** - Numbered steps
   - Each step can have icon
   - Examples in guides.ts: user, mail, star, check, download, cog, monitor, warning, error, success, compass, terminal, folder, search

4. **heading** - Section headings
   - h2, h3, h4 levels
   - Auto-assigned icon based on content

5. **text** - Plain text

6. **list** - Bullet or numbered lists

7. **code** - Code blocks

8. **image** - Image blocks

9. **completion** - Lesson completion section

---

## 6. Icon Mappings in Guide Data

### Module Icons (from guide-client.tsx moduleConfig)
```typescript
const moduleConfig: Record<string, { title: string; description: string; icon: string }> = {
  setup: {
    title: 'Setup',
    description: 'Get started and set up your environment',
    icon: 'cog',
  },
  features: {
    title: 'Core Features',
    description: 'Master the main features and capabilities',
    icon: 'code',
  },
  prototype: {
    title: 'Prototype',
    description: 'Build and test your first project',
    icon: 'monitor',
  },
  prototyping: {
    title: 'Prototyping Workflows',
    description: 'Create interactive prototypes and designs',
    icon: 'download',
  },
  collaboration: {
    title: 'Developer Collaboration',
    description: 'Work effectively with your development team',
    icon: 'user',
  },
  github: {
    title: 'GitHub',
    description: 'Manage your projects with version control',
    icon: 'github',
  },
  practices: {
    title: 'Best Practices',
    description: 'Learn industry standards and patterns',
    icon: 'check',
  },
};
```

### Tool-Specific Icons (from CourseCard & GuideClient)
```
Claude Code → Claude icon (#D97757 - coral/orange-red)
Cursor → Cursor icon (#000 - black)
GitHub → Github icon (#000 - black)
GitHub Copilot → Copilot.Color icon (pre-colored)
Replit AI → Replit icon (#FD5402 - orange)
V0 by Vercel → V0 icon (#000 - black)
```

---

## 7. Icon Colors & Styling

### Color Scheme
- **Tool Icons**: Brand colors
  - Claude Code: #D97757 (Coral/salmon)
  - Cursor: #000 (Black)
  - GitHub: #000 (Black)
  - Replit: #FD5402 (Orange)
  - V0: #000 (Black)

- **Module Icons**: #525252 (Neutral gray)

- **Status Icons**:
  - Success/Completed: Green (#16a34a or #22c55e)
  - In Progress: Blue (#3b82f6)
  - Error: Red (#dc2626)
  - Warning: Amber (#f59e0b)
  - Info: Blue (#3b82f6)

- **UI Elements**:
  - Accent Primary: Used for interactive icons
  - Text Primary/Secondary: Used for navigation and secondary icons

### Icon Sizing
- **Course Cards**: 56px (w-14 h-14)
- **Module Headers**: 20px (w-5 h-5)
- **Lesson Cards**: 24px (w-6 h-6)
- **UI Controls**: 20-24px
- **Callout Icons**: Variable by context

---

## 8. Types & Interfaces

### Key Type Definitions
**Location**: `/Users/imranmohammed/aiex/src/types/index.ts`

```typescript
export type GuideTool = 
  'Claude Code' | 'Cursor' | 'GitHub' | 'GitHub Copilot' | 
  'Replit AI' | 'V0 by Vercel' | 'Figma' | 'Other';

export type GuideSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  tool: GuideTool;
  useCase: string;
  skillLevel: GuideSkillLevel;
  designDomain: string;
  readTime: number;
  author?: string;
  publishedDate: string;
  status: 'ready' | 'work-in-progress';
  thumbnail?: string;
  tags?: string[];
  lessons?: GuideLesson[];
  lessonCount?: number;
  content: string;
  relatedPatterns?: string[];
  relatedGuides?: string[];
}

export interface GuideLesson {
  id: string;
  title: string;
  content?: string;
  sections?: LessonSection[];
  duration: number;
  order: number;
  module?: string;
  iconType?: string;
}
```

**Lesson Section Types**: (`/Users/imranmohammed/aiex/src/types/lesson.ts`)
```typescript
export type LessonSectionType =
  | 'intro'
  | 'heading'
  | 'text'
  | 'list'
  | 'callout'
  | 'steps'
  | 'code'
  | 'image'
  | 'completion';

export type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';
```

---

## 9. Icon Usage Patterns in Guides Data

### Example: Claude Code Lesson with Icons
```typescript
{
  id: 'lesson-1',
  title: 'Get Your Anthropic API Key',
  duration: 2,
  order: 1,
  module: 'setup',
  sections: [
    {
      type: 'intro',
      content: 'Claude Code needs an API key...',
      icon: 'info',
    },
    {
      type: 'steps',
      steps: [
        {
          number: 1,
          title: 'Create an Anthropic Account',
          content: [...],
          icon: 'user',
        },
        {
          number: 2,
          title: 'Generate Your API Key',
          content: [...],
          icon: 'key',
        },
      ],
    },
    {
      type: 'image',
      src: '/images/guides/claude-code-learning-path/lesson-1/claudeapikey.gif',
      alt: 'Anthropic Console API Key Screenshot',
      label: 'Anthropic Console showing where to create and copy API keys',
    },
    {
      type: 'callout',
      calloutType: 'warning',
      title: 'Keep Your Key Secure',
      content: '...',
      icon: 'warning',
    },
  ],
}
```

### Common Icon Usage Patterns
- **Steps**: user, key, mail, star, download, monitor, cog, check
- **Callouts**: info, warning, success, error
- **Introductions**: info, compass
- **Module Headers**: cog, code, monitor, download, user, github, check, star

---

## 10. Guide Images Directory

**Location**: `/Users/imranmohammed/aiex/public/images/guides/`

**Current Guides**:
1. `/claude-code-learning-path/lesson-1/` - Claude API key setup images
2. `/cursor-learning-path/lesson-2/` - Cursor interface layout images

**Image References in Guides**:
- Claude Code: `/images/guides/claude-code-learning-path/lesson-1/claudeapikey.gif`
- Cursor: `/images/guides/cursor-learning-path/lesson-2/cursor-interface-layout.png`

---

## 11. Icon Component Imports Summary

### All Icon Sources
1. **@heroicons/react/24/outline** (19 icons used):
   - KeyIcon, ArrowDownTrayIcon, Cog6ToothIcon, CodeBracketIcon
   - CodeBracketSquareIcon, BeakerIcon, StarIcon, ExclamationCircleIcon
   - LightBulbIcon, FolderIcon, EyeIcon, PencilIcon, ShareIcon
   - ChatBubbleLeftIcon, ArrowPathIcon, CheckIcon, ChevronDownIcon
   - ComputerDesktopIcon, UserGroupIcon, CommandLineIcon
   - InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon
   - XCircleIcon, LockClosedIcon, UserIcon, DocumentIcon

2. **@lobehub/icons** (6 tool icons):
   - Claude, Cursor, Github, Replit, V0, Copilot

---

## 12. Component Tree & Icon Flow

```
/guides
├── GuidesClient
│   ├── Search & Filter UI (SVG icons for magnifying glass)
│   ├── Dropdown controls (chevron icons)
│   └── CourseCard (for each guide)
│       ├── Tool Icon (56px) - @lobehub/icons
│       ├── StatusBadge (text-only, no icons)
│       └── [Hover State]

/guides/[slug]
├── GuideClient
│   ├── Back button (ArrowLeftIcon)
│   ├── Tool Icon (24px) - @lobehub/icons
│   ├── Progress Bar & Stats
│   ├── ModuleSection (for each module)
│   │   ├── Module Icon (20px) - @heroicons
│   │   ├── Expand/collapse chevron
│   │   └── ModularLessonCard (for each lesson)
│   │       ├── Lesson Icon (24px) - getLessonIcon()
│   │       ├── Status indicator
│   │       ├── ChevronDown for expand
│   │       └── LessonContent
│   │           └── LessonRenderer
│   │               ├── Section-specific icons
│   │               ├── Callout icons
│   │               ├── Step icons
│   │               └── Heading icons
│   └── Navigation (previous/next guides)
```

---

## Summary: Key Icon Implementations

| Component | Icon Source | Icons Used | Size | Color |
|-----------|-------------|-----------|------|-------|
| CourseCard | @lobehub/icons | Tool icons (Claude, Cursor, etc.) | 56px | Brand colors |
| ModuleSection | @heroicons + @lobehub/icons | Module icons (cog, code, etc.) | 20px | #525252 |
| ModularLessonCard | @heroicons | Lesson + check icons | 24px | Contextual |
| LessonRenderer | @heroicons | Section icons (info, warning, etc.) | 24px | Contextual |
| StatusBadge | Text-based | None | - | Status colors |
| UI Controls | @heroicons | Chevron, arrows, magnifying glass | 16-24px | Contextual |

---

## Files Summary

### Core Components
- `/src/app/guides/page.tsx` - Main guides page
- `/src/app/guides/guides-client.tsx` - Guides listing client
- `/src/app/guides/[slug]/page.tsx` - Guide detail page
- `/src/app/guides/[slug]/guide-client.tsx` - Guide detail client

### UI Components
- `/src/components/ui/CourseCard.tsx` - Guide card with tool icon
- `/src/components/ui/ModuleSection.tsx` - Collapsible module with icon
- `/src/components/ui/ModularLessonCard.tsx` - Lesson card with icon
- `/src/components/ui/LessonRenderer.tsx` - Renders sections with icons
- `/src/components/ui/LessonContent.tsx` - Lesson content wrapper
- `/src/components/ui/StatusBadge.tsx` - Status indicator (text-only)

### Utilities & Data
- `/src/utils/lessonIcons.tsx` - Icon mapping utility
- `/src/data/guides.ts` - All guide and lesson data (46K+ lines)
- `/src/types/index.ts` - Guide, GuideLesson, Course types
- `/src/types/lesson.ts` - Lesson section and icon types

