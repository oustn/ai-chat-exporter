import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { browser } from "wxt/browser";

import { ConversationList } from "../../components/conversation-list";
import { EmptyState } from "../../components/empty-state";
import { ErrorState } from "../../components/error-state";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { mergeConversationPage, type ConversationSummary } from "../../core";
import { createMarkdownFile, fileToDataUrl } from "../../exporters";
import { CHATGPT_PAGE_SIZE } from "../../platforms/chatgpt/constants";
import { createPlatformAdapter } from "../../platforms/registry";
import { requestDownload } from "../../runtime/messages";

interface ActiveContext {
  tabId: number;
  url: string;
}

interface LoadOptions {
  append: boolean;
  activeContext?: ActiveContext;
  offset: number;
}

async function getActiveContext(): Promise<ActiveContext> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) throw new Error("请先打开并登录受支持的 AI 聊天页面。");
  return { tabId: tab.id, url: tab.url };
}

export default function App() {
  const [context, setContext] = useState<ActiveContext | null>(null);
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async ({ append, activeContext, offset }: LoadOptions) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const active = append && activeContext ? activeContext : await getActiveContext();
      const adapter = createPlatformAdapter(active.tabId, active.url);
      const page = await adapter.listConversations({ offset, limit: CHATGPT_PAGE_SIZE });
      setContext(active);
      setItems((current) => (append ? mergeConversationPage(current, page.items) : page.items));
      setTotal(page.total);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // The popup intentionally loads once on mount; refresh and pagination are explicit actions.
  useEffect(() => {
    const timer = window.setTimeout(() => void load({ append: false, offset: 0 }), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function exportConversation(conversation: ConversationSummary) {
    if (!context) return;
    setExportingId(conversation.id);
    setError(null);
    try {
      const adapter = createPlatformAdapter(context.tabId, context.url);
      const document = await adapter.getConversation(conversation.id);
      const file = createMarkdownFile(document);
      await requestDownload(fileToDataUrl(file), file.filename);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setExportingId(null);
    }
  }

  return (
    <main className="flex h-[600px] flex-col bg-background text-foreground">
      <header className="flex min-h-[72px] items-center justify-between border-b bg-white px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-base font-semibold">AI 对话导出</h1>
            <Badge>ChatGPT</Badge>
          </div>
          <p className="m-0 mt-1 text-xs text-muted-foreground">
            {loading ? "正在读取会话..." : `显示 ${items.length} 条，共 ${total} 条`}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => void load({ append: false, offset: 0 })}
          disabled={loading}
          title="刷新"
          aria-label="刷新"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto">
        {error && <ErrorState message={error} />}
        {loading && !items.length ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" aria-label="正在加载" />
          </div>
        ) : items.length ? (
          <ConversationList
            conversations={items}
            exportingId={exportingId}
            onExport={(conversation) => void exportConversation(conversation)}
          />
        ) : !error ? (
          <EmptyState message="没有找到可导出的会话。" />
        ) : null}
      </section>

      {items.length < total && (
        <footer className="border-t bg-white p-3">
          <Button
            className="w-full"
            variant="outline"
            disabled={loadingMore}
            onClick={() =>
              void load({ append: true, activeContext: context ?? undefined, offset: items.length })
            }
          >
            {loadingMore && <LoaderCircle className="size-4 animate-spin" />}
            {loadingMore ? "正在加载..." : "加载更多"}
          </Button>
        </footer>
      )}
    </main>
  );
}
