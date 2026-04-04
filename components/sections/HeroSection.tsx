import { useTranslations } from "next-intl";
import { Globe, Server, Hash, Monitor } from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";
import { serverInfo } from "@/lib/data";
import VisitorIpBadge from "@/components/hero/VisitorIpBadge";

const infoCards = [
  { icon: Server, label: "location", value: serverInfo.location },
  { icon: Hash, label: "asn", value: serverInfo.asn },
  { icon: Monitor, label: "ipv4", value: serverInfo.v4 },
  { icon: Globe, label: "ipv6", value: serverInfo.v6 },
]

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <SectionBackground>
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 gradient-text">
                {t("title")}
              </h1>
              <p className="max-w-xl text-foreground-muted text-lg leading-relaxed">
                {t("description")}
              </p>
            </div>
            <div className="animate-fade-in delay-100 shrink-0">
              <VisitorIpBadge />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up delay-200">
            {infoCards.map((item) => (
              <div key={item.label} className="card-dashboard p-5 group">
                <div className="flex items-center gap-3 mb-4 text-foreground-muted group-hover:text-accent transition-colors">
                  <item.icon size={18} />
                  <span className="text-[10px] font-bold tracking-[0.2em]">{t(item.label)}</span>
                </div>
                <div className="text-sm font-semibold truncate text-foreground/80 group-hover:text-foreground transition-colors">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionBackground>
  );
}