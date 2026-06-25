import Link from "next/link";
import type { Route } from "next";
import { PackageSearch, Search, UserRoundCheck, UserRoundSearch } from "lucide-react";
import { AppShell } from "../../components/app-shell";

const reportOptions = [
  {
    label: "I am looking for someone",
    href: "/report/person?intent=looking_for_person",
    icon: UserRoundSearch
  },
  {
    label: "I found someone",
    href: "/report/person?intent=found_person",
    icon: UserRoundCheck
  },
  {
    label: "I lost an item",
    href: "/report/item?intent=lost_item",
    icon: Search
  },
  {
    label: "I found an item",
    href: "/report/item?intent=found_item",
    icon: PackageSearch
  }
];

export default function ReportEntryPage() {
  return (
    <AppShell
      eyebrow="Reunite Point"
      title="Report at a Reunite Point"
      subtitle="Choose what happened. The Information Desk will review the report and keep sensitive details private."
      showStatusBar={false}
    >
      <section className="mx-auto max-w-3xl overflow-hidden border border-amber/25 bg-[#f8f3e7] text-blue-950 shadow-command-glow">
        <div className="bg-[#071a33] p-6 text-white md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100">Official Reunite Point</p>
          <h2 className="mt-3 text-5xl font-semibold">RP-014</h2>
          <p className="mt-2 text-2xl font-semibold text-blue-100">Arena Rear</p>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-semibold">What do you want to report?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Please choose one option. Staff will verify before any handover or item release.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {reportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.label}
                  href={option.href as Route}
                  className="flex min-h-24 items-center gap-4 border border-blue-900/15 bg-white p-4 text-left text-lg font-semibold text-blue-950 transition hover:border-amber hover:bg-amber-50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md border border-amber/40 bg-amber/10 text-blue-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {option.label}
                </Link>
              );
            })}
          </div>
          <p className="mt-6 border border-blue-900/15 bg-white p-4 text-sm font-semibold leading-6 text-slate-700">
            Reunite Point QR codes identify the reporting location only. They do not contain names, phone numbers, or
            sensitive case details.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
