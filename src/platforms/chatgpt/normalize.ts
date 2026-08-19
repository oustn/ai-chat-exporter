import type { ConversationDocument, MessageBlock, MessageRole } from "../../core";
import type { ChatGptApiMessage, ChatGptConversationResponse } from "./types";

const SUPPORTED_ROLES = new Set<MessageRole>(["user", "assistant", "system", "tool"]);

function partToText(part: unknown): string {
  if (typeof part === "string") return part;
  if (!part || typeof part !== "object") return "";

  const value = part as Record<string, unknown>;
  if (typeof value.text === "string") return value.text;
  if (value.content_type === "image_asset_pointer") return "[图片]";
  if (value.content_type === "audio_asset_pointer") return "[音频]";
  return "";
}

function messageContent(message: ChatGptApiMessage): string {
  const content = message.content;
  if (!content) return "";
  if (Array.isArray(content.parts))
    return content.parts.map(partToText).filter(Boolean).join("\n\n");
  if (typeof content.text === "string") return content.text;
  if (typeof content.result === "string") return content.result;
  return "";
}

function normalizeMessage(message: ChatGptApiMessage | null | undefined): MessageBlock | null {
  const role = message?.author?.role as MessageRole | undefined;
  const content = message ? messageContent(message).trim() : "";
  if (!message || !role || !SUPPORTED_ROLES.has(role) || !content) return null;

  return {
    id: message.id ?? crypto.randomUUID(),
    role,
    content,
    createdAt: message.create_time,
  };
}

export function normalizeConversation(data: ChatGptConversationResponse): ConversationDocument {
  const nodes = [];
  const visited = new Set<string>();
  let nodeId = data.current_node;

  while (nodeId && data.mapping?.[nodeId] && !visited.has(nodeId)) {
    visited.add(nodeId);
    const node = data.mapping[nodeId];
    if (!node) break;
    nodes.push(node);
    nodeId = node.parent ?? undefined;
  }

  return {
    id: data.id ?? "",
    title: data.title || "未命名会话",
    platform: "chatgpt",
    messages: nodes.reverse().flatMap((node) => {
      const message = normalizeMessage(node.message);
      return message ? [message] : [];
    }),
  };
}
