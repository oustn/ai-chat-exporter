import { targetToMessageBlock, type PageMessageTarget } from "../page-messages";

const TURN_SELECTOR = "user-query, model-response";
const USER_CONTENT_SELECTOR = ".query-text, .query-content";
const MODEL_CONTENT_SELECTOR = "message-content, .markdown-main-panel, .model-response-text";
const generatedIds = new WeakMap<HTMLElement, string>();

function getTargetId(turn: HTMLElement): string {
  if (turn.id) return turn.id;
  const existing = generatedIds.get(turn);
  if (existing) return existing;
  const id = crypto.randomUUID();
  generatedIds.set(turn, id);
  return id;
}

export function scanGeminiPageMessages(): PageMessageTarget[] {
  const targets: PageMessageTarget[] = [];

  for (const turn of document.querySelectorAll<HTMLElement>(TURN_SELECTOR)) {
    if (turn.closest("[data-ai-exporter-stage='true']")) continue;
    const role = turn.matches("user-query") ? "user" : "assistant";
    const contentSelector = role === "user" ? USER_CONTENT_SELECTOR : MODEL_CONTENT_SELECTOR;
    const message = turn.querySelector<HTMLElement>(contentSelector);
    if (!message || !message.textContent?.trim()) continue;
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

export { targetToMessageBlock };
