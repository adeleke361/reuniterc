import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  Bell,
  FileText,
  MapPinned,
  SearchCheck,
  ShieldCheck,
  SquarePen,
  WifiOff
} from "lucide-react";
import { AppShell } from "../components/app-shell";
import { getDemoScenarioSnapshot } from "../demo/scenario-data";

export default async function Home() {
  const snapshot = await getDemoScenarioSnapshot();
  const arenaPoint = snapshot.reunitePoints.find((point) => point.code === "RP-014");
  const flowCards = [
    {
      title: "Scan a Reunite Point QR",
      body: "Official QR codes open reporting with the Point Code and location context already attached.",
      icon: MapPinned
    },
    {
      title: "Choose what you want to report",
      body: "Attendees and volunteers can report a missing person, found person, lost item, or found item.",
      icon: SquarePen
    },
    {
      title: "Submit the needed details",
      body: "The form captures useful, non-sensitive details and sends the report to the Information Bureau.",
      icon: FileText
    },
    {
      title: "Bureau reviews likely matches",
      body: "ReuniteRC compares new reports with existing cases and shows likely matches for Information Bureau staff to review.",
      icon: SearchCheck
    },
    {
      title: "Staff verify before handover or item release",
      body: "Staff verification is required before any person is reunited or any found item is released.",
      icon: ShieldCheck
    },
    {
      title: "Escalate unresolved cases to PA",
      body: "Urgent cases can be escalated immediately. Unresolved cases can be moved to the PA queue after review.",
      icon: Bell
    }
  ];

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
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
              Digital Information Bureau
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold text-white sm:text-6xl">
              ReuniteRC
            </h1>
            <p className="mt-5 max-w-3xl text-2xl font-semibold leading-9 text-amber-100">
              A Digital Information Bureau for major programmes in Redemption City.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/85">
              ReuniteRC helps attendees and volunteers report missing persons, found persons, lost items, and found
              items through official Reunite Point QR codes. The Information Bureau can then review likely matches,
              verify safely, complete handovers, release items, and escalate unresolved cases to PA when needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={"/report" as Route}
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-blue-950 shadow-lg shadow-blue-950/20 transition hover:bg-amber-100"
              >
                Report at a Reunite Point
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={"/dashboard" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-amber-200/55 px-5 py-3 font-semibold text-amber-100 transition hover:border-amber-100 hover:bg-white/10"
              >
                Information Bureau Dashboard
              </Link>
              <Link
                href={"/reunite-points" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-white/35 px-5 py-3 font-semibold text-white transition hover:border-amber-200 hover:bg-white/10"
              >
                View Reunite Points
              </Link>
              <Link
                href={"/demo" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 font-semibold text-blue-100 transition hover:border-cyan/50 hover:bg-cyan/10 hover:text-white"
              >
                Judge Walkthrough
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border border-white/15 bg-white/[0.07] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Primary Reunite Point</p>
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

      <section className="mt-8 grid gap-5 border border-blue-900/45 bg-[#0a162c]/85 p-6 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Core flow</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">From Reunite Point scan to verified resolution.</h2>
          <p className="mt-4 text-sm leading-6 text-blue-100/75">
            The public side captures reports. The Information Bureau side reviews, verifies, completes handovers or item
            releases, and escalates to PA when review shows more help is needed.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "No facial recognition.",
            "No live public tracking.",
            "No automatic reunion.",
            "No sensitive public case details."
          ].map((rule) => (
            <article key={rule} className="border border-white/10 bg-white/[0.05] p-4">
              <ShieldCheck className="size-5 text-cyan" aria-hidden="true" />
              <p className="mt-3 font-semibold text-white">{rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {flowCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="border border-blue-900/45 bg-[#081426]/85 p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-3xl font-semibold text-amber-200">{index + 1}</p>
                <span className="grid size-10 place-items-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100/75">{card.body}</p>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
