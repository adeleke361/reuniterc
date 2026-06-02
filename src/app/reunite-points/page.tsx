import { AppShell } from "../../components/app-shell";
import { ReunitePointPoster } from "../../components/reunite-point-poster";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function ReunitePointsPage() {
  const snapshot = await getDemoScenarioSnapshot();
  const featuredPoint = snapshot.reunitePoints.find((point) => point.code === "RP-014");
  const otherPoints = snapshot.reunitePoints.filter((point) => point.code !== "RP-014");

  return (
    <AppShell
      eyebrow="Reunite Points"
      title="Official poster generator"
      subtitle="Each poster carries ReuniteRC branding, a QR representation for online reporting, a visible Point Code, location name, short URL, fallback instruction and tamper-check guidance."
    >
      <div className="space-y-7">
        {featuredPoint && <ReunitePointPoster point={featuredPoint} featured />}
        <section className="grid gap-5 lg:grid-cols-3">
          {otherPoints.map((point) => (
            <ReunitePointPoster key={point.id} point={point} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
