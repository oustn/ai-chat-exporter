import { describe, expect, it } from "vitest";

import { conversationToMarkdown, sanitizeFilename } from "../markdown";

describe("conversationToMarkdown", () => {
  it("renders a title and message sections", () => {
    expect(
      conversationToMarkdown({
        id: "one",
        platform: "chatgpt",
        title: "Example",
        messages: [{ id: "m1", role: "user", content: "Question" }],
      }),
    ).toBe("# Example\n\n## User\n\nQuestion\n");
  });

  it("sanitizes reserved filename characters", () => {
    expect(sanitizeFilename('a/b:c*?"<>|')).toBe("a_b_c______");
  });
});
