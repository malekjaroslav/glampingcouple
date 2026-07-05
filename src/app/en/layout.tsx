import type { Metadata } from "next";
import { karla, lora } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "glampingcouple — honest glamping reviews",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "We are a couple touring glampings. We write honestly about what delighted us — and what isn't thought through.",
};

export default function EnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
