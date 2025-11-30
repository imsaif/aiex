# Rate Limiting & Cost Management

## Current Configuration

### Free Tier Limits
| Resource | Limit | Reset |
|----------|-------|-------|
| Analyses per IP | 3/day | Midnight UTC |
| Chat messages per session | 5/session | 1 hour |

### Cost Analysis (Claude Sonnet 4)
- **Per Analysis**: ~$0.025 (input: ~1,500 tokens, output: ~800 tokens)
- **Per Chat Message**: ~$0.006 (input: ~500 tokens, output: ~150 tokens)
- **Per Full Session** (1 analysis + 5 chats): ~$0.055

### Monthly Budget Projections

| Daily Users | Sessions/Day | Monthly Cost | Budget Status |
|-------------|--------------|--------------|---------------|
| 10 | 30 | ~$50 | Over budget |
| 5 | 15 | ~$25 | Slightly over |
| 3 | 9 | ~$15 | Within $20 |
| 2 | 6 | ~$10 | Safe |

**Current Budget**: $20/month (starting phase)

---

## Scaling Plan

### Phase 1: Launch (Current)
- **Budget**: $20/month
- **Limits**: 3 analyses/day, 5 chats/session
- **Goal**: Validate product-market fit with early users

### Phase 2: Traction ($50/month)
Trigger: Consistent daily usage, positive feedback

**Options**:
- Increase to 5 analyses/day
- Add 10 chats/session
- Consider Haiku for chat (50% cost reduction on chat)

### Phase 3: Growth ($100-200/month)
Trigger: 20+ daily active users

**Options**:
- Introduce authentication for better tracking
- Offer premium tier (unlimited analyses)
- Switch chat to Haiku, keep Sonnet for analysis
- Add email capture for free tier

### Phase 4: Monetization
Trigger: Strong engagement metrics

**Pricing Ideas**:
- Free: 3 analyses/day (current)
- Pro: $9/month - 20 analyses/day, unlimited chat
- Team: $29/month - Unlimited, priority support

---

## Implementation Details

### Files
- `/src/lib/rate-limit.ts` - Core rate limiting logic
- `/src/app/api/analyze-pattern/route.ts` - Analysis rate check
- `/src/app/api/audit/chat/route.ts` - Chat rate check
- `/src/app/api/audit/usage/route.ts` - Usage status endpoint
- `/src/components/audit/UsageLimitModal.tsx` - User-facing limit modal
- `/src/components/audit/CenterUpload.tsx` - Usage indicator display

### Configuration
```typescript
// src/lib/rate-limit.ts
export const RATE_LIMITS = {
  ANALYSES_PER_DAY: 3,      // Adjust as needed
  CHATS_PER_SESSION: 5,     // Adjust as needed
} as const;
```

### Storage
- **Current**: In-memory Maps (resets on server restart)
- **Production**: Consider Redis/Upstash for persistence across instances

---

## Adjusting Limits

### To Increase Limits
1. Edit `RATE_LIMITS` in `/src/lib/rate-limit.ts`
2. Update this document
3. Deploy

### To Add Premium Tier
1. Implement user authentication
2. Add `userType` check in rate limit functions
3. Create separate limits for free/premium users

### To Switch Chat to Haiku
1. Change model in `/src/app/api/audit/chat/route.ts`:
   ```typescript
   model: 'claude-3-haiku-20240307'  // ~50% cheaper
   ```
2. Test quality is acceptable
3. Update cost projections

---

## Monitoring Checklist

### Weekly Review
- [ ] Check Anthropic dashboard for actual costs
- [ ] Review usage patterns (peak times, power users)
- [ ] Compare projected vs actual spend

### Monthly Review
- [ ] Evaluate if limits need adjustment
- [ ] Assess user feedback on limits
- [ ] Plan for next phase if metrics are strong

---

## Quick Cost Formulas

```
Daily Cost = (analyses × $0.025) + (chats × $0.006)
Monthly Cost = Daily Cost × 30

Example: 10 analyses + 50 chats per day
= (10 × $0.025) + (50 × $0.006)
= $0.25 + $0.30 = $0.55/day
= $16.50/month
```

---

*Last Updated: November 2024*
*Next Review: After 100 total analyses*
