import { describe, expect, test } from "bun:test";
import path from "node:path";
import { getPage } from "@/lib/content";

const FIXTURES = path.join(import.meta.dir, "fixtures", "content");

describe("getPage", () => {
  test("loads title and body per locale", () => {
    const cs = getPage("about", "cs", FIXTURES);
    expect(cs.title).toBe("O nás");
    expect(cs.body).toContain("milujeme glamping");

    const en = getPage("about", "en", FIXTURES);
    expect(en.title).toBe("About us");
  });

  test("throws for a missing page file", () => {
    expect(() => getPage("for-owners", "cs", FIXTURES)).toThrow(/for-owners/);
  });
});
