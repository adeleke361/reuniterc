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
      subtitle="Choose the report type. Sensitive case details go only to authorised Information Bureau staff."
    >
      <section className="mx-auto max-w-3xl border border-blue-900/55 bg-[#071426]/95 p-6 shadow-command-glow md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Reunite Point</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">RP-014</h2>
        <p className="mt-2 text-2xl font-semibold text-blue-100">Arena Rear</p>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-2xl font-semibold text-white">What do you want to report?</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {reportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.label}
                  href={option.href as Route}
                  className="flex min-h-24 items-center gap-4 border border-white/15 bg-white/[0.06] p-4 text-left text-lg font-semibold text-white transition hover:border-cyan/50 hover:bg-cyan/10"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md border border-cyan/30 bg-cyan/10 text-cyan">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
