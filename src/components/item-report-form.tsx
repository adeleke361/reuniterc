"use client";

import { useState } from "react";
import { PackagePlus, Send } from "lucide-react";
import type { ReunitePoint } from "../domain/types";
import { CaseStatusBadge } from "./case-status-badge";

type ItemReportIntent = "lost_item" | "found_item";

interface ItemReportFormProps {
  points: ReunitePoint[];
  initialIntent?: ItemReportIntent;
}

export function ItemReportForm({ points, initialIntent = "lost_item" }: ItemReportFormProps) {
  const [intent, setIntent] = useState<ItemReportIntent>(initialIntent);
  const [pointId, setPointId] = useState("point_arena_rear");
  const [submitted, setSubmitted] = useState(false);
  const selectedPoint = points.find((point) => point.id === pointId) ?? points[0];
  const heading = intent === "lost_item" ? "Report a Lost Item" : "Report a Found Item";

  return (
    <form
      className="border border-border bg-panel/90 p-6 shadow-command-glow"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Item report</p>
          <h2 className="mt-2 text-3xl font-semibold">{heading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Reunite Point {selectedPoint?.code ?? ""} gives the Information Bureau the reporting location. Finder and
            claimant contact details are not exposed to each other.
          </p>
        </div>
        {submitted && <CaseStatusBadge status="report_created" />}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Report type</span>
          <select
            value={intent}
            onChange={(event) => setIntent(event.target.value as typeof intent)}
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          >
            <option value="lost_item">I lost an item</option>
            <option value="found_item">I found an item</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Reunite Point</span>
          <select
            value={pointId}
            onChange={(event) => setPointId(event.target.value)}
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          >
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.code} - {point.zone}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Item category</span>
          <select className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan">
            <option>Bag</option>
            <option>Phone</option>
            <option>Wallet</option>
            <option>Bible or book</option>
            <option>ID or card</option>
            <option>Clothing</option>
            <option>Other</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Colour or description tags</span>
          <input
            placeholder="Colour, item type, visible mark, or where it was seen"
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Last seen or found location</span>
          <input
            key={pointId}
            defaultValue={selectedPoint?.locationLabel}
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Hidden verification detail</span>
          <input
            placeholder="Detail only the owner or claimant should know"
            className="w-full border border-amber/35 bg-amber/10 px-3 py-3 text-foreground outline-none focus:border-amber"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Reporter reference for staff follow-up</span>
          <input
            placeholder="Name or reference for Information Bureau verification"
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
        >
          <Send className="size-4" aria-hidden="true" />
          Submit to Information Bureau
        </button>
        {submitted && (
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <PackagePlus className="size-4" aria-hidden="true" />
            Item report sent to the Information Bureau for review.
          </p>
        )}
      </div>
    </form>
  );
}
