import { messagesToMarkdown, type ConversationDocument, type MessageBlock } from "../core";
import type { DownloadableFile } from "./types";

export function sanitizeFilename(value: string, fallback = "AI 对话"): string {
  const reserved = new Set(["\\", "/", ":", "*", "?", '"', "<", ">", "|"]);
  const sanitized = [...value]
    .map((character) => (character.charCodeAt(0) < 32 || reserved.has(character) ? "_" : character))
    .join("");
  return sanitized.replace(/[. ]+$/g, "").slice(0, 100) || fallback;
}

export function conversationToMarkdown(document: ConversationDocument): string {
  const body = messagesToMarkdown(document.messages);
  return `# ${document.title}\n\n${body}`;
}

export function selectedMessagesToMarkdown(messages: MessageBlock[]): string {
  return messagesToMarkdown(messages);
}

export function createMarkdownFile(document: ConversationDocument): DownloadableFile {
  return {
    content: conversationToMarkdown(document),
    filename: `${sanitizeFilename(document.title)}.md`,
    mimeType: "text/markdown;charset=utf-8",
  };
}

export function fileToDataUrl(file: DownloadableFile): string {
  return `data:${file.mimeType},${encodeURIComponent(file.content)}`;
}
