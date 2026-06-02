import { AppShell } from "../../components/app-shell";
import { DemoControlPanel } from "../../components/demo-control-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function DemoPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Guided simulation"
      title="Arena Rear care flow"
      subtitle="Walk through one fictional Information Bureau incident with calm reporting, transparent review, verified handover, item release, offline queueing, PA fallback and aggregate leadership outcome."
    >
      <DemoControlPanel snapshot={snapshot} />
    </AppShell>
  );
}
