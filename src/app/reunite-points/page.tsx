import { AppShell } from "../../components/app-shell";
import { ReunitePointPosterStudio } from "../../components/reunite-point-poster-studio";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function ReunitePointsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Reunite Points"
      title="Official poster generator"
      subtitle="Each poster carries ReuniteRC branding, a QR representation for online reporting, a visible Point Code, location name, short URL, fallback instruction and tamper-check guidance."
    >
      <ReunitePointPosterStudio points={snapshot.reunitePoints} />
    </AppShell>
  );
}
