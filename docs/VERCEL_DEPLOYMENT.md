# Vercel Deployment Guide - Pattern Lab Analyze Mode

## Quick Setup Checklist

Follow these steps to deploy the Analyze Mode feature to production with real API detection:

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (aiuxdesign.guide)
3. Navigate to **Settings** → **Environment Variables**
4. Add these two variables:

#### Variable 1: API Key
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: `[Your Anthropic API key - starts with sk-ant-api03-]`
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

> **Note**: Use the API key you received from https://console.anthropic.com/. Never commit API keys to your repository.

#### Variable 2: Mock Mode (Disable for Production)
- **Name**: `NEXT_PUBLIC_MOCK_ANALYSIS`
- **Value**: `false`
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

### Step 2: Redeploy

After adding environment variables, you need to redeploy:

**Option A: Automatic Redeploy (Recommended)**
- Vercel will prompt you to redeploy after adding environment variables
- Click **Redeploy** button

**Option B: Manual Redeploy**
- Go to **Deployments** tab
- Find the latest deployment
- Click the three dots (⋯) → **Redeploy**

**Option C: Push a New Commit**
- Make any small change and push to your branch
- Vercel will automatically deploy

### Step 3: Test in Production

Once redeployment completes (usually 2-3 minutes):

1. Visit https://aiuxdesign.guide/simulator
2. Click **"Upload Design"** button
3. Select any AI interface screenshot (JPG, PNG, or WebP)
4. Wait 2-3 seconds for Claude to analyze
5. Verify you see real pattern detection results

**Expected behavior:**
- ✅ No "DEMO MODE" badge should appear
- ✅ Analysis should complete in 2-3 seconds
- ✅ Results should show detected patterns based on actual image content
- ✅ Different images should produce different results

**If you see errors:**
- Check browser console for error messages
- Verify environment variables are set correctly in Vercel
- Ensure redeploy completed successfully
- Check Vercel function logs in the dashboard

## Cost Monitoring

Since you're using the real API in production:

- **Claude 3.5 Sonnet pricing**: ~$0.003 per image analysis
- **Free tier**: 5 requests/minute
- Monitor usage at: https://console.anthropic.com/settings/usage

## Switching Back to Mock Mode

If you want to disable real API and use mock mode later:

1. Go to Vercel → Settings → Environment Variables
2. Find `NEXT_PUBLIC_MOCK_ANALYSIS`
3. Change value from `false` to `true`
4. Redeploy

## Troubleshooting

### "Could not resolve authentication method"
- **Cause**: API key not set or incorrect
- **Fix**: Verify `ANTHROPIC_API_KEY` is set in Vercel with correct value

### "Analysis takes too long"
- **Cause**: Network issues or rate limiting
- **Fix**: Check Anthropic API status and your rate limits

### Results seem incorrect
- **Cause**: Image quality or unclear features
- **Fix**: Upload clearer screenshots with visible AI features

### Still seeing "DEMO MODE" badge
- **Cause**: `NEXT_PUBLIC_MOCK_ANALYSIS` not set to `false`
- **Fix**: Update environment variable and redeploy

## Next Steps (Phase 2)

Once Phase 1 is working in production, Phase 2 will add:
- Connect detected patterns to simulator toggles
- "Apply to Simulator" button
- Pre-populate scenario patterns based on analysis
- Scroll to simulator view after analysis

## Support

For issues or questions:
- Check browser console for detailed error logs
- Review Vercel function logs in dashboard
- Verify API key is valid at https://console.anthropic.com/
