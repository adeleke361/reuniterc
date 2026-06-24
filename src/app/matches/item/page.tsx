import { AppShell } from "../../../components/app-shell";
import { MatchRecommendationCard } from "../../../components/match-recommendation-card";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";
import { titleCase } from "../../../lib/format";

export default async function ItemMatchesPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Information Bureau"
      title="Item Match Review"
      subtitle="ReuniteRC compares new reports with existing cases and shows likely matches for Information Bureau staff to review. Proof-of-ownership verification is required before item release."
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
              footer="Proof-of-ownership verification is required before item release."
              actionHref={`/release/item/${recommendation.id}`}
              actionLabel="Verify item release"
            />
          );
        })}
      </div>
    </AppShell>
  );
}
