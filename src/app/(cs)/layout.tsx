import type { Metadata } from "next";
import { karla, lora } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "glampingcouple — poctivé recenze glampingů",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Jsme pár, který objíždí glampingy. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
};

export default function CsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${lora.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
