/// <reference types="vite/client" />

declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module "dom-to-image-more" {
  export function toPng(node: HTMLElement, options?: Record<string, unknown>): Promise<string>;
}
