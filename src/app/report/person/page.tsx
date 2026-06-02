import { AppShell } from "../../../components/app-shell";
import { PersonReportForm } from "../../../components/person-report-form";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";

export default async function PersonReportPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Report capture"
      title="Person report"
      subtitle="Capture looking-for-person and found-person reports with Reunite Point context, non-sensitive tags and staff-only notes."
    >
      <PersonReportForm points={snapshot.reunitePoints} />
    </AppShell>
  );
}
