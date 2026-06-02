import { AppShell } from "../../../components/app-shell";
import { MatchRecommendationCard } from "../../../components/match-recommendation-card";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";
import { titleCase } from "../../../lib/format";

export default async function ItemMatchesPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Information Bureau"
      title="Item match review"
      subtitle="Lost-item and found-item reports are compared with transparent rules. Proof of ownership remains required before release."
    >
      <div className="space-y-5">
        {snapshot.itemRecommendations.map((recommendation) => {
          const lostItemCase = snapshot.itemCases.find((itemCase) => itemCase.id === recommendation.lostItemCaseId);
          const foundItemCase = snapshot.itemCases.find((itemCase) => itemCase.id === recommendation.foundItemCaseId);

          return (
            <MatchRecommendationCard
              key={recommendation.id}
              title="Item recommendation"
              leftLabel={lostItemCase ? `${titleCase(lostItemCase.itemIntent)} - ${lostItemCase.lastSeenOrFoundLocation}` : recommendation.lostItemCaseId}
              rightLabel={foundItemCase ? `${titleCase(foundItemCase.itemIntent)} - ${foundItemCase.lastSeenOrFoundLocation}` : recommendation.foundItemCaseId}
              score={recommendation.score}
              tier={recommendation.tier}
              reasons={recommendation.reasons}
              footer="Proof of ownership required before release."
              actionHref={`/release/item/${recommendation.id}`}
              actionLabel="Verify release"
            />
          );
        })}
      </div>
    </AppShell>
  );
}
