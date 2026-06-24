import { AppShell } from "../../../components/app-shell";
import { MatchRecommendationCard } from "../../../components/match-recommendation-card";
import { getDemoScenarioSnapshot } from "../../../demo/scenario-data";
import { titleCase } from "../../../lib/format";

export default async function PersonMatchesPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Information Bureau"
      title="Person Match Review"
      subtitle="ReuniteRC compares new reports with existing cases and shows likely matches for Information Bureau staff to review. Staff verification is required before reunion."
    >
      <div className="space-y-5">
        {snapshot.personRecommendations.map((recommendation) => {
          const lookingCase = snapshot.personCases.find((personCase) => personCase.id === recommendation.lookingCaseId);
          const foundCase = snapshot.personCases.find((personCase) => personCase.id === recommendation.foundCaseId);

          return (
            <MatchRecommendationCard
              key={recommendation.id}
              title="Person recommendation"
              leftLabel={lookingCase ? `${titleCase(lookingCase.caseIntent)} - ${lookingCase.lastSeenOrFoundLocation}` : recommendation.lookingCaseId}
              rightLabel={foundCase ? `${titleCase(foundCase.caseIntent)} - ${foundCase.lastSeenOrFoundLocation}` : recommendation.foundCaseId}
              score={recommendation.score}
              tier={recommendation.tier}
              reasons={recommendation.reasons}
              footer="Staff verification is required before reunion."
              actionHref={`/handover/person/${recommendation.id}`}
              actionLabel="Start verification"
            />
          );
        })}
      </div>
    </AppShell>
  );
}
