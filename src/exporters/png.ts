import { toPng } from "dom-to-image-more";

import { sanitizeFilename } from "./markdown";

export interface PngExportInput {
  elements: HTMLElement[];
  title: string;
}

export async function exportElementsAsPng({ elements, title }: PngExportInput): Promise<void> {
  if (!elements.length) throw new Error("请先选择至少一条消息。");

  const bodyStyle = getComputedStyle(document.body);
  const stage = document.createElement("div");
  stage.dataset.aiExporterStage = "true";
  Object.assign(stage.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    width: `${Math.min(1200, Math.max(360, window.innerWidth - 48))}px`,
    padding: "24px 0",
    background: bodyStyle.backgroundColor || "#ffffff",
    color: bodyStyle.color || "#202123",
  });

  for (const element of elements) {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-ai-exporter-selected");
    clone
      .querySelectorAll("button, script, style, textarea, [contenteditable='true']")
      .forEach((node) => node.remove());
    clone.style.width = "100%";
    clone.style.maxWidth = "none";
    stage.append(clone);
  }

  document.body.append(stage);
  try {
    const dataUrl = await toPng(stage, {
      bgcolor: bodyStyle.backgroundColor || "#ffffff",
      cacheBust: true,
      disableEmbedFonts: true,
      height: stage.scrollHeight,
      width: stage.scrollWidth,
    });
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `${sanitizeFilename(title)}-${elements.length}条消息.png`;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    stage.remove();
  }
}
