import { FileCheck2 } from "lucide-react";

export function DemoEnvironmentBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/35 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100">
      <FileCheck2 className="size-3.5" aria-hidden="true" />
      Sample records
    </span>
  );
}
