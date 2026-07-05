import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncPhotos } from "../scripts/sync-photos";

describe("syncPhotos", () => {
  test("copies content photos into public/reviews and clears stale output", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "photos-"));
    const photosDir = path.join(
      root,
      "content",
      "reviews",
      "glamp-a",
      "photos",
    );
    mkdirSync(photosDir, { recursive: true });
    writeFileSync(path.join(photosDir, "cover.jpg"), "img");

    const staleDir = path.join(root, "public", "reviews", "deleted-glamp");
    mkdirSync(staleDir, { recursive: true });
    writeFileSync(path.join(staleDir, "old.jpg"), "old");

    syncPhotos(root);

    expect(
      existsSync(path.join(root, "public", "reviews", "glamp-a", "cover.jpg")),
    ).toBe(true);
    expect(existsSync(staleDir)).toBe(false);
  });

  test("handles a project without any content gracefully", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "photos-empty-"));
    expect(() => syncPhotos(root)).not.toThrow();
  });
});
