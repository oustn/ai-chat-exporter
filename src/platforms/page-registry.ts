import { scanChatGptPageMessages } from "./chatgpt/dom";
import { isChatGptUrl } from "./chatgpt/constants";
import { isGeminiUrl } from "./gemini/constants";
import { scanGeminiPageMessages } from "./gemini/dom";
import type { PageMessageTarget } from "./page-messages";

export function scanCurrentPageMessages(url = window.location.href): PageMessageTarget[] {
  if (isChatGptUrl(url)) return scanChatGptPageMessages();
  if (isGeminiUrl(url)) return scanGeminiPageMessages();
  return [];
}
