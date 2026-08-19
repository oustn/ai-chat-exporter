export function mergeConversationPage<T extends { id: string }>(current: T[], next: T[]): T[] {
  const ids = new Set(current.map((item) => item.id));
  return [...current, ...next.filter((item) => !ids.has(item.id))];
}
