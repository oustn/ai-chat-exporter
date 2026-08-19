import { Download, LoaderCircle } from "lucide-react";

import type { ConversationSummary } from "../core";
import { formatConversationDate } from "../lib/date";
import { Button } from "./ui/button";

interface ConversationListProps {
  conversations: ConversationSummary[];
  exportingId: string | null;
  onExport(conversation: ConversationSummary): void;
}

export function ConversationList({ conversations, exportingId, onExport }: ConversationListProps) {
  return (
    <ul className="m-0 list-none divide-y divide-border p-0">
      {conversations.map((conversation) => {
        const exporting = exportingId === conversation.id;
        return (
          <li
            key={conversation.id}
            className="flex min-h-16 items-center gap-3 bg-white px-4 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <strong
                className="block truncate text-[13px] font-semibold"
                title={conversation.title}
              >
                {conversation.title}
              </strong>
              <time className="mt-1 block text-[11px] text-muted-foreground">
                {formatConversationDate(conversation.updatedAt)}
              </time>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={exporting}
              onClick={() => onExport(conversation)}
              title="导出为 Markdown"
              aria-label={`导出 ${conversation.title}`}
            >
              {exporting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
