import { AppShell } from "../../components/app-shell";
import { ReunitePointPosterStudio } from "../../components/reunite-point-poster-studio";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function ReunitePointsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Reunite Points"
      title="Reunite Point Posters"
      subtitle="Prepare official posters for Redemption City locations. Each QR points to a reporting location, not a person or private record."
    >
      <ReunitePointPosterStudio points={snapshot.reunitePoints} />
    </AppShell>
  );
}
