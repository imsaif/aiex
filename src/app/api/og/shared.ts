// Shared constants and utilities for OG image generation routes.
// All text colors are WCAG AAA accessible on #0a0a0a.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

export const OG = {
  bg: '#0a0a0a',
  white: '#ffffff',       // 19.4:1 on bg — titles
  secondary: '#d4d4d4',   // 12.1:1 on bg — descriptions
  tertiary: '#b0b0b0',    //  8.5:1 on bg — kickers, footers
  divider: 'rgba(255,255,255,0.15)',
} as const;

// Category icon SVG paths (Lucide-style, 24x24 viewBox, stroke-based)
export const CATEGORY_ICONS: Record<string, string[]> = {
  Brain: [
    'M12 2a4 4 0 0 0-3.2 6.4A4 4 0 0 0 6 12a4 4 0 0 0 2.8 3.6A4 4 0 0 0 12 22a4 4 0 0 0 3.2-6.4A4 4 0 0 0 18 12a4 4 0 0 0-2.8-3.6A4 4 0 0 0 12 2z',
  ],
  Users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 7a4 4 0 1 0 0 0.01',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  Shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  MessageCircle: [
    'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  ],
  Zap: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  Lock: [
    'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z',
    'M7 11V7a5 5 0 0 1 10 0v4',
  ],
  Heart: [
    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  ],
  ShieldAlert: [
    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    'M12 8v4',
    'M12 16h.01',
  ],
  // Guide tool icons
  Terminal: [
    'M4 17l6-6-6-6',
    'M12 19h8',
  ],
  MousePointer: [
    'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z',
    'M13 13l6 6',
  ],
  Code: [
    'M16 18l6-6-6-6',
    'M8 6l-6 6 6 6',
  ],
  GitBranch: [
    'M6 3v12',
    'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M18 9a9 9 0 0 1-9 9',
  ],
};

// Brand logo SVG paths for guides (fill-based, 24x24 viewBox)
// Sourced from self-hosted simple-icons in public/images/logos/simple-icons/
export const GUIDE_BRAND_ICONS: Record<string, { paths: string[]; type: 'fill' | 'stroke' }> = {
  'Claude Code': {
    type: 'fill',
    paths: [
      // Anthropic "A" logo
      'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
    ],
  },
  'Cursor': {
    type: 'fill',
    paths: [
      'M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23',
    ],
  },
  'GitHub Copilot': {
    type: 'fill',
    paths: [
      'M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z',
    ],
  },
  'GitHub': {
    type: 'fill',
    paths: [
      'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    ],
  },
  'Conversational UI': {
    type: 'stroke',
    paths: [
      'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    ],
  },
};

// Page-specific icons (Lucide-style, 24x24 viewBox, stroke-based)
export const PAGE_ICONS: Record<string, string[]> = {
  Newspaper: [
    'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z',
    'M2 6h4',
    'M2 10h4',
    'M2 14h4',
    'M2 18h4',
    'M10 6h8',
    'M10 10h8',
    'M10 14h4',
  ],
  BookOpen: [
    'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
    'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  ],
  ClipboardCheck: [
    'M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z',
    'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
    'M9 14l2 2 4-4',
  ],
  CheckSquare: [
    'M9 11l3 3L22 4',
    'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  ],
  Sparkles: [
    'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z',
    'M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z',
  ],
};

export function getIconPaths(iconName: string): string[] {
  return CATEGORY_ICONS[iconName] || CATEGORY_ICONS.Shield;
}

/** Straight wireframe grid */
export function generateGridPaths(): { d: string; opacity: number }[] {
  const paths: { d: string; opacity: number }[] = [];
  const gridW = 480;
  const gridH = 520;
  const offsetX = 60;
  const offsetY = 55;
  const hLines = 16;
  const vLines = 18;

  for (let r = 0; r <= hLines; r++) {
    const nr = r / hLines;
    const y = offsetY + nr * gridH;
    const d = `M${offsetX} ${y.toFixed(1)} L${offsetX + gridW} ${y.toFixed(1)}`;
    const opacity = 0.04 + 0.09 * Math.sin(nr * Math.PI);
    paths.push({ d, opacity });
  }

  for (let c = 0; c <= vLines; c++) {
    const nc = c / vLines;
    const x = offsetX + nc * gridW;
    const d = `M${x.toFixed(1)} ${offsetY} L${x.toFixed(1)} ${offsetY + gridH}`;
    const opacity = 0.04 + 0.09 * Math.sin(nc * Math.PI);
    paths.push({ d, opacity });
  }

  return paths;
}

export async function loadFonts() {
  const [regular, bold] = await Promise.all([
    fetch(`${SITE_URL}/fonts/satoshi-400.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${SITE_URL}/fonts/satoshi-700.ttf`).then((r) => r.arrayBuffer()),
  ]);
  return { regular, bold };
}
