import { describe, expect, test } from "bun:test";
import {
  DEFAULT_LOCALE,
  formatStayDate,
  getDictionary,
  LOCALES,
  otherLocale,
  pagePath,
  reviewPath,
} from "@/lib/i18n";

describe("locales", () => {
  test("cs is the default locale", () => {
    expect(DEFAULT_LOCALE).toBe("cs");
    expect(LOCALES).toEqual(["cs", "en"]);
  });

  test("otherLocale flips", () => {
    expect(otherLocale("cs")).toBe("en");
    expect(otherLocale("en")).toBe("cs");
  });
});

describe("pagePath", () => {
  test("czech routes live at the root with czech segments", () => {
    expect(pagePath("home", "cs")).toBe("/");
    expect(pagePath("reviews", "cs")).toBe("/recenze");
    expect(pagePath("about", "cs")).toBe("/o-nas");
    expect(pagePath("forOwners", "cs")).toBe("/pro-majitele");
  });

  test("english routes live under /en with english segments", () => {
    expect(pagePath("home", "en")).toBe("/en");
    expect(pagePath("reviews", "en")).toBe("/en/reviews");
    expect(pagePath("about", "en")).toBe("/en/about");
    expect(pagePath("forOwners", "en")).toBe("/en/for-owners");
  });
});

describe("reviewPath", () => {
  test("shares the slug across locales", () => {
    expect(reviewPath("cs", "treehouse-pod-jestedem")).toBe(
      "/recenze/treehouse-pod-jestedem",
    );
    expect(reviewPath("en", "treehouse-pod-jestedem")).toBe(
      "/en/reviews/treehouse-pod-jestedem",
    );
  });
});

describe("getDictionary", () => {
  test("returns matching translations with identical shape", () => {
    const cs = getDictionary("cs");
    const en = getDictionary("en");
    expect(cs.nav.reviews).toBe("Recenze");
    expect(en.nav.reviews).toBe("Reviews");
    expect(cs.areas.sleeping).toBe("Komfort spaní");
    expect(en.areas.sleeping).toBe("Sleeping comfort");
    expect(Object.keys(cs).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(cs.areas).sort()).toEqual(Object.keys(en.areas).sort());
  });
});

describe("formatStayDate", () => {
  test("formats month + year per locale", () => {
    const d = new Date("2026-05-16");
    expect(formatStayDate(d, "cs")).toBe("květen 2026");
    expect(formatStayDate(d, "en")).toBe("May 2026");
  });
});
