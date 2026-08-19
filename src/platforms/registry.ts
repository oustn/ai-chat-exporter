import type { PlatformAdapter, PlatformMetadata } from "../core";
import { createChatGptAdapter } from "./chatgpt/adapter";
import { isChatGptUrl } from "./chatgpt/constants";

export const platforms: PlatformMetadata[] = [
  { id: "chatgpt", name: "ChatGPT", matches: isChatGptUrl },
];

export function findPlatform(url: string): PlatformMetadata | null {
  return platforms.find((platform) => platform.matches(url)) ?? null;
}

export function createPlatformAdapter(tabId: number, url: string): PlatformAdapter {
  const platform = findPlatform(url);
  if (!platform) throw new Error("当前页面暂不支持，请打开 ChatGPT 会话页面。");

  switch (platform.id) {
    case "chatgpt":
      return createChatGptAdapter(tabId);
  }
}
