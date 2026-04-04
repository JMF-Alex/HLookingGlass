import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import SectionBackground from "@/components/ui/SectionBackground";

const HeroSection = dynamic(
  () => import("@/components/sections/HeroSection"),
);
const LookingGlassSection = dynamic(
  () => import("@/components/sections/LookingGlassSection"),
);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SectionBackground>
        <HeroSection />
        <LookingGlassSection />
      </SectionBackground>
    </>
  );
}
