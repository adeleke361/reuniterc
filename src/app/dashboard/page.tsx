import Link from "next/link";
import type { Route } from "next";
import { Bell, CheckCircle2, ClipboardCheck, MapPinned, PackageCheck, SearchCheck, ShieldCheck } from "lucide-react";
import { ActivityTimeline } from "../../components/activity-timeline";
import { AppShell } from "../../components/app-shell";
import { CaseStatusBadge } from "../../components/case-status-badge";
import { MetricCard } from "../../components/metric-card";
import { OfflineQueuePanel } from "../../components/offline-queue-panel";
import { PriorityBadge } from "../../components/priority-badge";
import { getDemoScenarioSnapshot } from "../../demo/scenario-data";

export default async function DashboardPage() {
  const snapshot = await getDemoScenarioSnapshot();
  const dashboard = snapshot.dashboard;
  const newReports = [
    ...snapshot.personCases
      .filter((personCase) => personCase.status === "report_created" || personCase.status === "under_review")
      .map((personCase) => ({
        id: personCase.id,
        label: personIntentLabel(personCase.caseIntent),
        location: personCase.lastSeenOrFoundLocation,
        status: personCase.status,
        urgency: personCase.urgency
      })),
    ...snapshot.itemCases
      .filter((itemCase) => itemCase.status === "report_created" || itemCase.status === "under_review")
      .map((itemCase) => ({
        id: itemCase.id,
        label: itemIntentLabel(itemCase.itemIntent),
        location: itemCase.lastSeenOrFoundLocation,
        status: itemCase.status,
        urgency: itemCase.urgency
      }))
  ];
  const likelyMatches = snapshot.personRecommendations.length + snapshot.itemRecommendations.length;
  const needsVerification = likelyMatches;
  const paQueue = snapshot.announcements.length;
  const resolvedCases = dashboard.safelyReunitedTotal + dashboard.releasedItemsTotal;

  return (
    <AppShell
      eyebrow="Information Bureau"
      title="Information Bureau Dashboard"
      subtitle="Work queue for new reports, likely matches, verification, PA preparation, resolved cases, and offline sync."
    >
      <div className="space-y-7">
        <section className="grid gap-4 md:grid-cols-5">
          <MetricCard label="New Reports" value={newReports.length} detail="Awaiting Bureau review" tone="cyan" icon={ClipboardCheck} />
          <MetricCard label="Likely Matches" value={likelyMatches} detail="Staff review queue" tone="amber" icon={SearchCheck} />
          <MetricCard label="Needs Verification" value={needsVerification} detail="Before handover or release" tone="red" icon={ShieldCheck} />
          <MetricCard label="PA Preparation" value={paQueue} detail="Prepared after review" tone="amber" icon={Bell} />
          <MetricCard label="Resolved Cases" value={resolvedCases} detail={`${dashboard.safelyReunitedTotal} reunited / ${dashboard.releasedItemsTotal} released`} tone="emerald" icon={CheckCircle2} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">New Reports</p>
            <h2 className="mt-2 text-2xl font-semibold">Reports awaiting staff review</h2>
            <div className="mt-5 space-y-3">
              {newReports.slice(0, 5).map((report) => (
                <div key={report.id} className="border border-border bg-panel-strong p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{report.label} - {report.location}</p>
                    <div className="flex flex-wrap gap-2">
                      <PriorityBadge urgency={report.urgency} />
                      <CaseStatusBadge status={report.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Likely Matches</p>
            <h2 className="mt-2 text-2xl font-semibold">Staff review required</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              ReuniteRC compares reports and shows likely matches for staff to review.
            </p>
            <div className="mt-5 space-y-3">
              <Link
                href={"/matches/person" as Route}
                className="flex items-center justify-between border border-border bg-panel-strong p-4 transition hover:border-amber/45 hover:bg-white/10"
              >
                <div>
                  <p className="font-semibold">Person Match Review</p>
                  <p className="mt-1 text-sm text-muted">{snapshot.personRecommendations.length} likely match</p>
                </div>
                <SearchCheck className="size-5 text-amber-soft" aria-hidden="true" />
              </Link>
              <Link
                href={"/matches/item" as Route}
                className="flex items-center justify-between border border-border bg-panel-strong p-4 transition hover:border-amber/45 hover:bg-white/10"
              >
                <div>
                  <p className="font-semibold">Item Match Review</p>
                  <p className="mt-1 text-sm text-muted">{snapshot.itemRecommendations.length} likely match</p>
                </div>
                <PackageCheck className="size-5 text-amber-soft" aria-hidden="true" />
              </Link>
              <div className="border border-amber/35 bg-amber/10 p-4 text-sm font-semibold leading-6 text-amber-soft">
                Staff verification is required before handover or item release.
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={"/announcements" as Route}
                  className="border border-border bg-panel-strong p-4 text-sm font-semibold transition hover:border-amber/45 hover:bg-white/10"
                >
                  PA Preparation
                </Link>
                <Link
                  href={"/analytics" as Route}
                  className="border border-border bg-panel-strong p-4 text-sm font-semibold transition hover:border-amber/45 hover:bg-white/10"
                >
                  Leadership Analytics
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Active Reunite Points</p>
            <h2 className="mt-2 text-2xl font-semibold">Reporting locations</h2>
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
          <OfflineQueuePanel operations={snapshot.pendingOffline} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="border border-border bg-panel/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Resolved Cases</p>
            <h2 className="mt-2 text-2xl font-semibold">Verified outcomes only</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-emerald-400/30 bg-emerald-400/10 p-4">
                <p className="text-3xl font-semibold text-emerald-300">{dashboard.safelyReunitedTotal}</p>
                <p className="mt-2 text-sm font-semibold text-muted">Safely reunited after handover verification</p>
              </div>
              <div className="border border-emerald-400/30 bg-emerald-400/10 p-4">
                <p className="text-3xl font-semibold text-emerald-300">{dashboard.releasedItemsTotal}</p>
                <p className="mt-2 text-sm font-semibold text-muted">Items released after proof-of-ownership verification</p>
              </div>
            </div>
          </article>
          <ActivityTimeline auditLogs={snapshot.auditLogs} />
        </section>
      </div>
    </AppShell>
  );
}

function personIntentLabel(intent: string) {
  return intent === "looking_for_person" ? "Report a Missing Person" : "Report a Found Person";
}

function itemIntentLabel(intent: string) {
  return intent === "lost_item" ? "Report a Lost Item" : "Report a Found Item";
}
