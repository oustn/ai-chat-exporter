import type {
  ConversationDocument,
  ConversationSummary,
  Page,
  PaginationInput,
  PlatformId,
} from "./types";

export interface PlatformMetadata {
  id: PlatformId;
  name: string;
  matches(url: string): boolean;
}

export interface PlatformAdapter extends PlatformMetadata {
  listConversations(input: PaginationInput): Promise<Page<ConversationSummary>>;
  getConversation(id: string): Promise<ConversationDocument>;
}

export interface Exporter<TInput, TResult = void> {
  readonly format: "markdown" | "png";
  export(input: TInput): Promise<TResult>;
}
