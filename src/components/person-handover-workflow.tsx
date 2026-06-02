"use client";

import type { PersonCase, PersonMatchRecommendation } from "../domain/types";
import { useDemoRuntimeState } from "../demo/use-demo-runtime";
import { titleCase } from "../lib/format";
import { CaseStatusBadge } from "./case-status-badge";
import { ConnectivityToggle } from "./connectivity-toggle";
import { VerificationChecklist } from "./verification-checklist";

interface PersonHandoverWorkflowProps {
  match: PersonMatchRecommendation;
  lookingCase: PersonCase;
  foundCase: PersonCase;
}

export function PersonHandoverWorkflow({
  match,
  lookingCase,
  foundCase
}: PersonHandoverWorkflowProps) {
  const { state, setConnectivity, completePersonHandover } = useDemoRuntimeState();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-border bg-panel/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Looking report</p>
          <h2 className="mt-2 text-xl font-semibold">{titleCase(lookingCase.personCategory)}</h2>
          <p className="mt-2 text-sm text-muted">{lookingCase.lastSeenOrFoundLocation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CaseStatusBadge status={state.personHandoverCompleted ? "safely_reunited" : lookingCase.status} />
          </div>
        </article>
        <article className="border border-border bg-panel/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Found report</p>
          <h2 className="mt-2 text-xl font-semibold">{titleCase(foundCase.personCategory)}</h2>
          <p className="mt-2 text-sm text-muted">{foundCase.lastSeenOrFoundLocation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CaseStatusBadge status={state.personHandoverCompleted ? "safely_reunited" : foundCase.status} />
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
      <VerificationChecklist
        connectivityStatus={state.connectivityStatus}
        completed={state.personHandoverCompleted}
        onComplete={completePersonHandover}
      />
    </div>
  );
}
