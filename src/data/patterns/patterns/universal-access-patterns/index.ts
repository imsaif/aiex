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
  dateModified: "2026-06-23",
  hideFAQ: true,
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
    },
    judgmentCall: {
      explainWhen: [
        "Real assistive-tech users are in scope: screen readers, switch access, voice control, magnification. If you can name the AT and the task, you can test it.",
        "The interface is the only way in. Public services, healthcare, banking, education, and government tools where being locked out has real consequences, not just annoyance.",
        "AI is adding new output forms (generated charts, transcripts, voice, streaming text) that older accessibility work never covered, so the surface needs fresh coverage."
      ],
      dontWhen: [
        "You are bolting on a third-party overlay widget to dodge the work. A floating accessibility button does not fix a broken DOM, it hides that you never fixed it.",
        "You are chasing a WCAG checkbox instead of a task an actual AT user can finish. Conformance is a floor, not a finish line, and passing an automated scanner is not the same as being usable.",
        "You would ship a separate 'accessible version' that lags the real product. A second-class lane drifts out of date the moment the main UI changes, and now you maintain two broken things."
      ],
      trap: "The compliance overlay: a bolt-on widget or a one-time audit badge that performs accessibility while the underlying flow stays broken for the people it claims to serve. A screen-reader user still hits an unlabeled button, the keyboard trap is still there, the generated chart still has no text alternative, but there is a badge in the footer and a toolbar in the corner. It is worse than doing nothing, because it converts a fixable gap into a defended one: the team believes the box is checked, the real users are still locked out, and now there is a vendor contract arguing they are not."
    },
    installPrompt: `You are implementing the Universal Access Patterns design pattern in this codebase.

The pattern in one line: make every AI surface usable by real assistive-tech users completing real tasks, not just compliant with a checklist.

Apply the following moves wherever this codebase renders an AI interaction (chat, generated output, controls, status, media). DO NOT add a third-party accessibility overlay widget, a footer compliance badge, or a separate "accessible version" of any page. Those perform access instead of providing it, and they are out of scope here.

1. Name the user and the task before you touch markup.
   For each AI surface, write down the assistive technology in scope (screen reader, keyboard-only, switch, voice control, magnification) and the one task that user must finish. If you cannot name a task, flag the surface. Do not add ARIA to decoration.

2. Fix the DOM, not the perception of it.
   Replace div-soup controls with real semantic elements (button, label, fieldset, nav, headings in order). Every interactive element needs a name, role, and state reachable by keyboard. Remove keyboard traps. Do not paper over a broken control with aria-label on a div.

3. Give every non-text AI output a text path.
   Generated charts, images, audio, and streaming responses each need a real text alternative or transcript that conveys the same information, not "AI-generated image". For live regions, announce status changes (thinking, streaming, done) with aria-live set to the right politeness.

4. Make the real product the accessible product.
   Any complexity toggle, simplified mode, or language switch must operate on the same DOM and stay in sync with the main UI. No forked "accessible" route. If a feature only works in one mode, that is a bug to fix, not a mode to ship.

5. Prove it with the actual AT, then automate the floor.
   Verify each task end to end with a screen reader and keyboard before calling it done. Wire automated checks (axe, lint) as a regression floor only. A green scanner is necessary, never sufficient.

The trap to avoid: the compliance overlay. A badge or a bolt-on widget that signals accessibility while the underlying flow stays broken is worse than an honest gap, because it convinces the team the work is done. If you cannot complete the task with a screen reader, the surface is not accessible, whatever the scanner says.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. decorative, no AT user task, blocked on a real text alternative for a generated output)
- New semantic structure, live regions, text alternatives, or automated checks you added, and which tasks still need a human AT pass to sign off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Name the user and the task, not the standard.",
        body: "WCAG AA is a floor, not a goal. The real question is whether a screen-reader user can finish the checkout, whether a keyboard-only user can send the message. If you cannot name the assistive technology and the task, you are decorating markup, not providing access."
      },
      {
        heading: "An overlay is not access. It is a costume.",
        body: "A floating accessibility widget and a footer badge do not fix an unlabeled button or a keyboard trap. They hide that you never did. The bolt-on overlay is worse than an honest gap because it convinces the team the work is finished while the real users are still locked out."
      },
      {
        heading: "Give every AI output a text path.",
        body: "AI introduces new ways to lock people out: generated charts with no alt, audio with no transcript, streaming text that screen readers never announce. Every non-text output needs a real text alternative that carries the same information, and live status needs an aria-live region, not silence."
      },
      {
        heading: "One product, not a second-class lane.",
        body: "A separate 'accessible version' drifts out of date the moment the main UI ships a change, and now you maintain two broken things. Build complexity toggles and language switches on the same DOM so access stays in sync with the product people actually use."
      },
      {
        heading: "A green scanner is necessary, never sufficient.",
        body: "Automated checks catch missing alt text and contrast failures, which is the floor. They cannot tell you the focus order is nonsense or the label lies. Test the task end to end with a real screen reader and keyboard before you call it accessible."
      }
    ]
  }
};
