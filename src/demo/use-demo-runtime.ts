"use client";

import { useEffect, useState } from "react";
import type { ConnectivityStatus } from "../domain/types";
import {
  advanceGuidedDemoStep,
  completeItemReleaseRuntime,
  completePersonHandoverRuntime,
  createInitialGuidedDemoState,
  queueOfflineDemoReport,
  resetGuidedDemoScenario,
  setGuidedDemoConnectivity,
  type GuidedDemoRuntimeState,
  type GuidedDemoStepId
} from "./guided-demo";

const STORAGE_KEY = "reuniterc.phase2a.demo-state";

export function useDemoRuntimeState() {
  const [state, setState] = useState<GuidedDemoRuntimeState>(createInitialGuidedDemoState);

  useEffect(() => {
    const storedState = window.localStorage.getItem(STORAGE_KEY);
    if (!storedState) {
      return;
    }

    try {
      setState(JSON.parse(storedState) as GuidedDemoRuntimeState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    state,
    setConnectivity(connectivityStatus: ConnectivityStatus) {
      setState((current) => setGuidedDemoConnectivity(current, connectivityStatus));
    },
    completeStep(stepId: GuidedDemoStepId) {
      setState((current) => advanceGuidedDemoStep(current, stepId));
    },
    queueOfflineReport() {
      setState(queueOfflineDemoReport);
    },
    completePersonHandover() {
      setState(completePersonHandoverRuntime);
    },
    completeItemRelease() {
      setState(completeItemReleaseRuntime);
    },
    reset() {
      const resetState = resetGuidedDemoScenario();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
      setState(resetState);
    }
  };
}
