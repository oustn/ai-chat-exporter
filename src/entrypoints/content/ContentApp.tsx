import { useCallback, useEffect, useMemo, useState } from "react";

import { ExportToolbar } from "../../components/export-toolbar";
import { MessageControls } from "../../components/message-controls";
import { TooltipProvider } from "../../components/ui/tooltip";
import { selectedMessagesToMarkdown } from "../../exporters";
import { exportElementsAsPng } from "../../exporters/png";
import {
  sortTargetsByDocumentOrder,
  targetToMessageBlock,
  type PageMessageTarget,
} from "../../platforms/page-messages";
import { scanCurrentPageMessages } from "../../platforms/page-registry";

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("浏览器拒绝了剪贴板写入");
  }
}

export function ContentApp() {
  const [targets, setTargets] = useState<PageMessageTarget[]>(scanCurrentPageMessages);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [exportingPng, setExportingPng] = useState(false);

  const scan = useCallback(() => setTargets(scanCurrentPageMessages()), []);

  useEffect(() => {
    let frame = 0;
    const queueScan = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    };
    const observer = new MutationObserver(queueScan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("scroll", queueScan, true);
    window.addEventListener("resize", queueScan);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueScan, true);
      window.removeEventListener("resize", queueScan);
    };
  }, [scan]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selected = useMemo(
    () => sortTargetsByDocumentOrder(targets.filter((target) => selectedIds.has(target.id))),
    [selectedIds, targets],
  );

  useEffect(() => {
    for (const target of targets) {
      target.turn.toggleAttribute("data-ai-exporter-selected", selectedIds.has(target.id));
    }
    return () => {
      for (const target of targets) target.turn.removeAttribute("data-ai-exporter-selected");
    };
  }, [selectedIds, targets]);

  function toggle(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyTargets(items: PageMessageTarget[]) {
    const markdown = selectedMessagesToMarkdown(items.map(targetToMessageBlock));
    if (!markdown) throw new Error("没有找到可复制的消息内容");
    await copyText(markdown);
    setToast(`已复制 ${items.length} 条消息的 Markdown`);
  }

  async function exportPng() {
    setExportingPng(true);
    try {
      const title = document.title.replace(/\s*[|\-–]\s*ChatGPT.*$/i, "") || "ChatGPT";
      await exportElementsAsPng({ elements: selected.map((target) => target.turn), title });
      setToast(`已生成 ${selected.length} 条消息的 PNG`);
    } catch (error) {
      setToast(`PNG 生成失败：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setExportingPng(false);
    }
  }

  return (
    <TooltipProvider delayDuration={250}>
      {targets.map((target) => (
        <MessageControls
          key={target.id}
          target={target}
          selected={selectedIds.has(target.id)}
          onToggle={() => toggle(target.id)}
          onCopy={() => void copyTargets([target]).catch((error) => setToast(String(error)))}
        />
      ))}
      <ExportToolbar
        count={selected.length}
        exportingPng={exportingPng}
        onCopy={() => void copyTargets(selected).catch((error) => setToast(String(error)))}
        onExportPng={() => void exportPng()}
        onClear={() => setSelectedIds(new Set())}
      />
      {toast && <div className="toast">{toast}</div>}
    </TooltipProvider>
  );
}
