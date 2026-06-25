import Link from "next/link";
import Image from "next/image";
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
      body: "Official posters around Redemption City open the right reporting page with the Point Code attached.",
      icon: MapPinned
    },
    {
      title: "Choose what you want to report",
      body: "Attendees and volunteers can report a missing person, found person, lost item, or found item.",
      icon: SquarePen
    },
    {
      title: "Submit the needed details",
      body: "The form captures useful details and sends the report to the Information Desk for review.",
      icon: FileText
    },
    {
      title: "Staff review likely matches",
      body: "ReuniteRC compares reports and shows likely matches for staff to review.",
      icon: SearchCheck
    },
    {
      title: "Staff verify before handover or item release",
      body: "Staff verification is required before any person is reunited or any found item is released.",
      icon: ShieldCheck
    },
    {
      title: "Prepare PA announcement if unresolved",
      body: "The Information Desk can prepare unresolved cases for PA announcement after review.",
      icon: Bell
    }
  ];

  return (
    <AppShell showStatusBar={false}>
      <section className="relative min-h-[620px] overflow-hidden border border-white/10 bg-[#071a33] shadow-command-glow">
        <Image
          src="/images/redemption-arena.png"
          alt="Redemption City programme arena"
          fill
          priority
          sizes="(min-width: 1024px) 1180px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06172d]/95 via-[#06172d]/82 to-[#06172d]/35" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#071a33] to-transparent" />
        <div className="relative flex min-h-[620px] flex-col justify-end p-6 md:p-10">
          <div className="max-w-4xl border border-white/10 bg-[#06172d]/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100">
              ReuniteRC for Redemption City
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Helping families find each other faster during big programmes.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">
              Report missing people, found people, lost items, and found items from official Reunite Point QR posters
              around Redemption City. The Information Desk reviews likely matches, verifies safely, and helps resolve
              each case.
            </p>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-amber-100">
              No one should get lost in the crowd. No case should get lost in the process.
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
                className="inline-flex items-center gap-2 rounded-md border border-amber-100/70 px-5 py-3 font-semibold text-amber-50 transition hover:bg-white/10"
              >
                Staff Dashboard
              </Link>
              <Link
                href={"/reunite-points" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                View Reunite Points
              </Link>
              <Link
                href={"/demo" as Route}
                className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 font-semibold text-blue-50 transition hover:bg-white/10"
              >
                Judge Walkthrough
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden border border-amber/25 bg-[#f8f3e7] text-blue-950">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[300px]">
            <Image
              src="/images/redemption-scale.png"
              alt="Large Redemption City crowd"
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a5d12]">Why it matters</p>
            <h2 className="mt-3 text-3xl font-semibold">Big crowds need simple reporting and careful follow-up.</h2>
            <p className="mt-4 leading-7 text-slate-700">
              During major programmes, a small delay can make a family anxious. ReuniteRC gives attendees, volunteers,
              and the Information Desk one clear way to capture reports, compare them, and resolve them safely.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "No facial recognition.",
                "No live public tracking.",
                "No automatic reunion.",
                "No sensitive public case details."
              ].map((rule) => (
                <div key={rule} className="border border-amber/30 bg-white p-4 font-semibold text-blue-950">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mt-8 grid scroll-mt-24 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {flowCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="border border-white/10 bg-white/[0.07] p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-3xl font-semibold text-amber-soft">{index + 1}</p>
                <span className="grid size-10 place-items-center rounded-md border border-amber/30 bg-white/10 text-amber-soft">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100/75">{card.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 overflow-hidden border border-white/10 bg-[#0f2748]">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-soft">Built for Redemption City</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Reunite Points point to a place, not a person.</h2>
            <p className="mt-4 leading-7 text-blue-100/80">
              Each poster gives the Information Desk the reporting location. If network service is poor, the printed
              Point Code still helps an official volunteer or usher direct the case to the right desk.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.06] p-4">
                <MapPinned className="size-5 text-amber-soft" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">{arenaPoint?.code} Arena Rear</p>
              </div>
              <div className="border border-white/10 bg-white/[0.06] p-4">
                <WifiOff className="size-5 text-amber-soft" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">Offline can queue reports</p>
              </div>
              <div className="border border-white/10 bg-white/[0.06] p-4">
                <ShieldCheck className="size-5 text-green-300" aria-hidden="true" />
                <p className="mt-3 font-semibold text-white">Final actions need stable connectivity</p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[320px]">
            <Image
              src="/images/redemption-location.png"
              alt="Redemption City location and access area"
              fill
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
