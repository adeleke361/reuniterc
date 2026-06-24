"use client";

import { RotateCcw } from "lucide-react";
import { useDemoRuntimeState } from "../demo/use-demo-runtime";

export function ResetDemoButton() {
  const { reset } = useDemoRuntimeState();

  return (
    <button
      type="button"
      onClick={reset}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-panel px-4 py-2 text-sm font-semibold text-muted transition hover:border-cyan/40 hover:text-foreground"
    >
      <RotateCcw className="size-4" aria-hidden="true" />
      Reset walkthrough
    </button>
  );
}
