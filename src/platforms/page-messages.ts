import { htmlToMarkdown, type MessageBlock } from "../core";

export interface PageMessageTarget {
  id: string;
  role: "user" | "assistant";
  turn: HTMLElement;
  message: HTMLElement;
  rect: DOMRect;
}

export function targetToMessageBlock(target: PageMessageTarget): MessageBlock {
  const clone = target.message.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("button, script, style, svg, textarea, [contenteditable='true']")
    .forEach((node) => node.remove());
  return {
    id: target.id,
    role: target.role,
    content: htmlToMarkdown(clone.innerHTML),
    html: clone.innerHTML,
  };
}

export function sortTargetsByDocumentOrder(targets: PageMessageTarget[]): PageMessageTarget[] {
  return [...targets].sort((left, right) => {
    if (left.turn === right.turn) return 0;
    return left.turn.compareDocumentPosition(right.turn) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });
}
