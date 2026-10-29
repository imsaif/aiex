import type { LessonSection } from '@/types/lesson';

/**
 * A course's companion study: the real piece of work a course was built from,
 * told as one article. It lives inside the course (its own URL under the
 * course, the course rail open beside it) but is not a lesson, so it does not
 * change the lesson count, the course title or any lesson URL.
 *
 * First-person lines are Imran's own answers (2026-10-28). Everything else
 * reports what the study did and measured; numbers are from the study files
 * in ~/Desktop/evals-study and match the figures in the course.
 */
export interface CourseStudy {
  courseSlug: string;
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  sections: LessonSection[];
}

const IMG = '/images/guides/ai-evals-for-designers';

export const courseStudies: CourseStudy[] = [
  {
    courseSlug: 'ai-evals-for-designers',
    slug: 'the-study',
    title: 'The Study Behind This Course: Running an Eval on an AI Audit Tool',
    description:
      'A designer runs a real eval on an AI audit tool: 41 screenshots reviewed by hand, the failures sorted, an AI reviewer checked against human verdicts, two fixes measured, and what the numbers said.',
    publishedDate: '2026-10-28',
    sections: [
      {
        type: 'intro',
        content:
          'This course was written from one real eval, run on the AI audit tool on this site. The tool looks at a screenshot of an AI product and lists the design patterns it is missing. This page is the study itself: what was tested, what broke, what the fixes changed, and what is still wrong.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'Why run it',
      },
      {
        type: 'text',
        content:
          'I wanted to see what I could learn about evals as a designer, and I wanted to test the tool extensively rather than trust a handful of good-looking audits.\n\nThe method follows Hamel Husain and Shreya Shankar\'s evals FAQ, done by hand where possible, with engineering help only for saving the data, running the tool at scale and wiring up the AI reviewer. The whole study cost about $30 in model calls.',
      },
      {
        type: 'image',
        src: `${IMG}/eval-loop.webp`,
        alt: 'A diagram of eleven numbered steps in four phases: look, sort, automate, fix. Each step has the engineering term beside it.',
        label: 'The loop the study followed. Solid boxes are steps a designer or PM can own; dashed boxes needed an engineer.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'Step one: read every answer yourself',
      },
      {
        type: 'text',
        content:
          'The tool was run on 41 real screenshots, deliberately including messy ones: pricing pages, login screens, legal text, dashboards with no AI in them at all. I gave each audit one verdict, pass or fail, against a single question: **would you be happy if a real user got this audit?** Every fail got one plain line naming the first thing wrong. No categories yet.\n\nAn AI, acting as a second reviewer, judged the same 41 independently. We agreed on 28, and I made the final call on the rest. Each of us caught a different kind of mistake, which is the point of a second opinion: it shows where your own standard is vague.',
      },
      {
        type: 'image',
        src: `${IMG}/review-page.webp`,
        alt: 'The review screen: a ChatGPT screenshot on the left, the audit on the right, and Pass and Fail buttons with a notes box at the bottom.',
        label: 'The review screen built for the study. One audit at a time, one question, pass or fail plus a note.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'What the notes said',
      },
      {
        type: 'text',
        content:
          'Grouped like an affinity map, the notes fell into six kinds of failure. Two tied for biggest, at 7 failed audits each. One was the tool **reporting things a screenshot cannot show as if it had seen them**: hover states, what sits below the scroll, whether undo exists, what happens on click. A screenshot is one frame, so advice about the rest is a guess. The other was **asking for confidence scores on ordinary chat replies**, where nothing was being researched and certainty would not change what the user did next.\n\nThe first became the written standard: every piece of advice is either **seen** (it points at something on the screen) or **assumed** (it depends on something the screen cannot show). Of 116 pieces of advice, 93 were assumed.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'Checking the AI reviewer before trusting it',
      },
      {
        type: 'text',
        content:
          'Labelling 116 pieces of advice by hand every time the tool changes does not scale, so an AI reviewer was briefed to apply the seen-or-assumed rule. Before trusting it, its verdicts were compared with the human ones. Half the advice was used to tune its brief; the other half was held back and scored once, with no edits.\n\nOn the tuning half it caught 45 of 50 problems. On the held-back half, the honest number, it caught 41 of 44 and raised 5 false alarms in 11 clean cases. Good enough to count with, as long as someone still skims what it flags.',
      },
      {
        type: 'image',
        src: `${IMG}/dev-test-split.webp`,
        alt: 'A diagram: 116 labelled pieces of advice split into a tuning half and a held-back half. The tuned reviewer looks better than it is; the frozen reviewer on the held-back half gives the honest number.',
        label: 'Tune on one half, test once on the other. The held-back score is the one to believe.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'Two fixes, measured',
      },
      {
        type: 'text',
        content:
          'The first fix told the tool to stop guessing. Assumed advice went from 93 to 86, and two audits broke outright. The second fix gave the guesses somewhere to go: a separate **Worth checking** list of questions for the designer to answer, kept apart from the gaps the tool can actually see. Assumed advice went from 93 to 73, and honest gaps grew from 23 to 34.',
      },
      {
        type: 'image',
        src: `${IMG}/did-the-fix-work.webp`,
        alt: 'A loop: fix the product, re-run the same 41, the AI reviewer counts with the same frozen brief, did the number move? If yes, a human skims for new breakage then ships; if no, find out why and fix again.',
        label: 'The regression check run after each fix, with the same examples and the same frozen reviewer.',
      },
      {
        type: 'text',
        content:
          'Then the fix was tested on 19 screenshots it had never seen. The drop was smaller there: from 92% assumed to 88%. Part of the improvement only suited the examples it had been tuned on. Without the fresh set, that would have shipped as a bigger win than it was.',
      },
      {
        type: 'image',
        src: `${IMG}/study-before-after.svg`,
        alt: 'Bar chart. Share of advice that guessed: on the 41 tuned screens, 80% before and 68% after the fix. On 19 fresh screens, 92% before and 88% after.',
        label: 'Before and after, on the screens the fix was tuned on and on screens it never saw.',
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'Smaller findings',
      },
      {
        type: 'table',
        rows: [
          {
            label: 'A vague rule, made exact',
            content:
              'The tool kept asking ordinary chat replies for confidence scores. Narrowing the rule to "only where the AI outputs a score, prediction or classification" took those wrong flags from 8 to 0.',
          },
          {
            label: 'A fix that hurt',
            content:
              'A rule to spot marketing images and skip them also skipped real product screens. It was reverted. Without re-running the full set, it would have looked like a fix.',
          },
          {
            label: 'Broken output',
            content:
              'Some audits failed because the model wrote invalid JSON. That was fixed in the code that reads it, and the final run had 0 broken audits.',
          },
          {
            label: 'Still wrong',
            content:
              'After both fixes, a human review passed 33 of the 41 audits and failed 8. One site, Our World in Data, got worse and is logged to fix next.',
          },
        ],
      },
      {
        type: 'heading',
        level: 'h2',
        content: 'What I learned',
      },
      {
        type: 'text',
        content:
          'By running evals I knew where my product stands, where it fails and where it needs improvement. Those are things I only knew after conducting the evals.\n\nMy advice to other designers: learn how to conduct evals and understand the topic, as part of your research and of thinking through your approach to the product\'s design.',
      },
      {
        type: 'callout',
        calloutType: 'tip',
        title: 'Run your own',
        content:
          'The five lessons of this course walk through the same loop on your own product, from picking examples to checking that a fix worked.',
      },
      {
        type: 'further-reading',
        title: 'Keep going',
        links: [
          {
            title: 'AI Evals: Everything You Need to Know',
            url: 'https://hamel.dev/blog/posts/evals-faq/',
            source: 'Hamel Husain and Shreya Shankar',
            description: 'The evals FAQ this study followed.',
          },
          {
            title: 'AI Evals for Designers: Quick Checklist',
            url: '/ai-evals-checklist',
            source: 'aiuxdesign.guide',
            description: 'The same method as five steps you can run in about two hours, with a review sheet.',
          },
          {
            title: 'Run the AI UX audit tool',
            url: '/audit',
            source: 'aiuxdesign.guide',
            description: 'The tool this study evaluated, with the Worth checking list the fixes added.',
          },
        ],
      },
    ],
  },
];

export function getCourseStudy(courseSlug: string, slug: string): CourseStudy | undefined {
  return courseStudies.find((s) => s.courseSlug === courseSlug && s.slug === slug);
}

export function getStudiesForCourse(courseSlug: string): CourseStudy[] {
  return courseStudies.filter((s) => s.courseSlug === courseSlug);
}
