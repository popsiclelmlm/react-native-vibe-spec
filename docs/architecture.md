# Architecture

This repository is a tooling and specification monorepo.

## Package Boundaries

- `packages/core`: pure Node.js logic for detection, scoring, and generators
- `packages/cli`: command-line interface and argument parsing
- `packages/eslint-config`: shareable ESLint preset
- `packages/tsconfig`: shareable TypeScript config
- `packages/agents`: agent instruction assets
- `packages/mcp-server`: future MCP integration
- `packages/doctor`: future deeper diagnostics

## Rules

- Keep CLI commands thin.
- Keep detection and scoring logic in `packages/core`.
- Avoid external runtime dependencies until a feature clearly needs one.
- Keep templates versionable and readable as standalone markdown.
- Do not couple the spec to one React Native app architecture.
