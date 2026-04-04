"use client";

import { useTranslations } from "next-intl";
import { Terminal, CircleAlert } from "lucide-react";

type TestStatus = "running" | "error" | "done" | "ready";

function getTestStatus(isRunning: boolean, error: string | null, output: string | null): TestStatus {
  if (isRunning) return "running";
  if (error)     return "error";
  if (output)    return "done";
  return          "ready";
}

const STATUS_COLOR: Record<TestStatus, string> = {
  running: "bg-accent animate-pulse",
  error:   "bg-red-500/70",
  done:    "bg-green-500/50",
  ready:   "bg-foreground/20",
};

type Props = {
  output: string | null;
  error: string | null;
  isRunning: boolean;
  host: string;
  testType: string;
};

export default function DiagnosticsOutput({ output, error, isRunning, host, testType }: Props) {
  const t = useTranslations("looking_glass");
  const status = getTestStatus(isRunning, error, output);

  return (
    <div className="animate-slide-up delay-400">
      <div className="card-dashboard overflow-hidden">
        <div className="flex items-center justify-between p-8 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
              <Terminal size={22} />
            </div>
            <h2 className="text-xl font-black tracking-tight">{t("output")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${STATUS_COLOR[status]}`} />
            <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
              {t(status)}
            </span>
          </div>
        </div>

        <div className="p-8 font-mono text-sm min-h-[280px] text-foreground/50 leading-relaxed overflow-x-auto whitespace-pre">
          {!output && !error && !isRunning && (
            <p className="text-foreground/20 italic select-none">{t("waiting")}</p>
          )}
          {isRunning && (
            <p className="text-foreground/40">
              <span className="text-accent">$</span> {testType} {host}
              <span className="animate-typing-cursor border-r-2 ml-1"> </span>
            </p>
          )}
          {error && (
            <div className="flex items-start gap-3 text-red-400/80">
              <CircleAlert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {output && (
            <>
              <p className="mb-4 text-foreground/30">
                <span className="text-accent">$</span> {testType} {host}
              </p>
              {output}
            </>
          )}
        </div>
      </div>
    </div>
  );
}