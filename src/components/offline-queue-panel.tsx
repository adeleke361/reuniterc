import { CloudUpload, WifiOff } from "lucide-react";
import type { OfflineSyncOperation } from "../domain/types";
import { formatDateTime, titleCase } from "../lib/format";

interface OfflineQueuePanelProps {
  operations: OfflineSyncOperation[];
  runtimeQueued?: number;
}

export function OfflineQueuePanel({ operations, runtimeQueued = 0 }: OfflineQueuePanelProps) {
  const totalQueued = operations.length + runtimeQueued;

  return (
    <section className="border border-border bg-panel/90 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <WifiOff className="size-5 text-amber-soft" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">Staff offline mode</p>
            <h2 className="text-2xl font-semibold">Queued reports</h2>
          </div>
        </div>
        <div className="border border-amber/40 bg-amber/10 px-4 py-2 text-xl font-semibold text-amber-soft">
          {totalQueued}
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {operations.map((operation) => (
          <article key={operation.id} className="border border-border bg-panel-strong p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">{titleCase(operation.operationType)}</p>
              <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber-soft">
                {titleCase(operation.status)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">Queued {formatDateTime(operation.createdAt)}</p>
          </article>
        ))}
        {runtimeQueued > 0 && (
          <article className="border border-amber/40 bg-amber/10 p-4">
            <p className="flex items-center gap-2 font-semibold text-amber-soft">
              <CloudUpload className="size-4" aria-hidden="true" />
              {runtimeQueued} runtime report{runtimeQueued === 1 ? "" : "s"} waiting for sync
            </p>
          </article>
        )}
      </div>
      <p className="mt-4 border border-border bg-panel-strong p-3 text-sm font-semibold text-muted">
        Offline can queue reports, but final match confirmation, handover, and item release require stable connectivity.
      </p>
    </section>
  );
}
