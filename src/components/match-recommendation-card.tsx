import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import type { MatchReason } from "../domain/types";
import { titleCase } from "../lib/format";

interface MatchRecommendationCardProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  score: number;
  tier: string;
  reasons: MatchReason[];
  footer: string;
  actionHref?: string;
  actionLabel?: string;
}

export function MatchRecommendationCard({
  title,
  leftLabel,
  rightLabel,
  score,
  tier,
  reasons,
  footer,
  actionHref,
  actionLabel = "Open workflow"
}: MatchRecommendationCardProps) {
  const strong = score >= 80;

  return (
    <article className="border border-border bg-panel/90 p-5 shadow-command-glow">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{title}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-lg font-semibold">
            <span>{leftLabel}</span>
            <ArrowRight className="size-5 text-muted" aria-hidden="true" />
            <span>{rightLabel}</span>
          </div>
        </div>
        <div className="min-w-[150px] border border-cyan/35 bg-cyan/10 p-4 text-center">
          <p className="text-4xl font-semibold text-cyan">{score}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {titleCase(tier)}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reasons.map((reason) => (
          <div
            key={`${reason.code}-${reason.label}`}
            className={`border p-3 ${
              reason.staffOnly
                ? "border-amber/35 bg-amber/10"
                : reason.points > 0
                  ? "border-cyan/25 bg-cyan/5"
                  : "border-border bg-panel-strong"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{reason.label}</p>
              <span className="text-sm font-semibold text-cyan">{reason.points > 0 ? `+${reason.points}` : "Required"}</span>
            </div>
            {reason.staffOnly && <p className="mt-2 text-xs text-amber-soft">Staff-only verification detail</p>}
          </div>
        ))}
      </div>
      <div
        className={`mt-5 flex flex-col gap-3 border p-4 md:flex-row md:items-center md:justify-between ${
          strong ? "border-emerald-400/35 bg-emerald-400/10" : "border-amber/40 bg-amber/10"
        }`}
      >
        <p className="flex items-center gap-2 text-sm font-semibold">
          {strong ? <CheckCircle2 className="size-4 text-emerald-300" /> : <ShieldAlert className="size-4 text-amber-soft" />}
          {footer}
        </p>
        {actionHref && (
          <a
            href={actionHref}
            className="inline-flex items-center justify-center rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </article>
  );
}
