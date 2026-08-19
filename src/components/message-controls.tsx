import { Copy } from "lucide-react";

import type { PageMessageTarget } from "../platforms/page-messages";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MessageControlsProps {
  target: PageMessageTarget;
  selected: boolean;
  onToggle(): void;
  onCopy(): void;
}

export function MessageControls({ target, selected, onToggle, onCopy }: MessageControlsProps) {
  const visible = target.rect.bottom > 0 && target.rect.top < window.innerHeight;
  if (!visible) return null;

  return (
    <div
      className={`pointer-events-auto fixed z-50 flex h-9 items-center gap-2 rounded-md border bg-background px-2 shadow-md transition-colors ${selected ? "border-primary bg-primary/10" : "border-border"}`}
      style={{
        top: Math.max(8, target.rect.top + 8),
        right: Math.max(12, window.innerWidth - target.rect.right + 12),
      }}
    >
      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={selected ? "取消选择这条消息" : "选择这条消息"}
        />
        <span>{selected ? "已选择" : "选择"}</span>
      </label>
      <div className="h-4 w-px bg-border" aria-hidden="true" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="size-7" onClick={onCopy}>
            <Copy />
            <span className="sr-only">复制 Markdown</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">复制 Markdown</TooltipContent>
      </Tooltip>
    </div>
  );
}
