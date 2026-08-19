import { describe, expect, it } from "vitest";

import { normalizeConversation } from "../normalize";

describe("normalizeConversation", () => {
  it("keeps only the branch ending at current_node", () => {
    const result = normalizeConversation({
      id: "conversation-id",
      title: "Branch test",
      current_node: "assistant-current",
      mapping: {
        root: { id: "root", parent: null, message: null },
        user: {
          id: "user",
          parent: "root",
          message: {
            id: "message-user",
            author: { role: "user" },
            content: { parts: ["Question"] },
          },
        },
        "assistant-current": {
          id: "assistant-current",
          parent: "user",
          message: {
            id: "message-current",
            author: { role: "assistant" },
            content: { parts: ["Current answer"] },
          },
        },
        "assistant-other": {
          id: "assistant-other",
          parent: "user",
          message: {
            id: "message-other",
            author: { role: "assistant" },
            content: { parts: ["Other answer"] },
          },
        },
      },
    });

    expect(result.messages.map((message) => message.content)).toEqual([
      "Question",
      "Current answer",
    ]);
  });
});
