import { describe, expect, test } from "bun:test";
import { markdownToHtml } from "@/lib/markdown";

describe("markdownToHtml", () => {
  test("renders headings and paragraphs", async () => {
    const html = await markdownToHtml("# Ahoj\n\nPrvní noc byla **kouzelná**.");
    expect(html).toContain("<h1>Ahoj</h1>");
    expect(html).toContain("<strong>kouzelná</strong>");
  });

  test("returns empty string for empty input", async () => {
    expect(await markdownToHtml("")).toBe("");
  });
});
