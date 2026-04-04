"use client";

import { useCallback, useState } from "react";

import { useNetworkTest } from "@/lib/hooks/useNetworkTest";

import ConnectivityCard from "@/components/looking-glass/ConnectivityCard";
import DownloadsCard from "@/components/looking-glass/DownloadsCard";
import DiagnosticsOutput from "@/components/looking-glass/DiagnosticsOutput";

export default function LookingGlassSection() {
  const [host, setHost] = useState("");
  const [testType, setTestType] = useState("ping");
  const { output, error, isRunning, runTest } = useNetworkTest();

  const handleRun = useCallback(() => runTest(host, testType), [host, testType, runTest]);

  return (
    <section id="looking-glass" className="relative py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ConnectivityCard
            host={host}
            testType={testType}
            isRunning={isRunning}
            onHostChange={setHost}
            onTestTypeChange={setTestType}
            onRun={handleRun}
          />
          <DownloadsCard />
        </div>
        <DiagnosticsOutput
          output={output}
          error={error}
          isRunning={isRunning}
          host={host}
          testType={testType}
        />
      </div>
    </section>
  );
}