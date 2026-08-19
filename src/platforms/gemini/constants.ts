export const GEMINI_ORIGIN = "https://gemini.google.com";

export function isGeminiUrl(url: string): boolean {
  try {
    return new URL(url).origin === GEMINI_ORIGIN;
  } catch {
    return false;
  }
}
