# Promotion Plan

## Positioning

`react-native-vibe-spec` is a spec-first engineering standard for React Native teams using AI coding agents. The message is not "generate an app"; the message is "make AI-assisted mobile changes reviewable, secure, and shippable."

## Audiences

- React Native tech leads adopting Codex, Claude Code, Copilot, Cursor, or other coding agents.
- Expo teams that need agent-readable project rules before feature work.
- Mobile platform teams that own security, release, and architecture standards.
- Open-source maintainers who want contributors and agents to follow the same workflow.
- Founders and solo builders using agents but worried about hidden mobile regressions.

## Channels

- GitHub: README, topics, examples, issues, and releases. This is the primary conversion surface.
- npm: package description, keywords, CLI examples, and versioned release notes.
- React Native communities: React Native Directory, Reactiflux, r/reactnative, and React Native newsletter submissions.
- Expo communities: Expo Discord, Expo forums, and example-led posts for Expo Router apps.
- AI coding-agent communities: Codex, Claude Code, Cursor, and Copilot discussions where users ask how to make agents safer.
- LinkedIn and X: short build-in-public posts aimed at mobile leads and AI-native engineering teams.
- Hacker News and Reddit: only for concrete launches, example apps, or measurable CLI improvements.
- Direct outreach: small RN teams, agency leads, and maintainers of popular RN starter kits.

## Launch Sequence

1. Repo polish: tighten README, add a one-command quick start, and keep `rnvibe check` output copyable.
2. Example-led soft launch: publish one Expo auth flow and one offline-first list example.
3. Community launch: post the standard as a checklist for AI-assisted RN work, not as a boilerplate.
4. Integration launch: highlight Codex/Copilot/Claude/Cursor instructions and CI-friendly checks.
5. Trust launch: publish security and state/data-flow rules, including Redux Toolkit, Zustand, and MobX specs.

## Recurring Promotion Loop

- Every improvement should produce one reusable artifact: a release note, screenshot, CLI output, checklist, or example diff.
- Prefer posts that teach a failure mode and show how the spec catches it.
- Do not post generic announcements without a concrete example, command, or rule.
- Track which channel produced stars, issues, installation attempts, or direct conversations.

## Post Angles

- "Stop vibe-coding React Native apps. Spec them."
- "A checklist and CLI for making AI agents respect your RN architecture."
- "How to tell an AI agent where Redux/Zustand/MobX state belongs before it writes code."
- "React Native security rules agents can actually load: secrets, token storage, logging, permissions, network boundaries."
- "Turn a vague feature prompt into spec, plan, tasks, acceptance checks, and PR review."

## Short Post Template

I am building `react-native-vibe-spec`: a spec-first standard and CLI for React Native teams using AI coding agents.

It gives agents explicit rules for architecture, navigation, state, security, testing, and release instead of letting them guess.

Quick start:

```bash
npx react-native-vibe-spec init --agent codex,copilot,claude,cursor
npx react-native-vibe-spec new feature auth-login
npx react-native-vibe-spec check
```

The goal: faster AI-assisted RN work without losing reviewability, platform discipline, or security boundaries.

