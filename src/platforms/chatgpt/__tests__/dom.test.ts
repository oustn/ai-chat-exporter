import { beforeEach, describe, expect, it } from "vitest";

import { scanChatGptPageMessages } from "../dom";

function createTurn(id: string, role: "user" | "assistant"): HTMLElement {
  const turn = document.createElement("article");
  turn.dataset.testid = `conversation-turn-${id}`;
  const message = document.createElement("div");
  message.dataset.messageAuthorRole = role;
  message.textContent = `${role} message`;
  turn.append(message);
  return turn;
}

describe("scanChatGptPageMessages", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("ignores message clones inside the PNG export stage", () => {
    const userTurn = createTurn("user", "user");
    const assistantTurn = createTurn("assistant", "assistant");
    document.body.append(userTurn, assistantTurn);

    const stage = document.createElement("div");
    stage.dataset.aiExporterStage = "true";
    stage.append(userTurn.cloneNode(true), assistantTurn.cloneNode(true));
    document.body.append(stage);

    expect(scanChatGptPageMessages()).toHaveLength(2);
  });
});
