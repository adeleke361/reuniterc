import Link from "next/link";
import type { Route } from "next";
import { Activity, CircleHelp, MapPinned, Radar, SquarePen } from "lucide-react";
import { EventStatusBar } from "./event-status-bar";

const navItems = [
  { href: "/report", label: "Report", icon: SquarePen },
  { href: "/reunite-points", label: "Reunite Points", icon: MapPinned },
  { href: "/#how-it-works", label: "How It Works", icon: CircleHelp },
  { href: "/dashboard", label: "Staff Dashboard", icon: Activity },
  { href: "/demo", label: "Judge Walkthrough", icon: Radar }
];

interface AppShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showStatusBar?: boolean;
}

export function AppShell({ children, eyebrow, title, subtitle, actions, showStatusBar = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(248,246,238,0.04),transparent_18rem)]" />
      <header className="border-b border-white/10 bg-[#06172d]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href={"/" as Route} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md border border-amber/50 bg-white/10 text-amber-soft">
              <Radar className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold">ReuniteRC</span>
              <span className="block text-xs text-blue-100/75">Redemption City event support</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-blue-100/75">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 transition hover:border-amber/45 hover:bg-white/10 hover:text-white"
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
        {showStatusBar && <EventStatusBar />}
        {(title || subtitle || actions) && (
          <section className={`${showStatusBar ? "mt-8" : ""} flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between`}>
            <div className="max-w-4xl">
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-soft">
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
