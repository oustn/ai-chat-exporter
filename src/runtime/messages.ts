import { browser } from "wxt/browser";

export interface DownloadRequest {
  type: "download";
  dataUrl: string;
  filename: string;
}

export interface DownloadResponse {
  ok: boolean;
  error?: string;
}

export async function requestDownload(dataUrl: string, filename: string): Promise<void> {
  const response = (await browser.runtime.sendMessage({
    type: "download",
    dataUrl,
    filename,
  } satisfies DownloadRequest)) as DownloadResponse;
  if (!response?.ok) throw new Error(response?.error || "下载失败");
}
