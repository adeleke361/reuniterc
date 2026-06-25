import { AppShell } from "../../components/app-shell";
import { DemoControlPanel } from "../../components/demo-control-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function DemoPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Judge Walkthrough"
      title="ReuniteRC Walkthrough"
      subtitle="Walk through one fictional Information Bureau case from Reunite Point report to likely match review, staff verification, item release, offline queueing, PA preparation, and leadership analytics."
    >
      <DemoControlPanel snapshot={snapshot} />
    </AppShell>
  );
}
