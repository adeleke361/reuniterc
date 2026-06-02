import { BarChart3, MapPinned, TrendingUp, Users } from "lucide-react";
import type { DashboardSummary } from "../domain/types";
import { formatMinutes } from "../lib/format";
import { MetricCard } from "./metric-card";

interface LeadershipAnalyticsPanelProps {
  summary: DashboardSummary;
}

export function LeadershipAnalyticsPanel({ summary }: LeadershipAnalyticsPanelProps) {
  const totalReports = summary.personReportsTotal + summary.itemReportsTotal;
  const medianResponse = Math.round(
    ((summary.medianReunionMinutes ?? 0) + (summary.medianItemReleaseMinutes ?? 0)) /
      ((summary.medianReunionMinutes === null ? 0 : 1) + (summary.medianItemReleaseMinutes === null ? 0 : 1) || 1)
  );

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total reports" value={totalReports} detail="Person and item reports" tone="cyan" icon={BarChart3} />
        <MetricCard label="Safely reunited" value={summary.safelyReunitedTotal} detail={formatMinutes(summary.medianReunionMinutes)} tone="emerald" icon={Users} />
        <MetricCard label="Items released" value={summary.releasedItemsTotal} detail={formatMinutes(summary.medianItemReleaseMinutes)} tone="emerald" icon={TrendingUp} />
        <MetricCard label="PA escalation rate" value={`${summary.paEscalations}/${totalReports}`} detail="Fallback only" tone="amber" icon={MapPinned} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border border-border bg-panel/90 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Frequent Reunite Points</p>
          <div className="mt-5 space-y-3">
            {summary.hotspots.map((hotspot) => (
              <div key={hotspot.locationLabel} className="flex items-center justify-between border border-border bg-panel-strong p-3">
                <span className="font-semibold">{hotspot.locationLabel}</span>
                <span className="text-cyan">{hotspot.reportCount} reports</span>
              </div>
            ))}
          </div>
        </article>
        <article className="border border-amber/35 bg-amber/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">Operational recommendation</p>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            Add temporary volunteer coverage near Arena Rear during closing periods.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Median response indicator: {medianResponse} min. Offline sync count: {summary.offlineReportsPendingSync}.
          </p>
        </article>
      </div>
    </section>
  );
}
