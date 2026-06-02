import { AppShell } from "../../components/app-shell";
import { DemoControlPanel } from "../../components/demo-control-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function DemoPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Guided simulation"
      title="Congress Night 2026 recovery flow"
      subtitle="Run the Arena Rear RP-014 story from report capture through rule-based match review, verified reunion, item release, offline queueing, PA fallback and leadership analytics."
    >
      <DemoControlPanel snapshot={snapshot} />
    </AppShell>
  );
}
