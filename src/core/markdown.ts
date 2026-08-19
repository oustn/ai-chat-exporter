import TurndownService from "turndown";

import type { MessageBlock } from "./types";

const ROLE_LABELS: Partial<Record<MessageBlock["role"], string>> = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool",
};

export function messagesToMarkdown(messages: MessageBlock[]): string {
  const sections = messages.flatMap((message) => {
    const content = message.content.trim();
    const label = ROLE_LABELS[message.role];
    return label && content ? [`## ${label}\n\n${content}`] : [];
  });

  return sections.length ? `${sections.join("\n\n")}\n` : "";
}

export function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    headingStyle: "atx",
  });

  turndown.addRule("fencedCodeBlock", {
    filter: (node) => node.nodeName === "PRE" && Boolean(node.querySelector("code")),
    replacement: (_content, node) => {
      const code = node.querySelector("code");
      const language =
        code?.className.match(/(?:^|\s)language-([^\s]+)/)?.[1] ??
        code?.getAttribute("data-language") ??
        "";
      const text = (code?.textContent ?? "").replace(/\n$/, "");
      return `\n\n\`\`\`${language}\n${text}\n\`\`\`\n\n`;
    },
  });

  return turndown.turndown(html).trim();
}
