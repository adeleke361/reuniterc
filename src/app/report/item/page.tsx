import { AppShell } from "../../../components/app-shell";
import { ItemReportForm } from "../../../components/item-report-form";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";

interface ItemReportPageProps {
  searchParams?: Promise<{
    intent?: string | string[];
  }>;
}

export default async function ItemReportPage({ searchParams }: ItemReportPageProps) {
  const snapshot = await getDemoScenarioSnapshot();
  const params = await searchParams;
  const intent = Array.isArray(params?.intent) ? params?.intent[0] : params?.intent;
  const initialIntent = intent === "found_item" ? "found_item" : "lost_item";

  return (
    <AppShell
      eyebrow="Report capture"
      title="Item Report"
      subtitle="Report a lost item or found item from a Reunite Point. Proof-of-ownership verification is required before any item release."
    >
      <ItemReportForm points={snapshot.reunitePoints} initialIntent={initialIntent} />
    </AppShell>
  );
}
