"use client";

import { CheckCircle2, LockKeyhole, PackageCheck } from "lucide-react";
import type { ConnectivityStatus } from "../domain/types";
import { ConnectivityBadge } from "./connectivity-badge";

interface ProofOfOwnershipChecklistProps {
  connectivityStatus: ConnectivityStatus;
  completed: boolean;
  onComplete(): void;
}

const checklistItems = [
  "Claimant description matches the lost-item report",
  "Staff-only hidden detail is compatible",
  "Release record and proof notes are captured"
];

export function ProofOfOwnershipChecklist({
  connectivityStatus,
  completed,
  onComplete
}: ProofOfOwnershipChecklistProps) {
  const canComplete = connectivityStatus === "stable" && !completed;

  return (
    <section className="border border-border bg-panel/90 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Verified item release</p>
          <h2 className="mt-2 text-2xl font-semibold">Proof of ownership required before release.</h2>
        </div>
        <ConnectivityBadge status={connectivityStatus} />
      </div>
      <div className="mt-5 grid gap-3">
        {checklistItems.map((item) => (
          <div key={item} className="flex items-center gap-3 border border-cyan/20 bg-cyan/5 p-3">
            <CheckCircle2 className="size-5 text-cyan" aria-hidden="true" />
            <span className="text-sm font-semibold">{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 border border-border bg-panel-strong p-4">
        {completed ? (
          <p className="flex items-center gap-2 font-semibold text-emerald-300">
            <PackageCheck className="size-5" aria-hidden="true" />
            Item Released
          </p>
        ) : connectivityStatus === "degraded" ? (
          <p className="flex items-center gap-2 font-semibold text-amber-soft">
            <LockKeyhole className="size-5" aria-hidden="true" />
            Final release is blocked while offline.
          </p>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            disabled={!canComplete}
            className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete item release
          </button>
        )}
      </div>
    </section>
  );
}
