"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Bell, CheckCircle2, MapPinned, PackageCheck, ShieldCheck, WifiOff } from "lucide-react";
import { guidedDemoSteps } from "../demo/guided-demo";
import type { DemoScenarioSnapshot } from "../demo/scenario-data";
import { useDemoRuntimeState } from "../demo/use-demo-runtime";
import { formatMinutes } from "../lib/format";
import { ConnectivityBadge } from "./connectivity-badge";
import { ConnectivityToggle } from "./connectivity-toggle";
import { GuidedDemoTimeline } from "./guided-demo-timeline";
import { MetricCard } from "./metric-card";
import { OfflineQueuePanel } from "./offline-queue-panel";
import { PAAnnouncementPanel } from "./pa-announcement-panel";
import { ResetDemoButton } from "./reset-demo-button";

interface DemoControlPanelProps {
  snapshot: DemoScenarioSnapshot;
}

export function DemoControlPanel({ snapshot }: DemoControlPanelProps) {
  const {
    state,
    setConnectivity,
    completeStep,
    queueOfflineReport,
    completePersonHandover,
    completeItemRelease
  } = useDemoRuntimeState();
  const currentStep = guidedDemoSteps[state.activeStepIndex];
  const personMatch = snapshot.personRecommendations[0];
  const itemMatch = snapshot.itemRecommendations[0];

  return (
    <div className="space-y-7">
      <GuidedDemoTimeline state={state} />

      <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="border border-border bg-panel/90 p-6 shadow-command-glow">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Current step</p>
              <h2 className="mt-2 text-3xl font-semibold">{currentStep?.label}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-muted">{currentStep?.summary}</p>
            </div>
            <ConnectivityBadge status={state.connectivityStatus} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={"/reunite-points" as Route} className="border border-cyan/30 bg-cyan/10 p-4 transition hover:border-cyan">
              <MapPinned className="size-5 text-cyan" aria-hidden="true" />
              <p className="mt-3 font-semibold">RP-014 Arena Rear</p>
              <p className="mt-2 text-sm text-muted">Official reporting point and physical fallback code.</p>
            </Link>
            <Link href={"/matches/person" as Route} className="border border-cyan/30 bg-cyan/10 p-4 transition hover:border-cyan">
              <ShieldCheck className="size-5 text-cyan" aria-hidden="true" />
              <p className="mt-3 font-semibold">Person match score {personMatch?.score ?? 0}</p>
              <p className="mt-2 text-sm text-muted">Rule-based recommendation, Information Bureau verification required.</p>
            </Link>
            <Link href={"/matches/item" as Route} className="border border-cyan/30 bg-cyan/10 p-4 transition hover:border-cyan">
              <PackageCheck className="size-5 text-cyan" aria-hidden="true" />
              <p className="mt-3 font-semibold">Item match score {itemMatch?.score ?? 0}</p>
              <p className="mt-2 text-sm text-muted">Lost and found bag reports require proof of ownership.</p>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => completeStep("view-rp014")}
              className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
            >
              Start at RP-014
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={completePersonHandover}
              disabled={state.connectivityStatus === "degraded" || state.personHandoverCompleted}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Complete reunion
            </button>
            <button
              type="button"
              onClick={completeItemRelease}
              disabled={state.connectivityStatus === "degraded" || state.itemReleaseCompleted}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackageCheck className="size-4" aria-hidden="true" />
              Release item
            </button>
            <ResetDemoButton />
          </div>
        </article>

        <article className="border border-border bg-panel/90 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">Connectivity</p>
          <h2 className="mt-2 text-2xl font-semibold">Runtime controls</h2>
          <div className="mt-5">
            <ConnectivityToggle value={state.connectivityStatus} onChange={setConnectivity} />
          </div>
          <button
            type="button"
            onClick={queueOfflineReport}
            disabled={state.connectivityStatus !== "degraded"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WifiOff className="size-4" aria-hidden="true" />
            Queue offline report
          </button>
          <p className="mt-4 text-sm leading-6 text-muted">
            If the QR form cannot load, the printed Point Code is reported to an official volunteer or the Information Bureau.
          </p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Median reunion" value={formatMinutes(snapshot.dashboard.medianReunionMinutes)} tone="emerald" />
        <MetricCard label="Safely reunited" value={snapshot.dashboard.safelyReunitedTotal} tone="emerald" />
        <MetricCard label="Items released" value={snapshot.dashboard.releasedItemsTotal} tone="emerald" />
        <MetricCard label="Offline queued" value={snapshot.dashboard.offlineReportsPendingSync + state.offlineQueuedReports} tone="amber" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <OfflineQueuePanel operations={snapshot.pendingOffline} runtimeQueued={state.offlineQueuedReports} />
        <PAAnnouncementPanel announcements={snapshot.announcements} />
      </section>

      <section className="border border-emerald-400/35 bg-emerald-400/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Outcome</p>
        <h2 className="mt-2 text-3xl font-semibold">Safely Reunited</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">
          The judged flow ends with verified person handover, item release after proof of ownership, an auditable PA fallback,
          and aggregate leadership insight for Arena Rear coverage.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={"/handover/person/person_match_demo" as Route} className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950">
            Open handover
          </Link>
          <Link href={"/analytics" as Route} className="inline-flex items-center gap-2 rounded-md border border-cyan/35 px-4 py-2 text-sm font-semibold text-cyan">
            <Bell className="size-4" aria-hidden="true" />
            Leadership outcome
          </Link>
        </div>
      </section>
    </div>
  );
}
