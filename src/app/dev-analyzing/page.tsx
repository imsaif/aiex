// Dev preview for the audit AnalyzingView — lets you see the analyzing state
// without running a real (paywalled, ~40s) audit. Renders a frozen mid-analysis
// snapshot with mock data.
import { AnalyzingView } from '@/components/audit/AnalyzingView';

const shot = [{ url: '/images/examples/audit-samples/microsoft-copilot.png', deviceType: 'desktop' }];

export default function DevAnalyzingPreview() {
  return <AnalyzingView screenshots={shot} productType="dashboard-analytics" previewElapsedMs={15000} />;
}
