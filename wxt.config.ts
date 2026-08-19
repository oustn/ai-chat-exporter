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
  },
  vite: () => ({
    plugins: [react()],
  }),
});
