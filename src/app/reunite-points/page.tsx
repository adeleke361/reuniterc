import { AppShell } from "../../components/app-shell";
import { ReunitePointPosterStudio } from "../../components/reunite-point-poster-studio";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function ReunitePointsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Reunite Points"
      title="Reunite Point Posters"
      subtitle="Prepare official Reunite Point posters with a visible Point Code, location name, short URL, no-internet fallback instruction and tamper-check guidance."
    >
      <ReunitePointPosterStudio points={snapshot.reunitePoints} />
    </AppShell>
  );
}
