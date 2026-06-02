"use client";

import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  WifiOff
} from "lucide-react";
import {
  getGuidedDemoVisibility,
  guidedDemoSteps
} from "../demo/guided-demo";
import type { DemoScenarioSnapshot } from "../demo/scenario-data";
import { useDemoRuntimeState } from "../demo/use-demo-runtime";
import { titleCase } from "../lib/format";
import { CaseStatusBadge } from "./case-status-badge";
import { ConnectivityBadge } from "./connectivity-badge";
import { ConnectivityToggle } from "./connectivity-toggle";
import { GuidedDemoTimeline } from "./guided-demo-timeline";
import { LeadershipAnalyticsPanel } from "./leadership-analytics-panel";
import { MatchRecommendationCard } from "./match-recommendation-card";
import { OfflineQueuePanel } from "./offline-queue-panel";
import { PAAnnouncementPanel } from "./pa-announcement-panel";
import { PriorityBadge } from "./priority-badge";
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
  const visibility = getGuidedDemoVisibility(state);
  const arenaPoint = snapshot.reunitePoints.find((point) => point.code === "RP-014");
  const missingCase = snapshot.personCases.find((personCase) => personCase.id === "person_looking_child_open");
  const foundCase = snapshot.personCases.find((personCase) => personCase.id === "person_found_child_candidate");
  const lostBagCase = snapshot.itemCases.find((itemCase) => itemCase.id === "item_lost_bag_open");
  const foundBagCase = snapshot.itemCases.find((itemCase) => itemCase.id === "item_found_bag_candidate");
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

          <div className="mt-6">
            {currentStep?.id === "ready-rp014" && arenaPoint && (
              <StagePanel
                icon={MapPinned}
                title={`${arenaPoint.code} ${arenaPoint.zone}`}
                body={`${arenaPoint.name} is the official reporting point for this demo. The printed Point Code remains useful if the QR form cannot load.`}
                actionLabel="Confirm RP-014 viewed"
                onAction={() => completeStep("ready-rp014")}
                href="/reunite-points"
              />
            )}

            {currentStep?.id === "missing-child-reported" && missingCase && (
              <CaseStage
                title="Missing child reported"
                body="A parent or group leader has submitted a fictional looking-for-person report from Arena Rear."
                status={missingCase.status}
                urgency={missingCase.urgency}
                location={missingCase.lastSeenOrFoundLocation}
                actionLabel="Continue to found-person report"
                onAction={() => completeStep("missing-child-reported")}
              />
            )}

            {currentStep?.id === "found-child-reported" && foundCase && (
              <CaseStage
                title="Found child reported from RP-014"
                body="A volunteer has filed a fictional found-person report from the same Reunite Point."
                status={foundCase.status}
                urgency={foundCase.urgency}
                location={foundCase.lastSeenOrFoundLocation}
                actionLabel="Review person match"
                onAction={() => completeStep("found-child-reported")}
              />
            )}

            {currentStep?.id === "person-match-recommended" && personMatch && missingCase && foundCase && (
              <div className="space-y-4">
                <MatchRecommendationCard
                  title="Person recommendation"
                  leftLabel={`${titleCase(missingCase.caseIntent)} - ${missingCase.lastSeenOrFoundLocation}`}
                  rightLabel={`${titleCase(foundCase.caseIntent)} - ${foundCase.lastSeenOrFoundLocation}`}
                  score={personMatch.score}
                  tier={personMatch.tier}
                  reasons={personMatch.reasons}
                  footer="Human verification required before reunion."
                  actionHref="/matches/person"
                  actionLabel="Open match review"
                />
                <button
                  type="button"
                  onClick={() => completeStep("person-match-recommended")}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
                >
                  Send to verification
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {currentStep?.id === "guardian-group-verification" && (
              <StagePanel
                icon={ShieldCheck}
                title="Guardian/group verification"
                body="The Information Bureau checks the reporter reference and group context before any handover can be completed."
                actionLabel="Complete verified handover"
                onAction={completePersonHandover}
                href="/handover/person/person_match_demo"
              />
            )}

            {currentStep?.id === "safely-reunited" && visibility.showSafelyReunitedOutcome && (
              <OutcomeStage
                icon={CheckCircle2}
                title="Safely Reunited"
                body="Verified handover is complete. The person case can now be counted as safely reunited."
                actionLabel="Run lost-and-found item match"
                onAction={() => completeStep("safely-reunited")}
              />
            )}

            {currentStep?.id === "item-match-recommended" && itemMatch && lostBagCase && foundBagCase && (
              <div className="space-y-4">
                <MatchRecommendationCard
                  title="Item recommendation"
                  leftLabel={`${titleCase(lostBagCase.itemIntent)} - ${lostBagCase.lastSeenOrFoundLocation}`}
                  rightLabel={`${titleCase(foundBagCase.itemIntent)} - ${foundBagCase.lastSeenOrFoundLocation}`}
                  score={itemMatch.score}
                  tier={itemMatch.tier}
                  reasons={itemMatch.reasons}
                  footer="Proof of ownership required before release."
                  actionHref="/matches/item"
                  actionLabel="Open item review"
                />
                <button
                  type="button"
                  onClick={() => completeStep("item-match-recommended")}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
                >
                  Move to proof check
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {currentStep?.id === "item-release-verified" && (
              <StagePanel
                icon={PackageCheck}
                title="Proof-of-ownership item release"
                body="The item stays held until proof details are checked and release notes are captured."
                actionLabel="Complete item release"
                onAction={completeItemRelease}
                href="/release/item/item_match_demo"
              />
            )}

            {currentStep?.id === "offline-queue-test" && (
              <div className="space-y-4">
                {visibility.showItemReleaseOutcome && (
                  <OutcomeNotice
                    icon={PackageCheck}
                    title="Item Released"
                    body="Proof of ownership has been verified, so the item release can be recorded."
                  />
                )}
                <section className="border border-amber/35 bg-amber/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">Low-connectivity test</p>
                  <h3 className="mt-2 text-2xl font-semibold">Queue a staff report offline</h3>
                  <p className="mt-3 leading-7 text-muted">
                    Authorised staff who already loaded the app can queue reports while degraded. Match confirmation,
                    person handover and item release stay blocked until connectivity is stable.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <ConnectivityToggle value={state.connectivityStatus} onChange={setConnectivity} />
                    <button
                      type="button"
                      onClick={queueOfflineReport}
                      disabled={state.connectivityStatus !== "degraded"}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-soft disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <WifiOff className="size-4" aria-hidden="true" />
                      Queue offline report
                    </button>
                  </div>
                </section>
              </div>
            )}

            {currentStep?.id === "leadership-outcome" && (
              <StagePanel
                icon={ClipboardCheck}
                title="Leadership outcome"
                body="Leadership receives aggregate-only insight and an operational recommendation for Arena Rear coverage."
                actionLabel="Open leadership analytics"
                onAction={() => completeStep("leadership-outcome")}
                href="/analytics"
              />
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ResetDemoButton />
          </div>
        </article>

        <article className="border border-border bg-panel/90 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Demo promise</p>
          <h2 className="mt-2 text-2xl font-semibold">
            No one should get lost in the crowd. No case should get lost in the process.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            This guided sequence uses fictional demo data and the Phase 1B service kernel.
          </p>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <p>Online mode: scan a Reunite Point and submit digitally.</p>
            <p>Staff offline mode: queue reports after the app has already loaded.</p>
            <p>No-internet fallback: report the printed Point Code to official staff.</p>
            <p>PA fallback: public announcement support remains available for urgent or unresolved cases.</p>
          </div>
        </article>
      </section>

      {(visibility.showMissingReport || visibility.showFoundReport) && (
        <section className="grid gap-4 md:grid-cols-2">
          {visibility.showMissingReport && missingCase && (
            <CaseSummary title="Looking-for-person report" location={missingCase.lastSeenOrFoundLocation} status={missingCase.status} urgency={missingCase.urgency} />
          )}
          {visibility.showFoundReport && foundCase && (
            <CaseSummary title="Found-person report" location={foundCase.lastSeenOrFoundLocation} status={foundCase.status} urgency={foundCase.urgency} />
          )}
        </section>
      )}

      {visibility.showOfflineQueue && (
        <section className="grid gap-5 lg:grid-cols-2">
          <OfflineQueuePanel
            operations={snapshot.pendingOffline}
            runtimeQueued={visibility.showOfflineQueuedCount ? state.offlineQueuedReports : 0}
          />
          <PAAnnouncementPanel announcements={snapshot.announcements} />
        </section>
      )}

      {visibility.showLeadershipOutcome && (
        <LeadershipAnalyticsPanel summary={snapshot.leadershipAnalytics} />
      )}
    </div>
  );
}

interface StagePanelProps {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel: string;
  onAction(): void;
  href?: string;
}

function StagePanel({ icon: Icon, title, body, actionLabel, onAction, href }: StagePanelProps) {
  return (
    <section className="border border-cyan/35 bg-cyan/10 p-5">
      <Icon className="size-6 text-cyan" aria-hidden="true" />
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{body}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
        >
          {actionLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        {href && (
          <Link
            href={href as Route}
            className="rounded-md border border-cyan/35 px-4 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/10"
          >
            Open route
          </Link>
        )}
      </div>
    </section>
  );
}

interface CaseStageProps {
  title: string;
  body: string;
  status: string;
  urgency: "standard" | "elevated" | "urgent";
  location: string;
  actionLabel: string;
  onAction(): void;
}

function CaseStage({ title, body, status, urgency, location, actionLabel, onAction }: CaseStageProps) {
  return (
    <section className="border border-border bg-panel-strong p-5">
      <div className="flex flex-wrap gap-2">
        <CaseStatusBadge status={status} />
        <PriorityBadge urgency={urgency} />
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 leading-7 text-muted">{body}</p>
      <p className="mt-3 text-sm font-semibold text-cyan">{location}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
      >
        {actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </section>
  );
}

interface OutcomeStageProps {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel: string;
  onAction(): void;
}

function OutcomeStage({ icon: Icon, title, body, actionLabel, onAction }: OutcomeStageProps) {
  return (
    <section className="border border-emerald-400/35 bg-emerald-400/10 p-6">
      <Icon className="size-7 text-emerald-300" aria-hidden="true" />
      <h3 className="mt-3 text-3xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        {actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </section>
  );
}

interface OutcomeNoticeProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

function OutcomeNotice({ icon: Icon, title, body }: OutcomeNoticeProps) {
  return (
    <section className="border border-emerald-400/35 bg-emerald-400/10 p-5">
      <Icon className="size-6 text-emerald-300" aria-hidden="true" />
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{body}</p>
    </section>
  );
}

interface CaseSummaryProps {
  title: string;
  location: string;
  status: string;
  urgency: "standard" | "elevated" | "urgent";
}

function CaseSummary({ title, location, status, urgency }: CaseSummaryProps) {
  return (
    <article className="border border-border bg-panel/90 p-5">
      <div className="flex flex-wrap gap-2">
        <CaseStatusBadge status={status} />
        <PriorityBadge urgency={urgency} />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{location}</p>
    </article>
  );
}
