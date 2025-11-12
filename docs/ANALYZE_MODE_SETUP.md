# Pattern Lab - Analyze Mode Setup Guide

## Overview
The Analyze Mode feature allows users to upload design screenshots and automatically detect AI UX patterns using Claude's vision API.

## 🎭 Quick Start: Mock Mode (No API Key Required!)

**Want to test the UI immediately?** The feature comes with **Mock Mode** enabled by default!

### What is Mock Mode?
- Tests the complete UI/UX without calling the real API
- Generates realistic pattern detection results
- Simulates 2-second analysis delay
- Shows different results each time for variety
- **Perfect for development and demos**

### Using Mock Mode
Mock mode is **already enabled** in `.env.local`:
```bash
NEXT_PUBLIC_MOCK_ANALYSIS=true
```

Just run:
```bash
npm run dev
```

Then visit http://localhost:3000/simulator and upload any image! You'll see:
- Yellow "DEMO MODE" badge
- Simulated pattern analysis
- Realistic results without API costs

### Switching to Real API
When ready to use the real Claude API:
1. Get API key from https://console.anthropic.com/
2. Edit `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
NEXT_PUBLIC_MOCK_ANALYSIS=false  # or remove this line
```
3. Restart dev server

---

## Phase 1 Implementation Status ✅

### Completed Features
- ✅ Upload button with file validation
- ✅ Image analysis API route using Claude Vision API
- ✅ **Mock Mode for testing without API key**
- ✅ Basic pattern detection for 7 patterns
- ✅ Results display with pattern grid
- ✅ Loading states and error handling
- ✅ Console logging for debugging
- ✅ Visual indicators for demo/real mode

### Files Created/Modified
1. **API Route**: `/src/app/api/analyze-patterns/route.ts`
   - Claude Vision API integration
   - Pattern detection for 7 AI UX patterns
   - Error handling and validation

2. **Component**: `/src/components/simulator/ScenarioListView.tsx`
   - Upload button UI
   - Image analysis function
   - Results display
   - Loading and error states

3. **Environment**: `/.env.local`
   - ANTHROPIC_API_KEY configuration

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @anthropic-ai/sdk
```
✅ Already completed

### 2. Configure API Key
Edit `.env.local` and add your Anthropic API key:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

Get your API key from: https://console.anthropic.com/

### 3. Restart Development Server
```bash
npm run dev
```

## Testing Phase 1

### Test 1: Mock Mode (Easiest - No Setup!)
1. Make sure `.env.local` has `NEXT_PUBLIC_MOCK_ANALYSIS=true`
2. Run `npm run dev`
3. Navigate to `http://localhost:3000/simulator`
4. Look for yellow "DEMO MODE" badge
5. Click "Upload Design" button
6. Select ANY image (JPG, PNG, or WebP)
7. Wait 2 seconds for simulated analysis
8. View results - should show random pattern detection

**Expected Console Output:**
```
🎭 Running in MOCK MODE (no API call)
✅ Mock Analysis complete: {detected_patterns: {...}, pattern_count: 4, summary: "..."}
📊 Detected patterns: {explainableAI: true, confidenceIndicators: true, ...}
🔢 Pattern count: 4
📝 Summary: This design demonstrates strong AI transparency...
```

### Test 2: Real API Mode
1. Get API key from https://console.anthropic.com/
2. Edit `.env.local`: Set `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_MOCK_ANALYSIS=false`
3. Restart server
4. Upload an AI interface screenshot (ChatGPT, Copilot, etc.)
5. Wait 2-3 seconds for real analysis
6. Verify patterns match the actual UI features

**Console Output Should Show:**
```
✅ Analysis complete: {detected_patterns: {...}, pattern_count: X, summary: "..."}
📊 Detected patterns: {explainableAI: false, confidenceIndicators: true, ...}
🔢 Pattern count: 3
📝 Summary: This design shows moderate AI maturity...
```

### Test 3: Error Handling
Test these scenarios:
- Upload invalid file type → Should show error
- Upload file > 10MB → Should show error
- Real API without key → Should show API error

## Detected Patterns

The system detects these 7 AI UX patterns:

1. **explainableAI** - Shows why AI made decisions
2. **confidenceIndicators** - Displays AI certainty levels
3. **humanInTheLoop** - Requires human approval for actions
4. **progressiveDisclosure** - Reveals information gradually
5. **undoRedo** - Allows reversing AI actions
6. **gracefulDegradation** - Handles failures with fallbacks
7. **contextualAssistance** - Provides context-aware help

## Example Test Images

Test with these types of screenshots:
- ChatGPT interface (should detect: explainableAI, humanInTheLoop, contextualAssistance)
- GitHub Copilot (should detect: confidenceIndicators, humanInTheLoop, contextualAssistance)
- Gmail Smart Compose (should detect: undoRedo, contextualAssistance, progressiveDisclosure)

## Next Steps (Phase 2)

Phase 2 will add:
- Connect detected patterns to simulator toggles
- "Apply to Simulator" button
- Pre-populate scenario patterns based on analysis
- Scroll to simulator view after analysis

## Troubleshooting

### Issue: "Failed to analyze patterns"
**Solution**: Check that ANTHROPIC_API_KEY is set correctly in `.env.local`

### Issue: Upload button doesn't work
**Solution**: Check browser console for errors, ensure file is valid image type

### Issue: Analysis takes too long
**Solution**: Using Claude Sonnet for speed. Check network connection.

### Issue: Incorrect pattern detection
**Solution**: Try clearer screenshots with visible AI features. Check console for Claude's reasoning.

## Cost Information

**Claude Sonnet 3.5 Pricing:**
- ~$0.003 per image analysis
- Very affordable for development/testing

**Recommendation:**
- Use Sonnet for development (fast + cheap)
- Can switch to Opus for better accuracy if needed

## API Rate Limits

Anthropic API limits:
- Free tier: 5 requests/minute
- Paid tier: Higher limits

If you hit rate limits, implement debouncing or queuing.
