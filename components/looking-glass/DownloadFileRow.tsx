"use client";

import { Download, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import type { DownloadState } from "@/hooks/use-file-download";

interface DownloadFileRowProps {
  url: string;
  sizeKey: string;
  state: DownloadState;
  onDownload: (url: string, filename: string) => void;
  onReset: (url: string) => void;
}

export function DownloadFileRow({
  url,
  sizeKey,
  state,
  onDownload,
  onReset,
}: DownloadFileRowProps) {
  const t = useTranslations("looking_glass");

  const isDownloading = state.status === "downloading";
  const isError = state.status === "error";
  const progress = isDownloading ? state.progress : 0;

  return (
    <div className="group relative flex items-center justify-between p-4 rounded-xl bg-black/20 border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-accent/5 transition-transform duration-300 origin-left"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isDownloading
          ? `Downloading ${progress}%`
          : isError
            ? state.message
            : ""}
      </span>

      <div className="relative flex items-center gap-4">
        <div className="p-2 rounded-lg bg-surface-light text-foreground/40 group-hover:text-accent transition-colors">
          <Download size={18} aria-hidden />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground/80 group-hover:text-foreground">
            {t(sizeKey)}
          </p>
          <p className="text-[10px] uppercase font-bold text-foreground/20">
            {isDownloading ? `${progress}%` : isError ? state.message : "Binary Test"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => isError ? onReset(url) : onDownload(url, `test-${url}.bin`)}
        disabled={isDownloading}
        aria-label={isError ? `${t("retry")} — ${state.message}` : `${t("download")} ${t(sizeKey)}`}
        aria-busy={isDownloading}
        className="relative p-2 rounded-lg bg-surface-light border border-border-light text-accent/50 hover:text-accent hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden />
        ) : isError ? (
          <AlertCircle size={16} className="text-destructive" aria-hidden />
        ) : (
          <Download size={16} aria-hidden />
        )}
      </button>
    </div>
  );
}