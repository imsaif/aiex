'use client';

import { useEffect, useMemo, useState } from 'react';
import { DWIC_ARTICLES, DWIC_IMAGES, altText, encodeOverrides, mergeText, type DwicImageId, type DwicText } from '@/lib/social/dwic';

/**
 * Social assets for a designwithclaude.com article: a LinkedIn link card, a four-slide
 * carousel and the post text. Every line starts as the hand-written default in
 * lib/social/dwic.ts and can be edited here; edits are kept in this browser per article.
 */

// Which fields belong to which image, in the order the admin edits them.
const FIELDS: { image: DwicImageId | 'post'; title: string; keys: (keyof DwicText)[] }[] = [
  { image: 'post', title: 'LinkedIn post text', keys: ['post'] },
  { image: 'card', title: 'Link card', keys: ['cardTitle', 'cardBody'] },
  { image: '1', title: 'Slide 1 · cover', keys: ['coverLabel', 'coverTitle', 'coverBody'] },
  {
    image: '2',
    title: 'Slide 2 · code as claims',
    keys: ['pointsLabel', 'pointsTitle', 'point1Code', 'point1Claim', 'point2Code', 'point2Claim', 'point3Code', 'point3Claim'],
  },
  {
    image: '3',
    title: 'Slide 3 · three questions',
    keys: ['stepsLabel', 'stepsTitle', 'step1Answer', 'step1Question', 'step2Answer', 'step2Question', 'step3Answer', 'step3Question', 'step4Answer', 'stepsNote'],
  },
  { image: '4', title: 'Slide 4 · link', keys: ['linkTitle', 'linkBody', 'linkUrl'] },
];

const storageKey = (slug: string) => `dwic-social-edits:${slug}`;

function loadEdits(slug: string): Partial<DwicText> {
  try {
    return JSON.parse(localStorage.getItem(storageKey(slug)) || '{}');
  } catch {
    return {};
  }
}

export default function DwicPanel({ onCopied }: { onCopied: (text: string) => void }) {
  const [slug, setSlug] = useState(DWIC_ARTICLES[0].slug);
  const article = DWIC_ARTICLES.find((a) => a.slug === slug) ?? DWIC_ARTICLES[0];
  const [edits, setEdits] = useState<Partial<DwicText>>({});
  // The images only re-render once typing pauses.
  const [settled, setSettled] = useState<Partial<DwicText>>({});

  useEffect(() => {
    const saved = loadEdits(slug);
    setEdits(saved);
    setSettled(saved);
  }, [slug]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSettled(edits);
      try {
        localStorage.setItem(storageKey(slug), JSON.stringify(edits));
      } catch {
        /* storage blocked: edits still work for this visit */
      }
    }, 600);
    return () => clearTimeout(id);
  }, [edits, slug]);

  const text = useMemo(() => mergeText(article.text, edits), [article, edits]);
  const settledText = useMemo(() => mergeText(article.text, settled), [article, settled]);
  const t = Object.keys(settled).length ? `&t=${encodeOverrides(settled)}` : '';
  const src = (id: DwicImageId) => `/api/social/dwic?article=${slug}&n=${id}${t}`;
  const fileName = (id: DwicImageId) => `dwic-${slug}-${id}.png`;

  const set = (key: keyof DwicText, value: string) =>
    setEdits((prev) => {
      const next = { ...prev };
      if (value === article.text[key]) delete next[key];
      else next[key] = value;
      return next;
    });

  const download = async (id: DwicImageId) => {
    const blob = await fetch(src(id)).then((r) => r.blob());
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName(id);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const copy = (value: string, message: string) => {
    navigator.clipboard.writeText(value);
    onCopied(message);
  };

  const edited = Object.keys(edits).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Article
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="px-3 py-2 rounded-md border border-border-primary bg-surface-primary text-text-primary"
          >
            {DWIC_ARTICLES.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>
        </label>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-primary underline pb-2">
          Open the article
        </a>
        {edited > 0 && (
          <button
            onClick={() => setEdits({})}
            className="ml-auto px-3 py-1.5 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
          >
            Reset {edited} edited {edited === 1 ? 'field' : 'fields'}
          </button>
        )}
      </div>

      {FIELDS.map((group) => (
        <section key={group.title} className="bg-surface-primary rounded-lg border border-border-primary p-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 min-w-0">
            <p className="text-sm font-medium text-text-primary">{group.title}</p>
            {group.keys.map((key) => (
              <label key={key} className="flex flex-col gap-1 text-sm text-text-secondary">
                <span>
                  {key}
                  {key in edits && <span className="ml-2 text-accent-primary">edited</span>}
                </span>
                <textarea
                  id={`dwic-${slug}-${key}`}
                  value={text[key]}
                  onChange={(e) => set(key, e.target.value)}
                  rows={key === 'post' ? 12 : Math.min(4, Math.ceil(text[key].length / 60) || 1)}
                  className="w-full px-3 py-2 rounded-md border border-border-primary bg-background-primary text-text-primary font-[inherit]"
                />
              </label>
            ))}
            {group.image === 'post' && (
              <button
                onClick={() => copy(text.post, 'Post text copied')}
                className="self-start px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-sm font-medium"
              >
                Copy post text
              </button>
            )}
          </div>

          {group.image !== 'post' && (
            <figure className="flex flex-col gap-2 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(group.image)}
                alt={altText(group.image, settledText)}
                className={`w-full rounded-md border border-border-primary ${group.image === 'card' ? 'aspect-[1200/627]' : 'aspect-[4/5] max-w-[420px]'}`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => download(group.image as DwicImageId)}
                  className="px-2 py-1 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => copy(altText(group.image as DwicImageId, text), 'Alt text copied')}
                  className="px-2 py-1 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
                >
                  Copy alt text
                </button>
              </div>
            </figure>
          )}
        </section>
      ))}

      <button
        onClick={async () => {
          for (const img of DWIC_IMAGES) await download(img.id);
        }}
        className="self-start px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-sm font-medium"
      >
        Download all 5 images
      </button>
    </div>
  );
}
