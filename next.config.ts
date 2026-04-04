import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Testing options:
  // (don't change it in prod envionrments)
  //reactStrictMode: false,
};

export default withNextIntl(nextConfig);
