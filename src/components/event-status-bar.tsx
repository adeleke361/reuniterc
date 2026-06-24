import { CalendarClock, MapPin, RadioTower } from "lucide-react";
import { DemoEnvironmentBadge } from "./demo-environment-badge";
import { ConnectivityBadge } from "./connectivity-badge";

export function EventStatusBar() {
  return (
    <section className="grid gap-3 border border-border bg-panel/80 p-4 shadow-command-glow md:grid-cols-4">
      <div className="flex items-center gap-3">
        <CalendarClock className="size-5 text-cyan" aria-hidden="true" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Active programme</p>
          <p className="font-semibold">Redemption City Major Programme</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <MapPin className="size-5 text-teal" aria-hidden="true" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Primary point</p>
          <p className="font-semibold">RP-014 Arena Rear</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <RadioTower className="size-5 text-amber" aria-hidden="true" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Fallback</p>
          <p className="font-semibold">Verification + PA queue</p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:justify-end">
        <DemoEnvironmentBadge />
        <ConnectivityBadge status="stable" />
      </div>
    </section>
  );
}
