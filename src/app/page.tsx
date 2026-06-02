import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Bell, MapPinned, ShieldCheck, WifiOff } from "lucide-react";
import { AppShell } from "../components/app-shell";
import { DemoEnvironmentBadge } from "../components/demo-environment-badge";
import { getDemoScenarioSnapshot } from "../demo/scenario-data";

export default async function Home() {
  const snapshot = await getDemoScenarioSnapshot();
  const arenaPoint = snapshot.reunitePoints.find((point) => point.code === "RP-014");

  return (
    <AppShell>
      <section className="relative overflow-hidden border border-border bg-panel/80 p-6 shadow-command-glow md:p-10">
        <div className="absolute inset-0 opacity-60">
          <div className="grid h-full grid-cols-6 grid-rows-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="border border-cyan/5" />
            ))}
          </div>
        </div>
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <DemoEnvironmentBadge />
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold sm:text-6xl">
              ReuniteRC
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
              Digital Reunification and Lost-and-Found solution for Major Programmes in Redemption City.
            </p>
            <p className="mt-4 max-w-3xl text-2xl font-semibold leading-9 text-cyan">
              No one should get lost in the crowd. No case should get lost in the process.
            </p>
            <p className="mt-5 max-w-3xl leading-7 text-muted">
              Official Reunite Points turn trusted camp locations into structured reporting points while the
              Information Bureau manages matching, verification, release and PA fallback.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={"/demo" as Route}
                className="inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-soft"
              >
                Launch guided demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={"/reunite-points" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-cyan/40 px-5 py-3 font-semibold text-cyan transition hover:bg-cyan/10"
              >
                View RP-014 poster
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border border-cyan/35 bg-cyan/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Primary demo point</p>
                  <h2 className="mt-2 text-3xl font-semibold">{arenaPoint?.code} Arena Rear</h2>
                </div>
                <MapPinned className="size-9 text-cyan" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{arenaPoint?.fallbackInstruction}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-border bg-panel-strong p-4">
                <ShieldCheck className="size-5 text-emerald-300" aria-hidden="true" />
                <p className="mt-3 font-semibold">Verified handover</p>
              </div>
              <div className="border border-border bg-panel-strong p-4">
                <WifiOff className="size-5 text-amber-soft" aria-hidden="true" />
                <p className="mt-3 font-semibold">Offline queue</p>
              </div>
              <div className="border border-border bg-panel-strong p-4">
                <Bell className="size-5 text-amber-soft" aria-hidden="true" />
                <p className="mt-3 font-semibold">PA fallback</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["1", "Report missing or found persons"],
          ["2", "Match with transparent rules"],
          ["3", "Verify reunion or item release"],
          ["4", "Measure aggregate outcomes"]
        ].map(([number, label]) => (
          <article key={number} className="border border-border bg-panel/80 p-5">
            <p className="text-3xl font-semibold text-cyan">{number}</p>
            <p className="mt-3 font-semibold">{label}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
