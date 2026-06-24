import { AppShell } from "../../../../components/app-shell";
import { PersonHandoverWorkflow } from "../../../../components/person-handover-workflow";
import { getPreparedPersonHandoverScenario } from "../../../../demo/scenario-data";

interface PersonHandoverPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonHandoverPage({ params }: PersonHandoverPageProps) {
  const { id } = await params;
  const scenario = await getPreparedPersonHandoverScenario(id);

  return (
    <AppShell
      eyebrow="Verified handover"
      title="Verified Person Handover"
      subtitle="Staff verification is required before reunion. The person case can close only after Information Bureau verification, and final closure is blocked while connectivity is degraded."
    >
      <PersonHandoverWorkflow
        match={scenario.match}
        lookingCase={scenario.lookingCase}
        foundCase={scenario.foundCase}
      />
    </AppShell>
  );
}
