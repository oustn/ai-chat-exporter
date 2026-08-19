import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

import packageJson from "./package.json";

export default defineConfig({
  srcDir: "src",
  modules: [],
  manifest: {
    name: "AI Chat Exporter",
    description: "Export AI chat conversations as Markdown or PNG.",
    version: packageJson.version,
    permissions: ["activeTab", "scripting", "downloads"],
    host_permissions: ["https://chatgpt.com/*"],
    action: {
      default_icon: {
        16: "icons/16.png",
        32: "icons/32.png",
        48: "icons/48.png",
        128: "icons/128.png",
      },
    },
  },
  vite: () => ({
    plugins: [react()],
  }),
});
