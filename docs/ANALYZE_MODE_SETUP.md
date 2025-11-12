# Pattern Lab - Analyze Mode Setup Guide

## Overview
The Analyze Mode feature allows users to upload design screenshots and automatically detect AI UX patterns using Claude's vision API.

## Phase 1 Implementation Status ✅

### Completed Features
- ✅ Upload button with file validation
- ✅ Image analysis API route using Claude Vision API
- ✅ Basic pattern detection for 7 patterns
- ✅ Results display with pattern grid
- ✅ Loading states and error handling
- ✅ Console logging for debugging

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

### Test 1: Upload and Analyze
1. Navigate to `http://localhost:3000/simulator`
2. Click "Upload Design" button
3. Select an image (JPG, PNG, or WebP)
4. Wait for analysis to complete
5. Check browser console for detailed results

### Test 2: Verify Pattern Detection
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
- Upload without API key → Should show API error

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
