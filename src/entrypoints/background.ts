import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

import type { DownloadRequest, DownloadResponse } from "../runtime/messages";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: unknown) => {
    const request = message as Partial<DownloadRequest>;
    if (request.type !== "download") return undefined;

    return (async (): Promise<DownloadResponse> => {
      if (typeof request.dataUrl !== "string" || typeof request.filename !== "string") {
        return { ok: false, error: "下载参数无效" };
      }
      try {
        await browser.downloads.download({
          url: request.dataUrl,
          filename: request.filename,
          saveAs: false,
        });
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    })();
  });
});
