export const CHATGPT_ORIGIN = "https://chatgpt.com";
export const CHATGPT_PAGE_SIZE = 28;

export function isChatGptUrl(url: string): boolean {
  try {
    return new URL(url).origin === CHATGPT_ORIGIN;
  } catch {
    return false;
  }
}
