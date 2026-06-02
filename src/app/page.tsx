import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Bell, HeartHandshake, MapPinned, ShieldCheck, Users, WifiOff } from "lucide-react";
import { AppShell } from "../components/app-shell";
import { DemoEnvironmentBadge } from "../components/demo-environment-badge";
import { getDemoScenarioSnapshot } from "../demo/scenario-data";

export default async function Home() {
  const snapshot = await getDemoScenarioSnapshot();
  const arenaPoint = snapshot.reunitePoints.find((point) => point.code === "RP-014");

  return (
    <AppShell>
      <section className="relative overflow-hidden border border-blue-900/70 bg-[#07142b] p-6 shadow-[0_24px_80px_rgba(7,20,43,0.45)] md:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-white to-blue-700" />
        <div className="absolute inset-0 opacity-70">
          <div className="grid h-full grid-cols-6 grid-rows-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="border border-white/5" />
            ))}
          </div>
        </div>
        <div className="absolute -right-20 top-12 h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />
        <div className="absolute bottom-0 left-8 h-40 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <DemoEnvironmentBadge />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
              Information Bureau support layer for Redemption City
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold text-white sm:text-6xl">
              ReuniteRC
            </h1>
            <p className="mt-5 max-w-3xl text-2xl font-semibold leading-9 text-amber-100">
              No one should get lost in the crowd. No case should get lost in the process.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/85">
              A calm, structured support layer for families, volunteers and the Information Bureau during major
              programmes, using official Reunite Points to keep every fictional demo case captured and cared for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={"/demo" as Route}
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-blue-950 shadow-lg shadow-blue-950/20 transition hover:bg-amber-100"
              >
                Start guided demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={"/reunite-points" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-white/35 px-5 py-3 font-semibold text-white transition hover:border-amber-200 hover:bg-white/10"
              >
                View Reunite Point poster
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border border-white/15 bg-white/[0.07] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Primary demo point</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{arenaPoint?.code} Arena Rear</h2>
                </div>
                <MapPinned className="size-9 text-red-300" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-6 text-blue-100/80">{arenaPoint?.fallbackInstruction}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-white/15 bg-white/[0.06] p-4">
                <ShieldCheck className="size-5 text-green-300" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">Verified handover</p>
              </div>
              <div className="border border-white/15 bg-white/[0.06] p-4">
                <WifiOff className="size-5 text-amber-200" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">Offline queue</p>
              </div>
              <div className="border border-white/15 bg-white/[0.06] p-4">
                <Bell className="size-5 text-red-300" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">PA fallback</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 border border-blue-900/45 bg-[#0a162c]/85 p-6 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Mission</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Built for care in a crowded programme environment.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="border border-white/10 bg-white/[0.05] p-4">
            <HeartHandshake className="size-6 text-red-300" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-white">Families stay supported</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              Reports are captured with context, then handled by authorised staff with verification before closure.
            </p>
          </article>
          <article className="border border-white/10 bg-white/[0.05] p-4">
            <Users className="size-6 text-amber-200" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-white">Volunteers stay aligned</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              Reunite Points give helpers a simple location code and fallback instruction when connectivity is uneven.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["1", "Receive the report with care"],
          ["2", "Suggest a transparent match"],
          ["3", "Verify before handover or release"],
          ["4", "Share aggregate outcomes"]
        ].map(([number, label]) => (
          <article key={number} className="border border-blue-900/45 bg-[#081426]/85 p-5">
            <p className="text-3xl font-semibold text-amber-200">{number}</p>
            <p className="mt-3 font-semibold text-white">{label}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
