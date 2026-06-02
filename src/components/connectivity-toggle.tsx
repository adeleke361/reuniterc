"use client";

import { Wifi, WifiOff } from "lucide-react";
import type { ConnectivityStatus } from "../domain/types";

interface ConnectivityToggleProps {
  value: ConnectivityStatus;
  onChange(value: ConnectivityStatus): void;
}

export function ConnectivityToggle({ value, onChange }: ConnectivityToggleProps) {
  return (
    <div className="inline-grid grid-cols-2 border border-border bg-panel p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("stable")}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 font-semibold transition ${
          value === "stable" ? "bg-emerald-400/15 text-emerald-200" : "text-muted hover:text-foreground"
        }`}
      >
        <Wifi className="size-4" aria-hidden="true" />
        Online
      </button>
      <button
        type="button"
        onClick={() => onChange("degraded")}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 font-semibold transition ${
          value === "degraded" ? "bg-amber/15 text-amber-soft" : "text-muted hover:text-foreground"
        }`}
      >
        <WifiOff className="size-4" aria-hidden="true" />
        Degraded
      </button>
    </div>
  );
}
