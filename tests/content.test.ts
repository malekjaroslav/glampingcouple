import { describe, expect, test } from "bun:test";
import path from "node:path";
import { getReviewBySlug, getReviews } from "@/lib/content";

const FIXTURES = path.join(import.meta.dir, "fixtures", "content");
const FIXTURES_INVALID = path.join(
  import.meta.dir,
  "fixtures",
  "content-invalid",
);

describe("getReviews", () => {
  test("returns published czech reviews sorted by stayDate desc", () => {
    const reviews = getReviews("cs", FIXTURES);
    expect(reviews.map((r) => r.slug)).toEqual([
      "maringotka-u-lesa",
      "jurta-na-kopci",
    ]);
  });

  test("excludes drafts", () => {
    const slugs = getReviews("cs", FIXTURES).map((r) => r.slug);
    expect(slugs).not.toContain("tajny-koncept");
  });

  test("skips reviews without en.md in the english listing", () => {
    const reviews = getReviews("en", FIXTURES);
    expect(reviews.map((r) => r.slug)).toEqual(["maringotka-u-lesa"]);
  });

  test("maps photos to public urls with cover detection", () => {
    const review = getReviews("cs", FIXTURES)[0];
    expect(review.photos).toEqual([
      "/reviews/maringotka-u-lesa/01.jpg",
      "/reviews/maringotka-u-lesa/cover.jpg",
    ]);
    expect(review.cover).toBe("/reviews/maringotka-u-lesa/cover.jpg");
  });

  test("review without photos has empty photos and null cover", () => {
    const review = getReviews("cs", FIXTURES).find(
      (r) => r.slug === "jurta-na-kopci",
    );
    expect(review?.photos).toEqual([]);
    expect(review?.cover).toBeNull();
  });

  test("throws a descriptive error on invalid frontmatter", () => {
    expect(() => getReviews("cs", FIXTURES_INVALID)).toThrow(/bad-review/);
  });
});

describe("getReviewBySlug", () => {
  test("returns the review for an existing slug", () => {
    const review = getReviewBySlug("maringotka-u-lesa", "en", FIXTURES);
    expect(review?.title).toBe("Maringotka U Lesa");
    expect(review?.locale).toBe("en");
  });

  test("returns null for a missing slug", () => {
    expect(getReviewBySlug("neexistuje", "cs", FIXTURES)).toBeNull();
  });

  test("returns null for missing translation", () => {
    expect(getReviewBySlug("jurta-na-kopci", "en", FIXTURES)).toBeNull();
  });

  test("returns null for a draft", () => {
    expect(getReviewBySlug("tajny-koncept", "cs", FIXTURES)).toBeNull();
  });
});
