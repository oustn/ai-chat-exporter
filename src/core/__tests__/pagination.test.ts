import { describe, expect, it } from "vitest";

import { mergeConversationPage } from "../pagination";
import type { ConversationSummary } from "../types";

const conversation = (id: string): ConversationSummary => ({
  id,
  title: `Conversation ${id}`,
  platform: "chatgpt",
});

describe("mergeConversationPage", () => {
  it("appends new conversations without duplicating existing IDs", () => {
    const result = mergeConversationPage(
      [conversation("one"), conversation("two")],
      [conversation("two"), conversation("three")],
    );

    expect(result.map((item) => item.id)).toEqual(["one", "two", "three"]);
  });
});
