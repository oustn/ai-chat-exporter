import type { PlatformAdapter } from "../../core";
import { getChatGptConversation, listChatGptConversations } from "./api";
import { isChatGptUrl } from "./constants";

export function createChatGptAdapter(tabId: number): PlatformAdapter {
  return {
    id: "chatgpt",
    name: "ChatGPT",
    matches: isChatGptUrl,
    listConversations: (input) => listChatGptConversations(tabId, input),
    getConversation: (id) => getChatGptConversation(tabId, id),
  };
}
