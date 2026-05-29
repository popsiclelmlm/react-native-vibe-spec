# react-native-vibe-spec

Specification-first React Native development for AI coding agents.

`react-native-vibe-spec` is an open engineering standard and toolkit for building production-ready React Native apps with AI coding agents. It turns vague prompts into verifiable mobile engineering workflows: spec, plan, tasks, implementation, checks, review, and release.

## Why

AI coding agents can read repositories, edit files, run commands, fix bugs, add tests, and open pull requests. React Native apps still need more than fast code generation: they need architecture, platform rules, security boundaries, testing discipline, release readiness, and human review.

This project is not another app generator or boilerplate. It gives AI agents a project-level engineering contract so they stop guessing your React Native architecture.

## What It Provides

- React Native feature spec templates
- AI agent instructions through `AGENTS.md`
- Architecture, navigation, state, UI, accessibility, performance, security, testing, and release rules
- Framework-specific data-flow specs for Redux Toolkit, Zustand, MobX, and related state/data libraries
- CLI validation with `rnvibe check`, including secret-name and network-boundary signals
- Feature workflow scaffolding with `rnvibe new feature`
- ESLint and TypeScript preset packages
- Agent instruction package and planned MCP server
- Example specs for Expo apps, bare React Native apps, native modules, and design systems

## Quick Start

```bash
npx react-native-vibe-spec init --agent codex,copilot,claude,cursor
npx react-native-vibe-spec new feature auth-login
npx react-native-vibe-spec check
```

During local development of this repository:

```bash
pnpm install
pnpm rnvibe help
pnpm test
```

If your local Corepack install fails to activate pnpm, use:

```bash
npx --yes pnpm@9.15.0 install
```

## Workflow

1. Specify the user outcome, platforms, UX states, data contracts, storage, permissions, and acceptance criteria.
2. Plan architecture, dependencies, state, API flow, risks, and verification.
3. Break the plan into small tasks.
4. Implement one coherent task at a time.
5. Validate with typecheck, lint, tests, security checks, and platform review.
6. Review the diff against the spec.
7. Release with versioning, rollback, and observability notes.

## CLI

```bash
rnvibe init [--agent codex,copilot,claude,cursor]
rnvibe new feature <name>
rnvibe check [--json] [--strict]
rnvibe score
rnvibe doctor
rnvibe generate agents
rnvibe generate pr-checklist
```

Example output:

```text
React Native Vibe Spec Check
✓ TypeScript configured
✓ AGENTS.md covers required guidance
✓ Feature specs cover required sections
✓ Spec templates cover required sections
✓ Vibe spec check script configured
△ E2E test command found
✓ State/data-flow decision documented
✓ Security guidance covers required topics
✓ Release guidance covers required topics
✓ No obvious secret names detected
✓ No non-local cleartext HTTP endpoints detected
Score: 94/100
```

## Repository Map

```text
react-native-vibe-spec/
  spec/                 Versioned specification and schema
    data-flow/          Framework-specific state and data-flow specs
  templates/            Spec, plan, task, review, and release templates
  rules/                React Native engineering rules
  packages/
    core/               Detection, scoring, and generators
    cli/                rnvibe command
    eslint-config/      Shared ESLint preset
    tsconfig/           Shared TypeScript preset
    agents/             Agent instruction pack
    mcp-server/         Planned MCP tool server
    doctor/             Planned deeper diagnostics
  examples/             Example workflows and app scenarios
```

## Positioning

`react-native-vibe-spec` is:

- An engineering standard for AI-native React Native development
- A CLI validator for project readiness
- A set of agent instructions and checklists
- A foundation for future MCP tooling

It is not:

- A text-to-app platform
- A visual builder
- A one-size-fits-all boilerplate
- A prompt collection without checks

## Roadmap

- v0.1: specification, templates, AGENTS.md, rules, basic CLI
- v0.2: stronger Expo and bare React Native detection
- v0.3: Codex skill, Claude Code instructions, Copilot instructions, Cursor rules, MCP server
- v0.4: ESLint config, TypeScript preset, security scanner rules, CI templates, state/data-flow checks
- v1.0: stable semver spec, RFC process, example apps, compatibility matrix

## Slogan

Stop vibe-coding React Native apps. Spec them.
