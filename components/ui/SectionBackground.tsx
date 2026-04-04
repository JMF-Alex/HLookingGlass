import type { ReactNode } from "react";

export default function SectionBackground({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "radial-gradient(ellipse 80% 40% at 50% 0%, hsla(262.1, 83.3%, 57.8%, 0.08) 0%, transparent 60%)",
        borderTop: "1px solid hsla(262.1, 83.3%, 57.8%, 0.12)",
      }}
    >
      {children}
    </div>
  );
}