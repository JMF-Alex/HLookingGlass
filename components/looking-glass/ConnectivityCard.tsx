"use client";

import { useTranslations } from "next-intl";
import { Terminal, Play, Send } from "lucide-react";
import { useCallback } from "react";
import { TOOLS } from "@/lib/data";

type Props = {
  host: string;
  testType: string;
  isRunning: boolean;
  onHostChange: (v: string) => void;
  onTestTypeChange: (v: string) => void;
  onRun: () => void;
};

export default function ConnectivityCard({
  host,
  testType,
  isRunning,
  onHostChange,
  onTestTypeChange,
  onRun,
}: Props) {
  const t = useTranslations("looking_glass");
  const isBgp = testType === "bgp" || testType === "bgp6";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onRun();
    },
    [onRun]
  );

  return (
    <div className="card-dashboard p-8 animate-fade-in-left">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <Terminal size={22} />
        </div>
        <h2 className="text-xl font-black tracking-tight">{t("connectivity")}</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="lg-host" className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-1">
              {isBgp ? "ASN" : "Target Host / IP"}
            </label>
            <input
              id="lg-host"
              type="text"
              value={host}
              onChange={(e) => onHostChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBgp ? "AS13335 or 13335" : t("host_placeholder")}
              className="w-full bg-black/20 border border-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lg-test-type" className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-1">
              {t("select_test")}
            </label>
            <div className="relative">
              <select
                id="lg-test-type"
                value={testType}
                onChange={(e) => onTestTypeChange(e.target.value)}
                className="w-full bg-black/20 border border-border px-4 py-3 rounded-xl text-sm appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
              >
                {TOOLS.map((tool) => (
                  <option key={tool.id} value={tool.id} className="bg-surface text-foreground">
                    {t(tool.name)}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                <Play size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={!host || isRunning}
          className="w-full h-12 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100 transition-all"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("run_test")}...
            </>
          ) : (
            <>
              <Send size={16} />
              {t("run_test")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}