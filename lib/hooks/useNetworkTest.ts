"use client";

import { useState, useCallback } from "react";

type TestState = {
  output: string | null;
  error: string | null;
  isRunning: boolean;
};

export function useNetworkTest() {
  const [state, setState] = useState<TestState>({
    output: null,
    error: null,
    isRunning: false,
  });

  const runTest = useCallback(async (host: string, testType: string) => {
    if (!host) return;
    setState({ output: null, error: null, isRunning: true });

    try {
      const res = await fetch("/api/network-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, testType }),
      });

      const data: { output?: string; error?: string } = await res.json();

      if (!res.ok || data.error) {
        setState(s => ({ ...s, error: data.error ?? "Unknown error" }));
      } else {
        setState(s => ({ ...s, output: data.output ?? null }));
      }
    } catch {
      setState(s => ({ ...s, error: "Failed to reach the server." }));
    } finally {
      setState(s => ({ ...s, isRunning: false }));
    }
  }, []);

  return { ...state, runTest };
}