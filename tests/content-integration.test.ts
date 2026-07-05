import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import path from "node:path";
import { getPage, getReviewBySlug, getReviews } from "@/lib/content";
import { LOCALES } from "@/lib/i18n";

describe("real content directory", () => {
  test("every review folder loads (or is an explicit draft) in czech", () => {
    const reviews = getReviews("cs"); // throws on any invalid folder — that alone guards content
    const slugs = new Set(reviews.map((r) => r.slug));
    const folders = readdirSync(path.join(process.cwd(), "content", "reviews"));
    for (const folder of folders) {
      const review = getReviewBySlug(folder, "cs");
      // published folders must appear in the listing; the only legitimate absence is a draft
      if (review) expect(slugs.has(folder)).toBe(true);
    }
    expect(slugs.size).toBeGreaterThan(0);
  });

  test("english listing loads without crashing", () => {
    expect(() => getReviews("en")).not.toThrow();
  });

  test("all static pages exist in all locales", () => {
    for (const locale of LOCALES) {
      expect(getPage("about", locale).title.length).toBeGreaterThan(0);
      expect(getPage("for-owners", locale).title.length).toBeGreaterThan(0);
    }
  });
});
