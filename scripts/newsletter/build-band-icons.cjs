#!/usr/bin/env node
/**
 * Builds the daily newsletter's band images: the grid-and-rings motif from the
 * site's pattern cards (src/app/api/og/shared.ts) with ONE Lucide icon per
 * pattern, on brand navy. Output: public/images/newsletter/band/<slug>.{svg,png}.
 *
 * Run from the repo root after changing an icon below or adding a pattern:
 *   node scripts/newsletter/build-band-icons.cjs
 * Then commit the regenerated files. src/lib/newsletter/__tests__/band.test.ts
 * fails if a catalogue pattern has no image.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(__dirname, '../../node_modules/lucide-react/dist/esm/icons');
const OUT_DIR = path.join(__dirname, '../../public/images/newsletter/band');

// Pattern slug → Lucide icon name. One icon that reads as the pattern at a glance.
const ICON_FOR_PATTERN = {
  'action-audit-trail': 'history',
  'adaptive-interfaces': 'layout-dashboard',
  'agent-reflection-learning': 'lightbulb',
  'agent-status-monitoring': 'activity',
  'ambient-intelligence': 'radar',
  'anti-manipulation-safeguards': 'shield-x',
  'augmented-creation': 'wand-sparkles',
  'autonomy-spectrum': 'sliders-horizontal',
  'collaborative-ai': 'users',
  'confidence-visualization': 'gauge',
  'context-switching': 'layers',
  'contextual-assistance': 'message-circle-question',
  'conversational-ui': 'messages-square',
  'crisis-detection-escalation': 'life-buoy',
  'error-recovery': 'rotate-ccw',
  'escalation-pathways': 'hand-helping',
  'explainable-ai': 'search',
  'feedback-loops': 'thumbs-up',
  'graceful-handoff': 'handshake',
  'guided-learning': 'footprints',
  'human-in-the-loop': 'hand',
  'intelligent-caching': 'database-zap',
  'intent-preview': 'eye',
  'mixed-initiative-control': 'arrow-left-right',
  'multimodal-interaction': 'mic',
  'plan-summary': 'list-checks',
  'predictive-anticipation': 'telescope',
  'privacy-first-design': 'lock',
  'progressive-disclosure': 'list-collapse',
  'progressive-enhancement': 'zap',
  'responsible-ai-design': 'scale',
  'safe-exploration': 'flask-conical',
  'selective-memory': 'brain',
  'session-degradation-prevention': 'timer',
  'trust-calibration': 'badge-check',
  'universal-access-patterns': 'accessibility',
  'vulnerable-user-protection': 'heart-handshake',
  'workspace-native-agents': 'panel-right',
};

function iconNode(name) {
  const file = path.join(ICONS_DIR, `${name}.js`);
  if (!fs.existsSync(file)) throw new Error(`missing lucide icon: ${name}`);
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/const __iconNode = (\[[\s\S]*?\]);/) || src.match(/createLucideIcon\("[^"]+", (\[[\s\S]*?\])\);/);
  if (!m) throw new Error(`could not read icon data for ${name}`);
  return Function(`return ${m[1]}`)();
}

function toSvg([tag, attrs]) {
  const a = Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tag} ${a}/>`;
}

function grid() {
  const d = [];
  for (let i = 20; i < 200; i += 20) d.push(`M0 ${i}H200`, `M${i} 0V200`);
  return `<path d="${d.join('')}" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>`;
}

function bandSvg(icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 200 200" fill="none">
<rect width="200" height="200" fill="#162036"/>
${grid()}
<circle cx="100" cy="100" r="92" stroke="#ffffff" stroke-opacity="0.1"/>
<circle cx="100" cy="100" r="66" stroke="#ffffff" stroke-opacity="0.18"/>
<circle cx="100" cy="100" r="40" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.35"/>
<g transform="translate(100 100) scale(1.7) translate(-12 -12)" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none">${iconNode(icon).map(toSvg).join('')}</g>
</svg>
`;
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const f of fs.readdirSync(OUT_DIR)) fs.unlinkSync(path.join(OUT_DIR, f));
  for (const [slug, icon] of Object.entries(ICON_FOR_PATTERN)) {
    const svg = bandSvg(icon);
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(path.join(OUT_DIR, `${slug}.png`));
  }
  console.log(`Built ${Object.keys(ICON_FOR_PATTERN).length} band images in ${path.relative(process.cwd(), OUT_DIR)}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
