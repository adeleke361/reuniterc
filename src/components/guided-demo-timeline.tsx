import Link from "next/link";
import type { Route } from "next";
import { CheckCircle2, CircleDot } from "lucide-react";
import { guidedDemoSteps, type GuidedDemoRuntimeState } from "../demo/guided-demo";

interface GuidedDemoTimelineProps {
  state?: GuidedDemoRuntimeState;
}

export function GuidedDemoTimeline({ state }: GuidedDemoTimelineProps) {
  const activeStepIndex = state?.activeStepIndex ?? 0;
  const completed = new Set(state?.completedStepIds ?? []);

  return (
    <section className="border border-border bg-panel/85 p-4">
      <div className="grid gap-3 md:grid-cols-5">
        {guidedDemoSteps.map((step, index) => {
          const done = completed.has(step.id);
          const active = index === activeStepIndex;
          const revealed = done || index <= activeStepIndex;
          const Icon = done ? CheckCircle2 : CircleDot;
          const className = `min-h-[112px] border p-3 transition ${
            active
              ? "border-cyan bg-cyan/10 text-foreground"
              : done
                ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-100"
                : "border-border bg-panel-strong/70 text-muted"
          }`;
          const content = (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Step {index + 1}</span>
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <p className="mt-3 font-semibold">{revealed ? step.label : "Upcoming step"}</p>
              <p className="mt-2 text-xs leading-5 text-muted">
                {revealed ? step.summary : "Stage details unlock as the guided demo progresses."}
              </p>
            </>
          );

          if (!revealed) {
            return (
              <article key={step.id} className={className}>
                {content}
              </article>
            );
          }

          return (
            <Link
              key={step.id}
              href={step.route as Route}
              className={`${className} hover:border-cyan/40 hover:text-foreground`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
