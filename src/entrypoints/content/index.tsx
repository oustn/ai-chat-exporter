import ReactDOM from "react-dom/client";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import { defineContentScript } from "wxt/utils/define-content-script";

import { ContentApp } from "./ContentApp";
import "./content.css";

export default defineContentScript({
  matches: ["https://chatgpt.com/*", "https://gemini.google.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const selectionStyle = document.createElement("style");
    selectionStyle.dataset.aiExporterSelectionStyle = "true";
    selectionStyle.textContent = `
      [data-ai-exporter-selected] {
        outline: 2px solid #10a37f !important;
        outline-offset: -2px !important;
        border-radius: 6px !important;
      }
    `;
    document.head.append(selectionStyle);
    ctx.onInvalidated(() => selectionStyle.remove());

    const ui = await createShadowRootUi(ctx, {
      name: "ai-chat-exporter-ui",
      position: "modal",
      zIndex: 2_147_483_647,
      isolateEvents: true,
      onMount(container) {
        container.style.pointerEvents = "none";
        const root = ReactDOM.createRoot(container);
        root.render(<ContentApp />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });
    ui.mount();
  },
});
