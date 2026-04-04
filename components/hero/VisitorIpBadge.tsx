"use client";

import { User } from "lucide-react";
import { useVisitorIp } from "@/lib/hooks/useVisitorIp";
import { useTranslations } from "next-intl";

export default function VisitorIpBadge() {
  const t = useTranslations("hero");
  const visitorIp = useVisitorIp();

  return (
    <div className="card-dashboard p-4 rounded-2xl flex items-center gap-4">
      <div className="p-3 rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
        <User size={20} />
      </div>
      <div>
        <div className="text-[10px] font-bold tracking-widest text-foreground-muted mb-0.5">
          {t("visitor_ip")}
        </div>
        <div className="font-mono font-bold text-foreground/80">
          {visitorIp ?? (
            <span className="text-foreground/30 animate-pulse">···</span>
          )}
        </div>
      </div>
    </div>
  );
}