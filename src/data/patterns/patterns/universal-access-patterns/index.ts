import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const universalaccesspatterns: Pattern = {
  id: "universal-access-patterns",
  title: "Universal Access Patterns",
  slug: "universal-access-patterns",
  status: 'implemented',
  description: "Ensure equitable access for all abilities, languages, and assistive technologies.",
  category: "Accessibility & Inclusion",
  tags: ["accessibility", "inclusion", "multimodal", "assistive technology", "language", "diversity"],
  thumbnail: "/images/examples/copilotaccessibility.gif",
  introduction: "Universal Access Patterns ensures equitable access for all users regardless of ability, language, or expertise. Instead of designing for a narrow demographic, the system supports multiple interaction modes, assistive technologies, and multilingual support. It's critical for public-facing services, educational tools, or platforms committed to inclusivity. Examples include GitHub Copilot's screen reader support, Google Translate serving 100+ languages, or Be My Eyes assisting visually impaired users.",
  datePublished: "2024-11-07",
  dateModified: "2025-11-18",
  content: {
    problem: "Many AI interfaces are designed for able-bodied, literate users with specific language backgrounds, creating barriers for users with disabilities, different language needs, or varying levels of technical expertise. This excludes large populations from benefiting from AI capabilities.",
    solution: "Design AI systems that support multiple interaction modalities (voice, text, gesture, visual), integrate seamlessly with assistive technologies, provide multilingual support, and offer adjustable complexity levels. Ensure equitable access for all users regardless of ability, language, or expertise.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Multimodal Interaction",
      "Adaptive Interfaces",
      "Conversational UI"
    ],
    codeExamples,
    figmaPrompt: {
      prompt: `Design an accessible AI interface that ensures equitable access for all users regardless of ability, language, or expertise level. Create a comprehensive interface with these inclusive features:

**Multi-Modal Input Options:**
- Multiple ways to interact with the AI: text input, voice input (microphone icon), image upload, and keyboard shortcuts
- Clear visual indicators showing which input modes are active
- Easy toggle between input methods without losing context
- Large touch targets (minimum 44x44pt) for motor accessibility

**Accessibility Controls:**
- Prominent accessibility settings button in the header/navigation
- Settings panel with these options:
  • Text size controls (Small, Medium, Large, Extra Large) with live preview
  • High contrast mode toggle
  • Reduce motion toggle for users sensitive to animations
  • Screen reader optimization mode
  • Keyboard navigation mode with visible focus indicators
- Visual and audio feedback for all interactions

**Language & Localization:**
- Language selector with flag icons and language names in native script
- Support indicator showing "Available in 100+ languages"
- Right-to-left (RTL) layout support preview
- Translation quality indicator for AI responses

**Assistive Technology Integration:**
- Clear ARIA labels visible in a secondary view
- Skip navigation links for keyboard users
- Alt text indicators showing all images have descriptions
- Captions toggle for any audio/video content
- Semantic heading structure visualization (H1, H2, H3 hierarchy)

**Complexity Adjustment:**
- "Simplify Interface" toggle that removes advanced features
- Beginner/Intermediate/Advanced mode selector
- Tooltips and help text that can be toggled on/off
- Progressive disclosure of complex features

**Visual Design Standards:**
- WCAG AAA color contrast ratios (minimum 7:1 for text)
- Clear focus states with 3px blue outline
- No color-only indicators (always paired with icons or text)
- Resizable text without breaking layout (up to 200%)
- Generous spacing and padding for easy targeting

**Status & Feedback:**
- Clear loading states with descriptive text, not just spinners
- Error messages that explain what happened and how to fix it
- Success confirmations with both visual and text indicators
- Progress indicators for long-running tasks

Include an "Accessibility Score" badge showing compliance level (A, AA, AAA) and a "Test with Assistive Tech" preview mode. Use inclusive iconography and avoid cultural assumptions.`,
      tips: [
        "Add dyslexia-friendly font option (OpenDyslexic or similar)",
        "Include cognitive accessibility features like simplified language mode",
        "Add haptic feedback options for mobile devices",
        "Include audio descriptions for visual AI outputs (charts, images)",
        "Add custom keyboard shortcut configuration",
        "Include sign language video support for important instructions",
        "Add color blindness simulation preview modes",
        "Include reading level indicator for AI-generated text"
      ]
    }
  }
};
