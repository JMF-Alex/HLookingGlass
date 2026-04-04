"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { TEST_FILES } from "@/lib/data";
import { useFileDownload } from "@/hooks/use-file-download";
import { DownloadFileRow } from "./DownloadFileRow";

export default function DownloadsCard() {
  const t = useTranslations("looking_glass");
  const { states, download, reset } = useFileDownload();

  return (
    <div className="card-dashboard p-8 animate-fade-in delay-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <Download size={22} aria-hidden />
        </div>
        <h2 className="text-xl font-black tracking-tight">{t("downloads")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        {TEST_FILES.map((file) => (
          <DownloadFileRow
            key={file.url}
            url={file.url}
            sizeKey={file.size}
            state={states[file.url] ?? { status: "idle" }}
            onDownload={download}
            onReset={reset}
          />
        ))}
      </div>
    </div>
  );
}