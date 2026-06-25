"use client";

import { useState } from "react";
import { Send, UserRoundCheck } from "lucide-react";
import type { ReunitePoint } from "../domain/types";
import { CaseStatusBadge } from "./case-status-badge";

type PersonReportIntent = "looking_for_person" | "found_person";

interface PersonReportFormProps {
  points: ReunitePoint[];
  initialIntent?: PersonReportIntent;
}

export function PersonReportForm({ points, initialIntent = "looking_for_person" }: PersonReportFormProps) {
  const [intent, setIntent] = useState<PersonReportIntent>(initialIntent);
  const [pointId, setPointId] = useState("point_arena_rear");
  const [submitted, setSubmitted] = useState(false);
  const selectedPoint = points.find((point) => point.id === pointId) ?? points[0];
  const heading = intent === "looking_for_person" ? "Report a Missing Person" : "Report a Found Person";

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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Person report</p>
          <h2 className="mt-2 text-3xl font-semibold">{heading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Reunite Point {selectedPoint?.code ?? ""} gives the Information Desk the reporting location. Sensitive
            notes remain staff-only.
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
            <option value="looking_for_person">I am looking for someone</option>
            <option value="found_person">I found someone</option>
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
          <span className="text-sm font-semibold text-muted">Person category</span>
          <select className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan">
            <option>Child</option>
            <option>Elderly attendee</option>
            <option>Vulnerable attendee</option>
            <option>Group member</option>
            <option>Adult attendee</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Approximate age band</span>
          <select className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan">
            <option>6-8</option>
            <option>0-5</option>
            <option>9-12</option>
            <option>13-17</option>
            <option>18-59</option>
            <option>60+</option>
            <option>unknown</option>
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Last seen or found location</span>
          <input
            key={pointId}
            defaultValue={selectedPoint?.locationLabel}
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Group or church reference</span>
          <input
            placeholder="Province, parish, group, seat area, or leader reference"
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Non-sensitive description</span>
          <input
            placeholder="Clothing colour, age band, group marker, or other non-sensitive detail"
            className="w-full border border-border bg-panel-strong px-3 py-3 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Reporter reference for staff follow-up</span>
          <input
            placeholder="Name or reference to help the Information Desk verify safely"
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
          Submit to Information Desk
        </button>
        {submitted && (
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <UserRoundCheck className="size-4" aria-hidden="true" />
            Report sent to the Information Desk for review.
          </p>
        )}
      </div>
    </form>
  );
}
