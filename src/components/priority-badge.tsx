import type { Urgency } from "../domain/types";

interface PriorityBadgeProps {
  urgency: Urgency;
}

export function PriorityBadge({ urgency }: PriorityBadgeProps) {
  const tone =
    urgency === "urgent"
      ? "border-red-400/35 bg-red-400/10 text-red-300"
      : urgency === "elevated"
        ? "border-amber/40 bg-amber/10 text-amber-soft"
        : "border-teal/35 bg-teal/10 text-teal-soft";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {urgency === "urgent" ? "Urgent" : urgency === "elevated" ? "Elevated" : "Standard"}
    </span>
  );
}
