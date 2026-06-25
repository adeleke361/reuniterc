import { AppShell } from "../../../components/app-shell";
import { PersonReportForm } from "../../../components/person-report-form";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";

interface PersonReportPageProps {
  searchParams?: Promise<{
    intent?: string | string[];
  }>;
}

export default async function PersonReportPage({ searchParams }: PersonReportPageProps) {
  const snapshot = await getDemoScenarioSnapshot();
  const params = await searchParams;
  const intent = Array.isArray(params?.intent) ? params?.intent[0] : params?.intent;
  const initialIntent = intent === "found_person" ? "found_person" : "looking_for_person";

  return (
    <AppShell
      eyebrow="Report capture"
      title="Person Report"
      subtitle="Report a missing person or found person from a Reunite Point. The Information Desk reviews likely matches and verifies before any handover."
    >
      <PersonReportForm points={snapshot.reunitePoints} initialIntent={initialIntent} />
    </AppShell>
  );
}
