import { toPng } from "dom-to-image-more";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { exportElementsAsPng } from "../png";

vi.mock("dom-to-image-more", () => ({
  toPng: vi.fn<() => Promise<string>>().mockResolvedValue("data:image/png;base64,test"),
}));

describe("exportElementsAsPng", () => {
  beforeEach(() => {
    vi.mocked(toPng).mockClear();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("does not embed page fonts that require CSP-blocked base URLs", async () => {
    const element = document.createElement("article");
    element.textContent = "Conversation";
    document.body.append(element);

    await exportElementsAsPng({ elements: [element], title: "Chat" });

    expect(toPng).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ disableEmbedFonts: true }),
    );
  });

  it("uses a wider canvas on desktop screens", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);
    const element = document.createElement("article");
    element.textContent = "Wide conversation";
    document.body.append(element);

    await exportElementsAsPng({ elements: [element], title: "Chat" });

    const stage = vi.mocked(toPng).mock.calls[0]?.[0];
    expect(stage).toBeInstanceOf(HTMLElement);
    expect((stage as HTMLElement).style.width).toBe("1200px");
  });
});
