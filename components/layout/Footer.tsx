"use client";

import { useTranslations } from "next-intl";
import { ArrowBigUp } from "lucide-react";
import { socials } from "@/lib/data";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative flex items-center justify-center">

          <p className="absolute left-0 text-xs font-bold" style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}>
            © {year} HLooking Glass. {t("rights")}
          </p>

          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  color: "rgba(255,255,255,0.25)",
                  background: "transparent",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--color-accent)";
                  el.style.background = "hsla(262.1, 83.3%, 57.8%, 0.08)";
                  el.style.borderColor = "hsla(262.1, 83.3%, 57.8%, 0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "rgba(255,255,255,0.25)";
                  el.style.background = "transparent";
                  el.style.borderColor = "transparent";
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute right-0 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0"
            style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}
          >
            {t("back_to_top")}
            <ArrowBigUp size={11} style={{ color: "var(--color-accent)" }} />
          </button>

        </div>
      </div>
    </footer>
  );
}