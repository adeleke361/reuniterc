import { AppShell } from "../../../components/app-shell";
import { ItemReportForm } from "../../../components/item-report-form";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";

export default async function ItemReportPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Report capture"
      title="Item report"
      subtitle="Capture lost-item and found-item reports while keeping hidden verification details inside authorised staff workflows."
    >
      <ItemReportForm points={snapshot.reunitePoints} />
    </AppShell>
  );
}
