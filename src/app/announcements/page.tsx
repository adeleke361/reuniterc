import { AppShell } from "../../components/app-shell";
import { PAAnnouncementPanel } from "../../components/pa-announcement-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function AnnouncementsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Fallback workflow"
      title="PA Escalation Queue"
      subtitle="Urgent cases can be escalated immediately. Unresolved cases can be moved to the PA queue after review."
    >
      <PAAnnouncementPanel announcements={snapshot.announcements} />
    </AppShell>
  );
}
