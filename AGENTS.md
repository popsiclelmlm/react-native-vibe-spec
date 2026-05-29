# AGENTS.md

## React Native Vibe Spec

This repository defines `react-native-vibe-spec`, a spec-first engineering standard and toolkit for React Native apps built with AI coding agents.

## Non-negotiables

- Keep the project focused on specification, validation, and agent guidance. Do not turn it into a generic React Native boilerplate.
- Prefer small, versionable rules over long prompt-only documents.
- CLI behavior must be deterministic and runnable in CI.
- Security guidance must explicitly cover bundled secrets, token storage, logging, permissions, and network boundaries.
- Specs must keep platform behavior explicit for iOS, Android, and optional web.
- New features should update templates, rules, examples, and checks when relevant.

## Commands

- Install: `pnpm install`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
- Vibe check: `node packages/cli/bin/rnvibe.js check`

## Implementation Notes

- The CLI currently uses Node.js standard library only.
- `packages/core` owns detection, scoring, and generators.
- `packages/cli` should stay thin and delegate logic to `packages/core`.
- Keep documentation concise enough that agents can load the right file without flooding context.
