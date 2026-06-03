// Reads INTERVIEW_PREP.md, produces INTERVIEW_PREP.html with embedded styling.
// Run: node scripts/build-interview-prep.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const md = readFileSync(resolve(ROOT, 'INTERVIEW_PREP.md'), 'utf8')

const renderer = new marked.Renderer()

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const headings = []

renderer.heading = ({ tokens, depth }) => {
  const text = tokens.map((t) => t.raw ?? t.text ?? '').join('')
  const plain = text.replace(/[*_`]/g, '')
  const id = slugify(plain)
  if (depth <= 3) headings.push({ id, text: plain, depth })
  const inner = marked.parseInline(text)
  return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-label="Link to ${plain}">#</a>${inner}</h${depth}>\n`
}

renderer.code = ({ text, lang }) => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const cls = lang ? ` class="lang-${lang}"` : ''
  return `<pre${cls}><code${cls}>${escaped}</code></pre>\n`
}

const html = marked.parse(md, { renderer, gfm: true, breaks: false })

const tocItems = headings
  .map((h) => `<li class="toc-d${h.depth}"><a href="#${h.id}">${h.text}</a></li>`)
  .join('\n')

const css = `
:root {
  --bg: #FAFAF7;
  --surface: #FFFFFF;
  --surface-alt: #F4F4EF;
  --text: #14181F;
  --text-secondary: #4A5260;
  --text-tertiary: #6B7280;
  --border: #E5E5DC;
  --border-strong: #D4D4C4;
  --accent: #2E6F40;
  --accent-soft: #E8F1EB;
  --warning: #B45309;
  --warning-soft: #FEF3C7;
  --danger: #B91C1C;
  --danger-soft: #FEE2E2;
  --code-bg: #F4F4EF;
  --code-border: #E5E5DC;
  --max-content: 68ch;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0F1419;
    --surface: #161B22;
    --surface-alt: #1C2330;
    --text: #E8E8E0;
    --text-secondary: #B8BCC4;
    --text-tertiary: #8B9098;
    --border: #2A3441;
    --border-strong: #3A4655;
    --accent: #7FB996;
    --accent-soft: rgba(127, 185, 150, 0.12);
    --warning: #F59E0B;
    --warning-soft: rgba(245, 158, 11, 0.12);
    --danger: #F87171;
    --danger-soft: rgba(248, 113, 113, 0.12);
    --code-bg: #1C2330;
    --code-border: #2A3441;
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 1.5rem; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Satoshi", "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  max-width: 1280px;
  margin: 0 auto;
  gap: 2.5rem;
  padding: 2rem 1.5rem;
}
.toc {
  position: sticky;
  top: 1.5rem;
  align-self: start;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding-right: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.45;
}
.toc-header {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}
.toc ul { list-style: none; padding: 0; margin: 0; }
.toc li { margin: 0.1rem 0; }
.toc a {
  display: block;
  padding: 0.25rem 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all 0.12s ease;
}
.toc a:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-left-color: var(--accent);
}
.toc-d1 > a { font-weight: 600; color: var(--text); margin-top: 0.5rem; }
.toc-d2 > a { padding-left: 1rem; }
.toc-d3 > a { padding-left: 1.75rem; font-size: 0.78rem; color: var(--text-tertiary); }
main {
  max-width: var(--max-content);
  font-size: 1rem;
}
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  scroll-margin-top: 1.5rem;
}
h1 {
  font-size: 2.4rem;
  margin: 0.5rem 0 1.5rem;
  letter-spacing: -0.03em;
}
h2 {
  font-size: 1.7rem;
  margin: 3.5rem 0 1.25rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  letter-spacing: -0.02em;
}
h3 {
  font-size: 1.25rem;
  margin: 2.5rem 0 1rem;
  color: var(--text);
}
h4 {
  font-size: 1.05rem;
  margin: 2rem 0 0.75rem;
  color: var(--accent);
  letter-spacing: 0;
}
.anchor {
  display: inline-block;
  color: var(--text-tertiary);
  text-decoration: none;
  font-weight: 400;
  margin-right: 0.5rem;
  opacity: 0;
  transition: opacity 0.15s ease;
}
h1:hover .anchor, h2:hover .anchor, h3:hover .anchor, h4:hover .anchor { opacity: 0.6; }
.anchor:hover { opacity: 1 !important; color: var(--accent); }
p { margin: 0 0 1rem; }
strong { font-weight: 700; color: var(--text); }
em { font-style: italic; color: var(--text); }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 2px; }
ul, ol { margin: 0 0 1.25rem; padding-left: 1.5rem; }
li { margin: 0.4rem 0; }
li > p { margin: 0.25rem 0; }
hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
}
blockquote {
  border-left: 3px solid var(--accent);
  background: var(--accent-soft);
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0 6px 6px 0;
  color: var(--text-secondary);
}
blockquote p:last-child { margin-bottom: 0; }
code {
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.88em;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 4px;
  padding: 0.1em 0.35em;
  color: var(--text);
}
pre {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.55;
  margin: 1.25rem 0;
}
pre code {
  background: transparent;
  border: 0;
  padding: 0;
  font-size: inherit;
}
table {
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.92rem;
  width: 100%;
}
th, td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
th { background: var(--surface-alt); font-weight: 700; }
/* Callout detection — paragraphs starting with these bold leads get visual treatment */
main p:has(> strong:first-child:nth-last-child(n+1)) { /* baseline */ }
main p strong:first-child:where(:contains("60-second")),
main p strong:first-child:where(:contains("60s")) {
  /* not portable, handled by JS below */
}
.callout {
  display: block;
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent);
  background: var(--accent-soft);
}
.callout-pitch { border-left-color: var(--accent); background: var(--accent-soft); }
.callout-warning { border-left-color: var(--warning); background: var(--warning-soft); }
.callout-danger { border-left-color: var(--danger); background: var(--danger-soft); }
.callout-meta { border-left-color: var(--text-tertiary); background: var(--surface-alt); }
.callout strong:first-child { color: var(--text); }

.toc-toggle {
  display: none;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--accent);
  color: white;
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  z-index: 50;
}

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; padding: 1rem; gap: 0; }
  .toc {
    position: fixed;
    top: 0;
    left: 0;
    width: min(85vw, 320px);
    height: 100vh;
    max-height: none;
    background: var(--surface);
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--border);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 40;
    box-shadow: 4px 0 16px rgba(0,0,0,0.08);
  }
  .toc.open { transform: translateX(0); }
  .toc-toggle { display: block; }
  main { max-width: 100%; padding-bottom: 4rem; }
  h1 { font-size: 1.9rem; }
  h2 { font-size: 1.4rem; }
  h3 { font-size: 1.15rem; }
  body { font-size: 16px; }
}

@media print {
  body { background: white; color: black; font-size: 11pt; }
  .toc, .toc-toggle { display: none !important; }
  .layout { display: block; max-width: none; padding: 0; }
  main { max-width: none; }
  h1, h2, h3 { page-break-after: avoid; }
  pre, blockquote, .callout { page-break-inside: avoid; }
  a { color: black; text-decoration: underline; }
  .anchor { display: none !important; }
  hr { border-top: 1px solid #999; }
}
`

const js = `
// Promote leading-bold paragraphs to callouts when they start with a known cue.
const CUES = [
  { match: /^(60[- ]second pitch|60s|60-second answer)/i, cls: 'callout-pitch' },
  { match: /^(Why this story works|Why this matters)/i, cls: 'callout-pitch' },
  { match: /^(Designer analogy|Designer-readable version|Plain English|Coffee-shop analogy)/i, cls: 'callout-meta' },
  { match: /^(The honest tradeoff|The bug, in slow motion|The fix|The setup|What I was actually building|What actually happened|Total cost\\.|Why I didn'?t\\.|What I actually self-host)/i, cls: 'callout-meta' },
  { match: /^(Meta-lesson|The load-bearing point|The companion meta-lesson)/i, cls: 'callout-warning' },
  { match: /^(The designer-relevant lessons)/i, cls: 'callout-pitch' },
]
document.querySelectorAll('main p').forEach((p) => {
  const strong = p.querySelector(':scope > strong:first-child')
  if (!strong) return
  const txt = strong.textContent.trim()
  for (const { match, cls } of CUES) {
    if (match.test(txt)) {
      p.classList.add('callout', cls)
      return
    }
  }
})

// Mobile TOC toggle
const toggle = document.querySelector('.toc-toggle')
const toc = document.querySelector('.toc')
if (toggle && toc) {
  toggle.addEventListener('click', () => {
    toc.classList.toggle('open')
    toggle.textContent = toc.classList.contains('open') ? 'Close' : 'Contents'
  })
  toc.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') toc.classList.remove('open')
  })
}

// Highlight current section in TOC on scroll
const tocLinks = new Map()
document.querySelectorAll('.toc a').forEach((a) => {
  const id = a.getAttribute('href').slice(1)
  tocLinks.set(id, a)
})
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = tocLinks.get(entry.target.id)
      if (!link) return
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc a.active').forEach((a) => a.classList.remove('active'))
        link.classList.add('active')
      }
    })
  },
  { rootMargin: '-10% 0px -75% 0px' }
)
document.querySelectorAll('main h1, main h2, main h3').forEach((h) => observer.observe(h))
`

const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Interview Prep — aiex</title>
<meta name="robots" content="noindex, nofollow" />
<style>${css}</style>
</head>
<body>
<div class="layout">
  <aside class="toc" aria-label="Table of contents">
    <p class="toc-header">Contents</p>
    <ul>${tocItems}</ul>
  </aside>
  <main>
${html}
  </main>
</div>
<button class="toc-toggle" type="button" aria-label="Toggle contents">Contents</button>
<script>${js}</script>
</body>
</html>
`

writeFileSync(resolve(ROOT, 'INTERVIEW_PREP.html'), out, 'utf8')
console.log('Wrote INTERVIEW_PREP.html (' + (out.length / 1024).toFixed(1) + ' KB)')
console.log('Headings indexed: ' + headings.length)
