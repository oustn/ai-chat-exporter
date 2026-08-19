import { describe, expect, it } from "vitest";

import { configureContentUiLayer } from "../ui-layer";

describe("configureContentUiLayer", () => {
  it("creates a full-viewport top layer while leaving page clicks available", () => {
    const shadowHost = document.createElement("ai-chat-exporter-ui");
    const container = document.createElement("div");

    configureContentUiLayer(shadowHost, container);

    expect(shadowHost.style.position).toBe("fixed");
    expect(shadowHost.style.inset).toBe("0");
    expect(shadowHost.style.width).toBe("100vw");
    expect(shadowHost.style.height).toBe("100vh");
    expect(shadowHost.style.pointerEvents).toBe("none");
    expect(container.style.position).toBe("fixed");
    expect(container.style.inset).toBe("0");
    expect(container.style.pointerEvents).toBe("none");
  });
});
