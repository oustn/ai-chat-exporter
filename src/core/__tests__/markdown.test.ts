import { describe, expect, it } from "vitest";

import { messagesToMarkdown } from "../markdown";
import type { MessageBlock } from "../types";

describe("messagesToMarkdown", () => {
  it("renders supported roles and filters empty messages", () => {
    const messages: MessageBlock[] = [
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "```ts\nconst answer = 42;\n```" },
      { id: "3", role: "system", content: "  " },
    ];

    expect(messagesToMarkdown(messages)).toBe(
      "## User\n\nHello\n\n## Assistant\n\n```ts\nconst answer = 42;\n```\n",
    );
  });
});
