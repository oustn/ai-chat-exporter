# AI Chat Exporter

[![CI](https://github.com/oustn/ai-chat-exporter/actions/workflows/ci.yml/badge.svg)](https://github.com/oustn/ai-chat-exporter/actions/workflows/ci.yml)
[![Release](https://github.com/oustn/ai-chat-exporter/actions/workflows/release.yml/badge.svg)](https://github.com/oustn/ai-chat-exporter/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

基于 WXT、TypeScript、React、Tailwind CSS 和 shadcn/ui 风格组件构建的浏览器扩展。当前支持 ChatGPT，并通过平台适配器结构为 Gemini、DeepSeek 等产品预留接入边界。

## 功能

- Popup 分页读取 ChatGPT 会话列表。
- 下载完整会话为 Markdown。
- 在当前会话页面选择单条或多条消息。
- 复制选中消息的 Markdown。
- 将选中的已渲染消息导出为 PNG。

当前版本不支持 PDF 导出。

## 技术栈

- WXT + Chrome Manifest V3
- TypeScript + React
- Tailwind CSS + shadcn/ui 风格组件
- Turndown + dom-to-image-more
- Vitest + oxlint + oxfmt
- pnpm

## 本地开发

```bash
pnpm install
pnpm dev
```

WXT 会启动开发模式并生成浏览器扩展产物。生产构建：

```bash
pnpm build
```

Chrome / Edge 加载目录：

```text
.output/chrome-mv3
```

生成发布 ZIP：

```bash
pnpm zip
```

## 质量检查

```bash
pnpm check
```

该命令依次执行 TypeScript 类型检查、oxlint、oxfmt 格式检查和 Vitest。项目不使用 ESLint。

## 发布

项目采用 Conventional Commits 和 semantic-release。合并到 `main` 后，发布工作流会自动分析提交、更新 `CHANGELOG.md` 和版本号、构建 Chrome/Edge ZIP，并创建 GitHub Release。

常用提交类型：

- `fix:` 发布补丁版本。
- `feat:` 发布次版本。
- 带 `BREAKING CHANGE:` 的提交发布主版本。

## 目录结构

```text
src/
  entrypoints/              WXT popup、content、background 入口
  components/               React 业务组件和 UI primitives
  core/                     跨平台领域模型和纯函数
  exporters/                Markdown、PNG 导出器
  platforms/
    chatgpt/                ChatGPT API、认证、归一化和 DOM adapter
    registry.ts             平台注册表
  runtime/                  扩展运行时消息
  styles/                   Tailwind 基础样式
```

## 平台接入

新增平台时，在 `src/platforms/<platform>/` 实现：

1. URL 匹配与平台元数据。
2. 会话列表和完整会话读取。
3. 平台响应到 `ConversationDocument` 的归一化。
4. 当前页面消息 DOM 的扫描与提取。
5. 在 `src/platforms/registry.ts` 注册平台。

平台模块只处理数据源和 DOM 差异，Markdown/PNG 格式逻辑保留在通用导出器中。

## 认证说明

ChatGPT adapter 在当前 ChatGPT 页面主世界中通过 `/api/auth/session` 动态读取短期访问令牌，并从令牌中取得账号 ID。令牌、原始接口响应和 DOM 节点不会写入扩展 storage。

ChatGPT 后端接口属于非公开接口，接口或 DOM 结构变化时需要更新 `src/platforms/chatgpt/`。
