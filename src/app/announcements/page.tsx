import { AppShell } from "../../components/app-shell";
import { PAAnnouncementPanel } from "../../components/pa-announcement-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function AnnouncementsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Fallback workflow"
      title="PA fallback queue"
      subtitle="Privacy-conscious PA fallback drafts remain available for urgent or unresolved cases, without automatically resolving any case."
    >
      <PAAnnouncementPanel announcements={snapshot.announcements} />
    </AppShell>
  );
}
