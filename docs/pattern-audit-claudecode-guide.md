# Pattern Audit Tool - Claude Code Implementation Guide

## Project Overview
Build an AI UX Pattern Audit tool that analyzes design screenshots to detect which of 24 AI UX patterns are present, missing, or poorly implemented. The tool provides personalized recommendations based on the user's specific AI product type and concerns.

**Live at:** aiuxdesign.guide/audit (replacing current /prompt-builder)

## Tech Stack
- **Framework:** Next.js 15.3.0 (already in use)
- **Language:** TypeScript
- **Styling:** TailwindCSS (already configured)
- **AI Vision:** Claude 3 Opus/Sonnet or GPT-4 Vision API
- **Database:** None for MVP (use localStorage for session data)
- **Analytics:** Existing Vercel Analytics

## Project Structure
```
src/
├── app/
│   ├── audit/                         # New Pattern Audit feature
│   │   ├── page.tsx                   # Landing page
│   │   ├── context/page.tsx          # Context questions
│   │   ├── upload/page.tsx           # Upload interface
│   │   ├── analyze/page.tsx          # Analysis progress
│   │   └── results/[id]/page.tsx     # Results display
│   ├── api/
│   │   ├── analyze-pattern/          # Pattern detection endpoint
│   │   │   └── route.ts
│   │   └── generate-implementation/  # Implementation guide endpoint
│   │       └── route.ts
├── components/
│   ├── audit/                        # Audit-specific components
│   │   ├── ContextForm.tsx          # Context questions form
│   │   ├── UploadZone.tsx           # Drag-drop upload
│   │   ├── AnalysisProgress.tsx     # Loading state
│   │   ├── PatternCard.tsx          # Individual pattern result
│   │   ├── PatternScore.tsx         # Score visualization
│   │   ├── ImplementationModal.tsx  # Implementation guide
│   │   └── ExportOptions.tsx        # Export functionality
├── lib/
│   ├── patterns/
│   │   ├── definitions.ts           # 24 pattern definitions
│   │   ├── detection-prompts.ts     # AI prompts for detection
│   │   └── weights.ts               # Context-based weights
│   └── audit/
│       ├── analyzer.ts              # Core analysis logic
│       ├── context-processor.ts     # Context handling
│       └── report-generator.ts      # Generate results
├── types/
│   └── audit.ts                     # TypeScript interfaces
└── data/
    └── patterns.json                 # Pattern data (reuse existing)
```

## Phase 1: MVP Implementation (Week 1)

### Step 1: Create Landing Page
```typescript
// src/app/audit/page.tsx
// INSTRUCTION: Create a landing page that explains the value and has a "Start Free Audit" button
// Include:
// - Hero section with value proposition
// - How it works (3 steps)
// - Example results preview
// - CTA button that routes to /audit/context

export default function AuditLandingPage() {
  // Landing page with:
  // 1. Headline: "AI UX Pattern Audit"
  // 2. Subheadline: "Discover which essential AI patterns your interface is missing in 60 seconds"
  // 3. Three value props: Detect Patterns, Get Priorities, Implementation Guides
  // 4. Big CTA button: "Start Free Audit →"
  // 5. How it works section
  // 6. Example audit results preview
}
```

### Step 2: Context Collection Form
```typescript
// src/app/audit/context/page.tsx
// INSTRUCTION: Create a form with 3 required questions and optional advanced settings

interface ContextData {
  interfaceType: 'chatbot' | 'content' | 'code' | 'image' | 'analytics' | 'other';
  userGoal: string;
  mainConcern: 'trust' | 'errors' | 'usability' | 'blackbox' | 'consistency';
  industry?: string;
  stage?: 'concept' | 'beta' | 'production' | 'scaling';
}

export default function ContextForm() {
  // Form with:
  // 1. Progress bar showing step 1 of 3
  // 2. Question 1: Interface type (6 card options with icons)
  // 3. Question 2: Primary user goal (dropdown)
  // 4. Question 3: Biggest concern (radio buttons with descriptions)
  // 5. Optional: Industry and stage (collapsible section)
  // 6. Continue button → saves to sessionStorage and routes to /audit/upload
  // 7. Skip link (proceeds with generic analysis)
}
```

### Step 3: Upload Interface
```typescript
// src/app/audit/upload/page.tsx  
// INSTRUCTION: Create upload interface that accepts images and shows context summary

export default function UploadPage() {
  // Get context from sessionStorage
  // Show:
  // 1. Progress bar (step 2 of 3)
  // 2. Context summary banner ("Analyzing for: [type]")
  // 3. Drag-drop upload zone (use react-dropzone)
  // 4. Accept: image/png, image/jpeg, image/webp
  // 5. Max size: 10MB
  // 6. Example designs based on context (4 options)
  // 7. On upload: Convert to base64, route to /audit/analyze
}
```

### Step 4: Analysis API Endpoint
```typescript
// src/app/api/analyze-pattern/route.ts
// INSTRUCTION: Create API endpoint that sends image to Claude/GPT-4 Vision

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  const { imageBase64, context } = await request.json();
  
  // Build prompt based on context
  const prompt = buildContextAwarePrompt(context);
  
  // Call Claude Vision API
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }},
        { type: 'text', text: prompt }
      ]
    }]
  });
  
  // Parse response and return pattern detection results
  return NextResponse.json({
    detectedPatterns: parsePatternResults(response),
    score: calculateScore(response),
    recommendations: generateRecommendations(response, context)
  });
}
```

### Step 5: Pattern Detection Prompt
```typescript
// src/lib/patterns/detection-prompts.ts
// INSTRUCTION: Create the prompt template for pattern detection

export function buildContextAwarePrompt(context: ContextData): string {
  return `
    Analyze this ${context.interfaceType} interface for AI UX patterns.
    User's main concern: ${context.mainConcern}
    
    Check for these 24 patterns and rate each as:
    - "well-implemented" (clearly present and effective)
    - "weak" (present but needs improvement) 
    - "missing" (not found or critically lacking)
    
    Patterns to check:
    1. Progressive Disclosure - Information revealed gradually
    2. Contextual Assistance - Help relevant to current task
    3. Error Prevention - AI prevents mistakes before they happen
    [... list all 24 patterns with descriptions ...]
    
    For ${context.interfaceType} interfaces, prioritize:
    ${getContextSpecificPriorities(context)}
    
    Return a JSON object with:
    {
      "patterns": {
        "progressive-disclosure": {
          "status": "well-implemented|weak|missing",
          "evidence": "what you observed",
          "priority": "high|medium|low" (based on context),
          "improvement": "specific suggestion if weak/missing"
        },
        // ... for each pattern
      },
      "summary": "one paragraph summary",
      "criticalMissing": ["list of critical patterns for this type"]
    }
  `;
}
```

### Step 6: Results Display
```typescript
// src/app/audit/results/[id]/page.tsx
// INSTRUCTION: Display analysis results with filtering and actions

export default function ResultsPage({ params }: { params: { id: string } }) {
  // Load results from sessionStorage using ID
  
  // Display:
  // 1. Score card (X/24 patterns detected)
  // 2. Context-specific alert banner (if critical patterns missing)
  // 3. Priority recommendations based on user's concern
  // 4. Filter sidebar (All/Well Implemented/Weak/Missing)
  // 5. Pattern cards with:
  //    - Status badge (color-coded)
  //    - Why it matters for their specific tool type
  //    - Visual before/after preview
  //    - Action buttons (See Implementation, Learn More)
  // 6. Export options (PDF, Figma, Share Link, JSON)
}
```

### Step 7: Pattern Card Component
```typescript
// src/components/audit/PatternCard.tsx
// INSTRUCTION: Create reusable pattern card component

interface PatternCardProps {
  pattern: {
    id: string;
    name: string;
    status: 'well-implemented' | 'weak' | 'missing';
    evidence: string;
    priority: 'high' | 'medium' | 'low';
    improvement?: string;
  };
  context: ContextData;
  onImplementationClick: () => void;
}

export function PatternCard({ pattern, context, onImplementationClick }: PatternCardProps) {
  // Render card with:
  // 1. Status-based border color (green/yellow/red)
  // 2. Pattern name and icon
  // 3. Status badge
  // 4. Context-specific description (why it matters for their tool)
  // 5. Visual comparison (current vs improved)
  // 6. Quick fix suggestion (if missing/weak)
  // 7. Action buttons
}
```

## Phase 2: Enhanced Features (Week 2)

### Implementation Guide Modal
```typescript
// src/components/audit/ImplementationModal.tsx
// INSTRUCTION: Create modal that shows implementation details

export function ImplementationModal({ pattern, context }) {
  // Show:
  // 1. Why this pattern matters for [context.interfaceType]
  // 2. Quick implementation code (React/Vue/vanilla)
  // 3. Figma component download
  // 4. Real examples from similar tools
  // 5. Prompt template for AI
  // 6. Expected impact metrics
}
```

### Visual Overlay Generator
```typescript
// src/lib/audit/overlay-generator.ts
// INSTRUCTION: Generate visual overlays showing where patterns could be applied

export function generatePatternOverlay(
  originalImage: string,
  pattern: string,
  boundingBoxes?: BoundingBox[]
): string {
  // Use Canvas API to:
  // 1. Load original image
  // 2. Add semi-transparent overlays
  // 3. Add arrows and labels
  // 4. Return as base64 image
}
```

## Environment Variables
```env
# .env.local
ANTHROPIC_API_KEY=your_claude_api_key_here
# Or use OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

## State Management Strategy
For MVP, use React Context + sessionStorage:

```typescript
// src/contexts/AuditContext.tsx
interface AuditState {
  context: ContextData | null;
  uploadedImage: string | null;
  analysisResults: AnalysisResults | null;
  currentStep: 'landing' | 'context' | 'upload' | 'analyzing' | 'results';
}

// Store in sessionStorage to persist across page refreshes
// Generate unique session ID for results sharing
```

## API Cost Optimization
```typescript
// IMPORTANT: Optimize API costs
// 1. Use Claude Sonnet ($0.003/image) for development
// 2. Switch to Opus ($0.015/image) for production
// 3. Cache results for 24 hours for same image
// 4. Implement rate limiting (10 analyses per IP per hour)
// 5. Consider adding auth for heavy users
```

## Error Handling
```typescript
// Key error scenarios to handle:
// 1. Image too large (>10MB) - Show error before upload
// 2. Invalid image format - Client-side validation
// 3. API timeout - Retry with exponential backoff
// 4. API error - Show friendly message with retry option
// 5. No patterns detected - Show helpful message
```

## Testing Strategy
```typescript
// Test with these images:
// 1. ChatGPT interface - Should detect conversational patterns
// 2. Midjourney - Should detect creative AI patterns  
// 3. GitHub Copilot - Should detect code assistance patterns
// 4. Blank design - Should handle "no patterns found"
// 5. Non-AI interface - Should detect few patterns
```

## Deployment Checklist
```markdown
- [ ] Set up environment variables in Vercel
- [ ] Test with 5 different interface types
- [ ] Add error boundaries to all pages
- [ ] Implement rate limiting
- [ ] Set up monitoring (track API usage)
- [ ] Create redirect from /prompt-builder to /audit
- [ ] Update navigation menu
- [ ] Add Pattern Audit banner to pattern library pages
- [ ] Test mobile responsiveness
- [ ] Optimize images (WebP format)
```

## Success Metrics to Track
```typescript
// Add to your existing analytics:
// 1. Audits started (funnel entry)
// 2. Context form completion rate
// 3. Upload success rate
// 4. Analysis completion rate
// 5. Results viewed > 30 seconds
// 6. Implementation guide clicks
// 7. Export/share actions
// 8. Return visitors
```

## Quick Start Commands
```bash
# Create the audit pages
mkdir -p src/app/audit/{context,upload,analyze,results}

# Install required dependencies (if not already installed)
npm install @anthropic-ai/sdk react-dropzone html2canvas jspdf

# Create API routes
mkdir -p src/app/api/analyze-pattern

# Start development
npm run dev

# Test at http://localhost:3000/audit
```

## MVP Completion Definition
The MVP is complete when:
1. User can complete full flow: Landing → Context → Upload → Results
2. Pattern detection works for at least 3 interface types
3. Results show detected/missing patterns with basic descriptions
4. One pattern has a working implementation guide
5. Results can be shared via URL
6. Mobile responsive

## Common Issues & Solutions

### Issue: "Pattern detection seems inaccurate"
- Refine prompts with more specific visual indicators
- Add example annotations to the prompt
- Test with known interfaces first

### Issue: "API costs too high"
- Use Sonnet instead of Opus
- Implement caching layer
- Add "try example" option that uses pre-analyzed results

### Issue: "Upload fails for large images"
- Resize images client-side before upload (max 2048px)
- Compress using canvas API
- Show progress indicator

## Next Steps After MVP
1. Add Figma plugin for direct import
2. Implement team workspaces
3. Add pattern tracking over time
4. Create API for CI/CD integration
5. Build pattern suggestion engine

---

## Remember
- Start simple: Get basic detection working first
- Test with real designs early
- Focus on value, not features
- Ship weekly iterations
- Get user feedback immediately
