"use client";

import type { ItemCase, ItemMatchRecommendation } from "../domain/types";
import { useDemoRuntimeState } from "../demo/use-demo-runtime";
import { titleCase } from "../lib/format";
import { CaseStatusBadge } from "./case-status-badge";
import { ConnectivityToggle } from "./connectivity-toggle";
import { ProofOfOwnershipChecklist } from "./proof-of-ownership-checklist";

interface ItemReleaseWorkflowProps {
  match: ItemMatchRecommendation;
  lostItemCase: ItemCase;
  foundItemCase: ItemCase;
}

export function ItemReleaseWorkflow({
  match,
  lostItemCase,
  foundItemCase
}: ItemReleaseWorkflowProps) {
  const { state, setConnectivity, completeItemRelease } = useDemoRuntimeState();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-border bg-panel/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Lost item</p>
          <h2 className="mt-2 text-xl font-semibold">{titleCase(lostItemCase.itemCategory)}</h2>
          <p className="mt-2 text-sm text-muted">{lostItemCase.lastSeenOrFoundLocation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CaseStatusBadge status={state.itemReleaseCompleted ? "item_released" : lostItemCase.status} />
          </div>
        </article>
        <article className="border border-border bg-panel/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Found item</p>
          <h2 className="mt-2 text-xl font-semibold">{titleCase(foundItemCase.itemCategory)}</h2>
          <p className="mt-2 text-sm text-muted">{foundItemCase.lastSeenOrFoundLocation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CaseStatusBadge status={state.itemReleaseCompleted ? "item_released" : foundItemCase.status} />
          </div>
        </article>
        <article className="border border-cyan/35 bg-cyan/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Confirmed match</p>
          <p className="mt-2 text-4xl font-semibold text-cyan">{match.score}</p>
          <p className="mt-2 text-sm text-muted">{titleCase(match.tier)}</p>
        </article>
      </section>
      <section className="border border-border bg-panel/90 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">Connectivity guard</p>
        <div className="mt-4">
          <ConnectivityToggle value={state.connectivityStatus} onChange={setConnectivity} />
        </div>
      </section>
      <ProofOfOwnershipChecklist
        connectivityStatus={state.connectivityStatus}
        completed={state.itemReleaseCompleted}
        onComplete={completeItemRelease}
      />
    </div>
  );
}
