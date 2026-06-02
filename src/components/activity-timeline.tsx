import { CircleDot } from "lucide-react";
import type { AuditLog } from "../domain/types";
import { formatDateTime, titleCase } from "../lib/format";

interface ActivityTimelineProps {
  auditLogs: AuditLog[];
}

export function ActivityTimeline({ auditLogs }: ActivityTimelineProps) {
  const recentLogs = [...auditLogs]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 7);

  return (
    <section className="border border-border bg-panel/90 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Audit trail</p>
      <h2 className="mt-2 text-2xl font-semibold">Recent activity</h2>
      <div className="mt-5 space-y-4">
        {recentLogs.map((log) => (
          <article key={log.id} className="flex gap-3 border-l border-cyan/30 pl-4">
            <CircleDot className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
            <div>
              <p className="font-semibold">{titleCase(log.action)}</p>
              <p className="mt-1 text-sm text-muted">
                {titleCase(log.entityType)} {log.entityId ? `- ${log.entityId}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted">{formatDateTime(log.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
