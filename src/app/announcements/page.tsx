import { AppShell } from "../../components/app-shell";
import { PAAnnouncementPanel } from "../../components/pa-announcement-panel";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function AnnouncementsPage() {
  const snapshot = await getDemoScenarioSnapshot();

  return (
    <AppShell
      eyebrow="Fallback workflow"
      title="PA Preparation Queue"
      subtitle="The Information Desk can prepare unresolved cases for PA announcement after review. ReuniteRC does not announce anything automatically."
    >
      <PAAnnouncementPanel announcements={snapshot.announcements} />
    </AppShell>
  );
}
