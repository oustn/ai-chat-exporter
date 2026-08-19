import { beforeEach, describe, expect, it } from "vitest";

import { scanGeminiPageMessages, targetToMessageBlock } from "../dom";

describe("Gemini page messages", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("scans user queries and model responses in document order", () => {
    document.body.innerHTML = `
      <user-query id="query-1">
        <div class="query-content"><div class="query-text">Explain <strong>WXT</strong></div></div>
      </user-query>
      <model-response id="response-1">
        <message-content>
          <div class="markdown markdown-main-panel"><p>WXT is a framework.</p></div>
        </message-content>
        <button>Share</button>
      </model-response>
    `;

    const targets = scanGeminiPageMessages();

    expect(targets.map(({ id, role }) => ({ id, role }))).toEqual([
      { id: "query-1", role: "user" },
      { id: "response-1", role: "assistant" },
    ]);
    const [user, assistant] = targets;
    if (!user || !assistant) throw new Error("Expected a user and assistant message");
    expect(targetToMessageBlock(user).content).toContain("**WXT**");
    expect(targetToMessageBlock(assistant).content).toBe("WXT is a framework.");
  });

  it("ignores cloned messages inside the PNG export stage", () => {
    document.body.innerHTML = `
      <user-query><div class="query-text">Original</div></user-query>
      <div data-ai-exporter-stage="true">
        <user-query><div class="query-text">Clone</div></user-query>
      </div>
    `;

    expect(scanGeminiPageMessages()).toHaveLength(1);
  });
});
