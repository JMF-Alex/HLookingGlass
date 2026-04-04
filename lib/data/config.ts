export const siteConfig = {
  name: process.env.NEXT_PUBLIC_NAME ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_NAME" : "—"
  ),
  description: process.env.NEXT_PUBLIC_DESCRIPTION ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_DESCRIPTION" : "—"
  ),
  url: process.env.NEXT_PUBLIC_URL ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_URL" : "—"
  ),
} as const;