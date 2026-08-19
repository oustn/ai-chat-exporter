import { htmlToMarkdown, type MessageBlock, type MessageRole } from "../../core";

const MESSAGE_SELECTOR =
  '[data-message-author-role="user"], [data-message-author-role="assistant"]';
const TURN_SELECTOR = '[data-testid^="conversation-turn-"]';
const generatedIds = new WeakMap<HTMLElement, string>();

export interface PageMessageTarget {
  id: string;
  role: "user" | "assistant";
  turn: HTMLElement;
  message: HTMLElement;
  rect: DOMRect;
}

function getTargetId(turn: HTMLElement): string {
  const testId = turn.dataset.testid;
  if (testId) return testId;
  const existing = generatedIds.get(turn);
  if (existing) return existing;
  const id = crypto.randomUUID();
  generatedIds.set(turn, id);
  return id;
}

function getTurn(message: HTMLElement): HTMLElement {
  return (
    message.closest<HTMLElement>(TURN_SELECTOR) ??
    message.closest<HTMLElement>("article") ??
    message
  );
}

export function scanChatGptPageMessages(): PageMessageTarget[] {
  const seen = new Set<HTMLElement>();
  const targets: PageMessageTarget[] = [];

  for (const message of document.querySelectorAll<HTMLElement>(MESSAGE_SELECTOR)) {
    if (message.closest("[data-ai-exporter-stage='true']")) continue;
    const turn = getTurn(message);
    if (seen.has(turn)) continue;
    seen.add(turn);
    const role = message.dataset.messageAuthorRole;
    if (role !== "user" && role !== "assistant") continue;
    targets.push({
      id: getTargetId(turn),
      role,
      turn,
      message,
      rect: turn.getBoundingClientRect(),
    });
  }

  return targets;
}

export function targetToMessageBlock(target: PageMessageTarget): MessageBlock {
  const clone = target.message.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("button, script, style, svg, textarea, [contenteditable='true']")
    .forEach((node) => node.remove());
  return {
    id: target.id,
    role: target.role as MessageRole,
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
