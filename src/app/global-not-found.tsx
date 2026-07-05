import { NotFoundContent } from "@/components/NotFoundContent";
import { karla, lora } from "@/lib/fonts";
import "./globals.css";

// Full-document 404 for URLs that match no route (the app has two root
// layouts, so unmatched paths need their own <html> shell).
export default function GlobalNotFound() {
  return (
    <html lang="cs" className={`${lora.variable} ${karla.variable}`}>
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
