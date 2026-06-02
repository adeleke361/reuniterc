import { AppShell } from "../../../../components/app-shell";
import { ItemReleaseWorkflow } from "../../../../components/item-release-workflow";
import { getPreparedItemReleaseScenario } from "../../../../demo/scenario-data";

interface ItemReleasePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemReleasePage({ params }: ItemReleasePageProps) {
  const { id } = await params;
  const scenario = await getPreparedItemReleaseScenario(id);

  return (
    <AppShell
      eyebrow="Verified item release"
      title="Proof-of-ownership workflow"
      subtitle="A found item is not released until claimant proof is verified. Final release is blocked while connectivity is degraded."
    >
      <ItemReleaseWorkflow
        match={scenario.match}
        lostItemCase={scenario.lostItemCase}
        foundItemCase={scenario.foundItemCase}
      />
    </AppShell>
  );
}
