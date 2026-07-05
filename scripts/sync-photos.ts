import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

export function syncPhotos(rootDir: string) {
  const reviewsDir = path.join(rootDir, "content", "reviews");
  const outDir = path.join(rootDir, "public", "reviews");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  if (!existsSync(reviewsDir)) return;
  for (const slug of readdirSync(reviewsDir)) {
    const photosDir = path.join(reviewsDir, slug, "photos");
    if (existsSync(photosDir)) {
      cpSync(photosDir, path.join(outDir, slug), { recursive: true });
    }
  }
}

if (import.meta.main) {
  syncPhotos(process.cwd());
  console.log("[photos] synced content/reviews/*/photos -> public/reviews/");
}
