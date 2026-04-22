'use client';

import dynamic from 'next/dynamic';

// Defers loading of chat-previews.tsx (532 lines, Conversational UI-specific)
// until a lesson actually needs it. Most lesson pages never render a preview —
// only 8 `previewId:` usages across all guides — so static-importing this from
// LessonRenderer was shipping the full preview component set on every lesson.
// ssr: false because previews are illustrative demos, not LCP content.
const ChatPreviewResolver = dynamic(
  () =>
    import('./chat-previews').then((m) => ({
      default: function Resolved({ previewId }: { previewId: string }) {
        const Preview = m.getPreviewComponent(previewId);
        return Preview ? <Preview /> : null;
      },
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" />
    ),
  }
);

export function DynamicPreview({ previewId }: { previewId: string }) {
  return <ChatPreviewResolver previewId={previewId} />;
}
