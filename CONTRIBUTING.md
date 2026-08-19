# Contributing

## Development

Requirements:

- Node.js 22 or newer
- pnpm 10

Install dependencies and run the extension in development mode:

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm check
pnpm build
```

## Commits

Use Conventional Commits so semantic-release can determine the next version:

```text
fix: exclude PNG staging nodes from message scanning
feat: add a new platform adapter
```

Use `BREAKING CHANGE:` in the commit body when a change breaks an existing contract.

## Platform adapters

Platform-specific API, normalization, and DOM behavior belongs in `src/platforms/<platform>/`. Shared models and exporters must not depend on a platform implementation.
