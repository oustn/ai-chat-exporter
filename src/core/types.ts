export type PlatformId = "chatgpt";
export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ConversationSummary {
  id: string;
  title: string;
  platform: PlatformId;
  updatedAt?: string | number;
}

export interface MessageBlock {
  id: string;
  role: MessageRole;
  content: string;
  html?: string;
  createdAt?: string | number;
}

export interface ConversationDocument {
  id: string;
  title: string;
  platform: PlatformId;
  messages: MessageBlock[];
}

export interface Page<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface PaginationInput {
  offset: number;
  limit: number;
}
