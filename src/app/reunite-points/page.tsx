import { AppShell } from "../../components/app-shell";
import { ReunitePointPosterStudio } from "../../components/reunite-point-poster-studio";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function ReunitePointsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Reunite Points"
      title="Operational poster generator"
      subtitle="Prepare printable Reunite Point posters with a visible Point Code, location name, short URL, no-internet fallback instruction and tamper-check guidance for the Information Bureau support flow."
    >
      <ReunitePointPosterStudio points={snapshot.reunitePoints} />
    </AppShell>
  );
}
