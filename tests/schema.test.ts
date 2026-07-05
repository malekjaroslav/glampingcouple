import { describe, expect, test } from "bun:test";
import { reviewFrontmatterSchema } from "@/lib/schema";

const valid = {
  title: "Treehouse pod Ještědem",
  location: "Liberecký kraj",
  stayDate: new Date("2026-05-16"),
  score: 8,
  verdict: "Kouzelné místo, které by s pár úpravami bylo dokonalé.",
  liked: ["Výhled na Ještěd"],
  notThoughtThrough: ["Neosvětlená cesta na toaletu"],
  ratings: {
    sleeping: 9,
    hygiene: 7,
    cleanliness: 10,
    privacy: 8,
    surroundings: 8,
    supplies: 6,
  },
  tags: ["treehouse"],
  published: true,
};

describe("reviewFrontmatterSchema", () => {
  test("accepts a valid frontmatter", () => {
    const parsed = reviewFrontmatterSchema.parse(valid);
    expect(parsed.title).toBe(valid.title);
    expect(parsed.stayDate).toBeInstanceOf(Date);
  });

  test("coerces a string stayDate", () => {
    const parsed = reviewFrontmatterSchema.parse({
      ...valid,
      stayDate: "2026-05-16",
    });
    expect(parsed.stayDate.getFullYear()).toBe(2026);
  });

  test("defaults tags to an empty array", () => {
    const { tags, ...rest } = valid;
    expect(reviewFrontmatterSchema.parse(rest).tags).toEqual([]);
  });

  test("rejects score outside 1-10", () => {
    expect(() =>
      reviewFrontmatterSchema.parse({ ...valid, score: 11 }),
    ).toThrow();
    expect(() =>
      reviewFrontmatterSchema.parse({ ...valid, score: 0 }),
    ).toThrow();
  });

  test("rejects empty liked list", () => {
    expect(() =>
      reviewFrontmatterSchema.parse({ ...valid, liked: [] }),
    ).toThrow();
  });

  test("rejects missing ratings", () => {
    const { ratings, ...rest } = valid;
    expect(() => reviewFrontmatterSchema.parse(rest)).toThrow();
  });

  test("rejects an incomplete or out-of-range ratings object", () => {
    const { supplies, ...incomplete } = valid.ratings;
    expect(() =>
      reviewFrontmatterSchema.parse({ ...valid, ratings: incomplete }),
    ).toThrow();
    expect(() =>
      reviewFrontmatterSchema.parse({
        ...valid,
        ratings: { ...valid.ratings, hygiene: 11 },
      }),
    ).toThrow();
  });

  test("rejects missing verdict", () => {
    const { verdict, ...rest } = valid;
    expect(() => reviewFrontmatterSchema.parse(rest)).toThrow();
  });
});
