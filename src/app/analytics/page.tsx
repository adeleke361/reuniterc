import { AppShell } from "../../components/app-shell";
import { LeadershipAnalyticsPanel } from "../../components/leadership-analytics-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function AnalyticsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Leadership viewer"
      title="Aggregate operations analytics"
      subtitle="Leadership view stays aggregate-only: no sensitive case notes, hidden item details, contact details or match records are exposed."
    >
      <LeadershipAnalyticsPanel summary={snapshot.leadershipAnalytics} />
    </AppShell>
  );
}
