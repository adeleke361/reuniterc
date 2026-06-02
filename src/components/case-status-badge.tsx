import { titleCase } from "../lib/format";

interface CaseStatusBadgeProps {
  status: string;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  const tone =
    status === "safely_reunited" || status === "item_released"
      ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
      : status === "pending_sync" || status.includes("suggested") || status.includes("confirmed")
        ? "border-amber/40 bg-amber/10 text-amber-soft"
        : "border-cyan/35 bg-cyan/10 text-cyan";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {titleCase(status)}
    </span>
  );
}
