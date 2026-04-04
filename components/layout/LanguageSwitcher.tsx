"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function switchLocale(next: string) {
    setOpen(false);
    router.replace(pathname, { locale: next, scroll: false });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
        style={{
          color: open ? "var(--color-accent)" : "var(--color-foreground-muted)",
          background: open ? "var(--color-glass-light)" : "transparent",
          border: open ? "1px solid var(--color-border-light)" : "1px solid transparent",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onMouseEnter={(e) => {
          if (open) return;
          const el = e.currentTarget as HTMLElement;
          el.style.color = "var(--color-foreground)";
          el.style.background = "var(--color-surface-light)";
        }}
        onMouseLeave={(e) => {
          if (open) return;
          const el = e.currentTarget as HTMLElement;
          el.style.color = "var(--color-foreground-muted)";
          el.style.background = "transparent";
        }}
      >
        <Globe size={15} />
        <span className="font-bold uppercase" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
          {localeLabels[locale]}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50"
          style={{
            minWidth: 90,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          }}
        >
          {Object.entries(localeLabels).map(([code, label]) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              role="option"
              aria-selected={code === locale}
              className="w-full px-4 py-2.5 text-left transition-all duration-150 cursor-pointer font-bold uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                color: code === locale ? "var(--color-accent)" : "var(--color-foreground-muted)",
                background: code === locale ? "var(--color-glass-light)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (code === locale) return;
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--color-foreground)";
                el.style.background = "var(--color-surface-light)";
              }}
              onMouseLeave={(e) => {
                if (code === locale) return;
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--color-foreground-muted)";
                el.style.background = "transparent";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}