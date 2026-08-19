import { Copy, ImageDown, LoaderCircle, X } from "lucide-react";

import { Button } from "./ui/button";

interface ExportToolbarProps {
  count: number;
  exportingPng: boolean;
  onCopy(): void;
  onExportPng(): void;
  onClear(): void;
}

export function ExportToolbar({
  count,
  exportingPng,
  onCopy,
  onExportPng,
  onClear,
}: ExportToolbarProps) {
  if (!count) return null;
  return (
    <div className="pointer-events-auto fixed bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-white p-2 pl-3 shadow-xl">
      <span className="whitespace-nowrap text-xs font-medium">已选 {count} 条</span>
      <Button size="sm" variant="outline" onClick={onCopy}>
        <Copy className="size-3.5" />
        复制 MD
      </Button>
      <Button size="sm" onClick={onExportPng} disabled={exportingPng}>
        {exportingPng ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <ImageDown className="size-3.5" />
        )}
        {exportingPng ? "生成中" : "导出 PNG"}
      </Button>
      <Button size="icon" variant="ghost" className="size-8" onClick={onClear} title="清除选择">
        <X className="size-4" />
      </Button>
    </div>
  );
}
