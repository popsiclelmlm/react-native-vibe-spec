# React Native Vibe Spec v0.1

`react-native-vibe-spec` defines how AI coding agents should plan, implement, test, review, and release React Native changes.

## Purpose

The spec exists to prevent agents from guessing project architecture. Every meaningful change should be grounded in explicit product intent, platform behavior, data contracts, storage rules, security boundaries, tests, and release impact.

## Core Principles

1. Spec before code.
2. Project conventions beat generic examples.
3. Platform behavior is part of the requirement.
4. Security and release are design constraints, not afterthoughts.
5. Tests and checklists are part of the implementation.
6. Agent output must be reviewable by humans.

## Required Artifacts

For new features:

- `spec.md`: user outcome, platforms, UX states, navigation, data, storage, permissions, tests, acceptance criteria
- `plan.md`: architecture impact, dependencies, state model, data flow, platform notes, risks, verification
- `tasks.md`: small implementation steps and validation steps
- `acceptance.md`: final checklist used during review

For project-level adoption:

- `AGENTS.md` guidance coverage
- `docs/architecture.md`
- `docs/security.md`
- `docs/release.md`
- `templates/`
- Quality scripts in `package.json`

For app-level state/data-flow changes:

- A named state owner and framework decision
- A mutation boundary for writes
- A read boundary through selectors, hooks, computed values, or server-cache APIs
- Persistence, hydration, invalidation, reset, and migration rules
- Security rules for values that must never be stored, logged, snapshotted, or exposed to devtools

## Agent Workflow

1. Read `AGENTS.md`, `docs/architecture.md`, and the relevant feature spec.
2. If no feature spec exists for new behavior, create one first.
3. Create or update a technical plan before implementation.
4. Break the work into tasks that can be independently reviewed.
5. Implement the smallest coherent task first.
6. Run relevant checks.
7. Summarize changed files, verification, and remaining risk.

## React Native Scope

A compliant feature spec must name:

- iOS support status and behavior
- Android support status and behavior
- Web support status and optional web behavior
- Platform support values as `required`, `optional`, or `not-supported`
- Navigation and deep-link impact
- Data contracts
- Network boundaries, allowed hosts, TLS, and cleartext exceptions
- Client, server, form, and persisted state boundaries
- State/data-flow framework, when shared state is involved
- Offline, loading, error, empty, and permission-denied states when relevant
- Secure storage and cache behavior
- Required tests
- Release or rollback impact

## Scoring

`rnvibe check` scores readiness from 0 to 100. The initial score covers:

- React Native or Expo detection
- Package manager and lockfile pinning
- TypeScript
- `AGENTS.md`
- Feature spec coverage
- Template coverage
- Quality scripts
- Vibe spec check script
- CI workflow coverage
- E2E script
- Security guidance coverage
- Release guidance coverage
- Obvious secret-like variable names
- Non-local cleartext HTTP endpoints
- Optional agent-specific instructions

The score is a readiness signal, not a security guarantee.

## Compatibility

The spec should remain compatible with:

- Expo-first projects
- Bare React Native projects
- React Native libraries
- Native modules
- Multi-package monorepos
- Existing navigation, state, API, styling, and test choices

The spec should not force a single app architecture. It should force decisions to be explicit.
