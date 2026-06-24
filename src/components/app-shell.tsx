import Link from "next/link";
import type { Route } from "next";
import { Activity, BarChart3, Bell, ClipboardList, MapPinned, Radar, ShieldCheck, SquarePen } from "lucide-react";
import { EventStatusBar } from "./event-status-bar";

const navItems = [
  { href: "/report", label: "Report", icon: SquarePen },
  { href: "/dashboard", label: "Bureau Dashboard", icon: Activity },
  { href: "/reunite-points", label: "Reunite Points", icon: MapPinned },
  { href: "/matches/person", label: "Person Review", icon: ShieldCheck },
  { href: "/matches/item", label: "Item Review", icon: ClipboardList },
  { href: "/announcements", label: "PA Escalation", icon: Bell },
  { href: "/analytics", label: "Leadership Analytics", icon: BarChart3 },
  { href: "/demo", label: "Judge Walkthrough", icon: Radar }
];

interface AppShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, eyebrow, title, subtitle, actions }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_22%_18%,rgba(20,184,166,0.16),transparent_26rem),radial-gradient(circle_at_84%_12%,rgba(245,158,11,0.08),transparent_22rem),linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[length:auto,auto,48px_48px,48px_48px]" />
      <header className="border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Link href={"/" as Route} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md border border-cyan/40 bg-cyan/10 text-cyan">
              <Radar className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold">ReuniteRC</span>
              <span className="block text-xs text-muted">Digital Information Bureau</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 transition hover:border-cyan/35 hover:bg-cyan/10 hover:text-foreground"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-7">
        <EventStatusBar />
        {(title || subtitle || actions) && (
          <section className="mt-8 flex flex-col gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">
                  {eyebrow}
                </p>
              )}
              {title && <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>}
              {subtitle && <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </section>
        )}
        <div className="py-8">{children}</div>
      </main>
    </div>
  );
}
