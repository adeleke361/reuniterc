import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "cyan" | "amber" | "emerald" | "red" | "neutral";
  icon?: LucideIcon;
}

const toneClasses = {
  cyan: "border-cyan/35 text-cyan",
  amber: "border-amber/40 text-amber-soft",
  emerald: "border-emerald-400/35 text-emerald-300",
  red: "border-red-400/35 text-red-300",
  neutral: "border-border text-foreground"
};

export function MetricCard({ label, value, detail, tone = "neutral", icon: Icon }: MetricCardProps) {
  return (
    <article className={`border bg-panel/85 p-5 ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        {Icon && (
          <span className="grid size-10 place-items-center rounded-md border border-current/30 bg-current/10">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {detail && <p className="mt-4 text-sm leading-6 text-muted">{detail}</p>}
    </article>
  );
}
