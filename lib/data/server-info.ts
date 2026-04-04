export const serverInfo = {
  v4: process.env.NEXT_PUBLIC_SERVER_V4 ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_SERVER_V4" : "—"
  ),
  v6: process.env.NEXT_PUBLIC_SERVER_V6 ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_SERVER_V6" : "—"
  ),
  location: process.env.NEXT_PUBLIC_SERVER_LOCATION ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_SERVER_LOCATION" : "—"
  ),
  asn: process.env.NEXT_PUBLIC_SERVER_ASN ?? (
    process.env.NODE_ENV === "development" ? "Check NEXT_PUBLIC_SERVER_ASN" : "—"
  ),
};