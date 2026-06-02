import { Wifi, WifiOff } from "lucide-react";
import type { ConnectivityStatus } from "../domain/types";

interface ConnectivityBadgeProps {
  status: ConnectivityStatus;
}

export function ConnectivityBadge({ status }: ConnectivityBadgeProps) {
  const stable = status === "stable";
  const Icon = stable ? Wifi : WifiOff;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        stable
          ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
          : "border-amber/40 bg-amber/10 text-amber-soft"
      }`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {stable ? "Online" : "Degraded"}
    </span>
  );
}
