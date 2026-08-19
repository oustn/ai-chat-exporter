import { browser } from "wxt/browser";

import type { ConversationDocument, ConversationSummary, Page, PaginationInput } from "../../core";
import { fetchInChatGptMainWorld } from "./auth";
import { normalizeConversation } from "./normalize";
import type { ChatGptConversationListResponse, ChatGptConversationResponse } from "./types";

async function requestJson<T>(tabId: number, path: string): Promise<T> {
  const [execution] = await browser.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: fetchInChatGptMainWorld,
    args: [path],
  });
  const result = execution?.result;
  if (!result) throw new Error("ChatGPT 页面没有返回接口结果，请刷新页面后重试。");
  if (result.error) throw new Error(result.error);
  return result.data as T;
}

export async function listChatGptConversations(
  tabId: number,
  input: PaginationInput,
): Promise<Page<ConversationSummary>> {
  const query = new URLSearchParams({
    offset: String(input.offset),
    limit: String(input.limit),
    order: "updated",
    is_archived: "false",
    is_starred: "false",
  });
  const data = await requestJson<ChatGptConversationListResponse>(
    tabId,
    `/backend-api/conversations?${query.toString()}`,
  );
  const items = (data.items ?? []).map((item) => ({
    id: item.id,
    title: item.title || "未命名会话",
    platform: "chatgpt" as const,
    updatedAt: item.update_time,
  }));

  return {
    items,
    total: data.total ?? items.length,
    offset: input.offset,
    limit: input.limit,
  };
}

export async function getChatGptConversation(
  tabId: number,
  conversationId: string,
): Promise<ConversationDocument> {
  const data = await requestJson<ChatGptConversationResponse>(
    tabId,
    `/backend-api/conversation/${encodeURIComponent(conversationId)}`,
  );
  return normalizeConversation(data);
}
