import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const lora = Lora({ subsets: ["latin", "latin-ext"], variable: "--font-lora" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "glampingcouple — poctivé recenze glampingů",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Jsme pár, který objíždí glampingy. Píšeme poctivě, co nás nadchlo — i co není domyšlené.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}
