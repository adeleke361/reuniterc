"use client";

import { useState } from "react";
import { PackagePlus, Send } from "lucide-react";
import type { ReunitePoint } from "../domain/types";
import { CaseStatusBadge } from "./case-status-badge";

interface ItemReportFormProps {
  points: ReunitePoint[];
}

export function ItemReportForm({ points }: ItemReportFormProps) {
  const [intent, setIntent] = useState<"lost_item" | "found_item">("lost_item");
  const [pointId, setPointId] = useState("point_arena_rear");
  const [submitted, setSubmitted] = useState(false);
  const selectedPoint = points.find((point) => point.id === pointId) ?? points[0];

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
          <h2 className="mt-2 text-3xl font-semibold">Lost-and-found from {selectedPoint?.code ?? "Reunite Point"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Finder and claimant contact details are not exposed to each other.
          </p>
        </div>
        {submitted && <CaseStatusBadge status="report_created" />}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Report intent</span>
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
            <option>bag</option>
            <option>phone</option>
            <option>wallet</option>
            <option>bible_or_book</option>
            <option>id_or_card</option>
            <option>clothing</option>
            <option>other</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Colour or description tags</span>
          <input
            defaultValue={intent === "lost_item" ? "black-bag, notebook-sticker" : "black-bag, notebook-sticker, side-pocket"}
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
            defaultValue="Fictional yellow ribbon on inner zipper"
            className="w-full border border-amber/35 bg-amber/10 px-3 py-3 text-foreground outline-none focus:border-amber"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-soft"
        >
          <Send className="size-4" aria-hidden="true" />
          Submit report
        </button>
        {submitted && (
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <PackagePlus className="size-4" aria-hidden="true" />
            Fictional item report ready for Information Bureau review.
          </p>
        )}
      </div>
    </form>
  );
}
