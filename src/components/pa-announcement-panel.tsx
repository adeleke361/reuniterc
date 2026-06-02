import { BellRing } from "lucide-react";
import type { AnnouncementEscalation } from "../domain/types";
import { formatDateTime, titleCase } from "../lib/format";

interface PAAnnouncementPanelProps {
  announcements: AnnouncementEscalation[];
}

export function PAAnnouncementPanel({ announcements }: PAAnnouncementPanelProps) {
  return (
    <section className="border border-border bg-panel/90 p-5">
      <div className="flex items-center gap-3">
        <BellRing className="size-5 text-amber-soft" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">PA fallback</p>
          <h2 className="text-2xl font-semibold">Announcement queue</h2>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {announcements.map((announcement) => (
          <article key={announcement.id} className="border border-amber/30 bg-amber/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">{titleCase(announcement.caseKind)}</p>
              <span className="rounded-full border border-amber/40 px-3 py-1 text-xs font-semibold text-amber-soft">
                {titleCase(announcement.status)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{announcement.announcementText}</p>
            <p className="mt-3 text-xs text-muted">Requested {formatDateTime(announcement.requestedAt)}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 border border-border bg-panel-strong p-3 text-sm font-semibold text-muted">
        PA escalation supports urgent or unresolved cases. It does not automatically resolve any person or item case.
      </p>
    </section>
  );
}
