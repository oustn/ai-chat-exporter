const MAX_Z_INDEX = "2147483647";

export function configureContentUiLayer(shadowHost: HTMLElement, container: HTMLElement): void {
  Object.assign(shadowHost.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: MAX_Z_INDEX,
  });
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: MAX_Z_INDEX,
  });
}
