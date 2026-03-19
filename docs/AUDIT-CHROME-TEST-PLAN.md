# Audit Page — Chrome Test Plan

Test the audit page at `/audit` on Chrome to verify all fixes work correctly.

## Prerequisites
- Chrome (latest stable) on desktop and mobile
- Dev server running (`npm run dev`) or production build (`npm run build && npm start`)
- Chrome DevTools open for device emulation

---

## Test 1: Canvas Fills Viewport (dvh fix)

**What changed:** Container uses `100dvh` instead of `100vh` to account for Chrome's dynamic address bar.

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Open `/audit` on Chrome desktop, full screen | Canvas fills the area below navbar — no gap at bottom, no scrollbar on the page |
| 1.2 | Open DevTools → Toggle Device Toolbar → iPhone 14 Pro | Canvas fits within the visible area, no content cut off at bottom |
| 1.3 | On mobile emulation, scroll up/down to trigger address bar show/hide | Canvas resizes smoothly — no content jumps, no white gaps, toolbar stays visible |
| 1.4 | Resize browser window from tall to short (drag bottom edge) | Canvas adjusts height — upload card and marketing pitch remain centered and visible |

**Pass criteria:** No vertical overflow, no content clipped, no scrollbar on the main page.

---

## Test 2: Upload & Image Display

**What changed:** Image `max-h` uses `dvh` units; sidebar padding is responsive.

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Upload a desktop screenshot (landscape) | Image displays in device frame, centered in canvas, fully visible with toolbar below |
| 2.2 | Upload a mobile screenshot (portrait/tall) | Image fits within viewport height — not clipped at bottom, toolbar visible |
| 2.3 | Toggle "Hide Frame" in toolbar | Image switches to raw view, still fits within `70dvh` max height |
| 2.4 | Upload 4 images, use carousel arrows | All images navigate correctly, dots indicator shows, no layout shifts |
| 2.5 | On mobile emulation (iPhone 14), upload an image | Image + toolbar visible without scrolling, not cut off by address bar |

**Pass criteria:** Images always fully visible with toolbar, no clipping on any viewport size.

---

## Test 3: Results Sidebar (Desktop)

**What changed:** Sidebar width capped with `min(420px, 45vw)` to prevent overflow on mid-range screens; removed redundant `overflow-hidden` layer.

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | Upload image → click Analyze → wait for results | Sidebar slides in from right, image shifts left to make room |
| 3.2 | Check sidebar content is scrollable | Score, patterns, and "Chat with Design Mentor" button all accessible by scrolling |
| 3.3 | Resize window to 1024px wide | Sidebar narrows proportionally (45vw cap), doesn't overflow canvas or overlap image |
| 3.4 | Resize window to 1200px wide | Sidebar is 420px, image has room, no horizontal scrollbar |
| 3.5 | Resize window to 1440px+ (XL) | Sidebar is 460px, comfortable spacing |
| 3.6 | Click collapse button (>>) on sidebar | Sidebar collapses to thin strip, image recenters |
| 3.7 | Click collapsed strip to re-expand | Sidebar expands back, content intact |

**Pass criteria:** Sidebar never overflows canvas at any width 1024px+. Content is always scrollable.

---

## Test 4: Mobile Bottom Sheet

**What changed:** Bottom sheet `maxHeight` uses `dvh` and accounts for navbar (64px).

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | DevTools → iPhone 14 Pro → Upload image → Analyze | Bottom sheet slides up from bottom after results |
| 4.2 | Check bottom sheet doesn't cover navbar | Top of sheet stays below navbar — navbar links still accessible |
| 4.3 | Scroll within bottom sheet | Content scrolls smoothly within the sheet, page doesn't scroll behind it |
| 4.4 | Tap drag handle to collapse | Sheet collapses to peek strip at bottom |
| 4.5 | Tap peek strip to re-expand | Sheet expands, content still scrollable |
| 4.6 | Rotate to landscape (if testing real device) | Sheet adjusts height, still doesn't cover navbar |

**Pass criteria:** Bottom sheet never overlaps navbar. Content within sheet is scrollable.

---

## Test 5: Chat Mode in Sidebar

| Step | Action | Expected |
|------|--------|----------|
| 5.1 | After analysis, click "Chat with Design Mentor" in toolbar | Sidebar switches to chat view |
| 5.2 | Type a message and send | Chat input visible, messages appear, scrollable |
| 5.3 | On mobile, open chat from toolbar button | Bottom sheet shows chat, input not hidden by keyboard |
| 5.4 | Click "Back to Analysis" in chat header | Returns to analysis view, scroll position preserved |

**Pass criteria:** Chat mode fully functional, input always visible.

---

## Test 6: Edge Cases

| Step | Action | Expected |
|------|--------|----------|
| 6.1 | Open `/audit` with browser zoom at 125% | Layout adapts, no overflow or overlap |
| 6.2 | Open `/audit` with browser zoom at 75% | Layout adapts, elements don't become too small |
| 6.3 | Open `/audit` → Analyze → quickly resize window during sidebar animation | No layout thrashing, animation completes smoothly |
| 6.4 | Open `/audit` in Chrome split-screen (half screen) | Canvas and sidebar adapt to narrow viewport |
| 6.5 | Test with dark mode toggled on | All elements visible, no contrast issues with sidebar/canvas |

**Pass criteria:** No broken layouts under edge conditions.

---

## Quick Smoke Test (5 min)

If short on time, run these 5 checks:

1. Open `/audit` on Chrome desktop → canvas fills below navbar, no scroll ✅
2. Upload image → image + toolbar fully visible ✅
3. Analyze → sidebar appears, content scrollable ✅
4. DevTools mobile (iPhone 14) → repeat steps 1-3, bottom sheet doesn't cover navbar ✅
5. Resize window to 1024px → sidebar doesn't overflow ✅

---

## Browser Support Matrix

| Browser | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Chrome (target) | Full test | Emulated | Emulated + real if available |
| Edge | Smoke test | — | — |
| Safari | Smoke test | — | Real device if available |
| Firefox | Smoke test | — | — |

`dvh` browser support: Chrome 108+, Safari 15.4+, Firefox 94+, Edge 108+ — covers 95%+ of users.
