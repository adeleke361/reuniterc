import { Activity, Bell, CheckCircle2, MapPinned, PackageCheck, ShieldCheck, WifiOff } from "lucide-react";
import { ActivityTimeline } from "../../components/activity-timeline";
import { AppShell } from "../../components/app-shell";
import { CaseStatusBadge } from "../../components/case-status-badge";
import { MetricCard } from "../../components/metric-card";
import { OfflineQueuePanel } from "../../components/offline-queue-panel";
import { PriorityBadge } from "../../components/priority-badge";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";
import { formatMinutes, titleCase } from "../../lib/format";

export default async function DashboardPage() {
  const snapshot = await getDemoScenarioSnapshot();
  const dashboard = snapshot.dashboard;

  return (
    <AppShell
      eyebrow="Information Bureau"
      title="Command dashboard"
      subtitle="Operational view for active Reunite Points, person cases, item cases, match recommendations, PA fallback and offline queue status."
    >
      <div className="space-y-7">
        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Open person cases" value={dashboard.openLookingForPersonCases + dashboard.foundPersonsAwaitingMatch} tone="cyan" icon={ShieldCheck} />
          <MetricCard label="Open item cases" value={dashboard.openLostItemCases + dashboard.foundItemsAwaitingMatch} tone="cyan" icon={PackageCheck} />
          <MetricCard label="Safely reunited" value={dashboard.safelyReunitedTotal} detail={formatMinutes(dashboard.medianReunionMinutes)} tone="emerald" icon={CheckCircle2} />
          <MetricCard label="Offline queued" value={dashboard.offlineReportsPendingSync} tone="amber" icon={WifiOff} />
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Person matches" value={snapshot.personRecommendations.length} detail="Review queue" tone="amber" icon={Activity} />
          <MetricCard label="Item matches" value={snapshot.itemRecommendations.length} detail="Review queue" tone="amber" icon={Activity} />
          <MetricCard label="Items released" value={dashboard.releasedItemsTotal} detail={formatMinutes(dashboard.medianItemReleaseMinutes)} tone="emerald" icon={PackageCheck} />
          <MetricCard label="PA escalations" value={dashboard.paEscalations} tone="amber" icon={Bell} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Priority cases</p>
            <div className="mt-5 space-y-3">
              {snapshot.personCases.slice(0, 4).map((personCase) => (
                <div key={personCase.id} className="border border-border bg-panel-strong p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{titleCase(personCase.caseIntent)} - {personCase.lastSeenOrFoundLocation}</p>
                    <div className="flex flex-wrap gap-2">
                      <PriorityBadge urgency={personCase.urgency} />
                      <CaseStatusBadge status={personCase.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Active Reunite Points</p>
            <div className="mt-5 space-y-3">
              {snapshot.reunitePoints.map((point) => (
                <div key={point.id} className="flex items-center justify-between border border-border bg-panel-strong p-4">
                  <div>
                    <p className="font-semibold">{point.code} - {point.zone}</p>
                    <p className="mt-1 text-sm text-muted">{point.locationLabel}</p>
                  </div>
                  <MapPinned className="size-5 text-cyan" aria-hidden="true" />
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <OfflineQueuePanel operations={snapshot.pendingOffline} />
          <ActivityTimeline auditLogs={snapshot.auditLogs} />
        </section>
      </div>
    </AppShell>
  );
}
