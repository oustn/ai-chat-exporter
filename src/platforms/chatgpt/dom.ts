import type { PageMessageTarget } from "../page-messages";

const MESSAGE_SELECTOR =
  '[data-message-author-role="user"], [data-message-author-role="assistant"]';
const TURN_SELECTOR = '[data-testid^="conversation-turn-"]';
const generatedIds = new WeakMap<HTMLElement, string>();

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

export type { PageMessageTarget } from "../page-messages";
export { sortTargetsByDocumentOrder, targetToMessageBlock } from "../page-messages";
