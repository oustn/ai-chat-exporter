export interface ChatGptApiMessage {
  id?: string;
  author?: { role?: string };
  content?: {
    parts?: unknown[];
    text?: string;
    result?: string;
  };
  create_time?: string | number;
}

export interface ChatGptMappingNode {
  id?: string;
  parent?: string | null;
  message?: ChatGptApiMessage | null;
}

export interface ChatGptConversationResponse {
  id?: string;
  title?: string;
  current_node?: string;
  mapping?: Record<string, ChatGptMappingNode>;
}

export interface ChatGptConversationListItem {
  id: string;
  title?: string;
  update_time?: string | number;
}

export interface ChatGptConversationListResponse {
  items?: ChatGptConversationListItem[];
  total?: number;
}
