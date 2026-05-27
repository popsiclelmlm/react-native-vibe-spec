# State Rules

## Boundaries

- Server state belongs in the approved query/cache layer.
- Client UI state belongs close to the component or feature.
- Form state belongs in the approved form strategy.
- Persisted state must be listed in the feature spec.
- Sensitive state must use approved secure storage.
- App-level state libraries must be named in `docs/architecture.md`.
- Framework-specific rules live in `spec/data-flow/`.

## Rules

- Do not persist data just because it is convenient.
- Do not store access tokens in general-purpose async storage.
- Cache invalidation rules must be documented for server state.
- State libraries must not be added without updating architecture docs.
- Shared state changes must name the mutation boundary and read boundary.
- Persistence must define hydration, invalidation, migration, and reset behavior.
- Optimistic updates must define rollback behavior.
- Logging, devtools, analytics, and crash reports must not expose tokens, PII, or sensitive payloads.

## Framework Specs

- Redux Toolkit: `spec/data-flow/redux-toolkit.md`
- Zustand: `spec/data-flow/zustand.md`
- MobX: `spec/data-flow/mobx.md`
- TanStack Query: `spec/data-flow/tanstack-query.md`
- Apollo Client: `spec/data-flow/apollo-client.md`
- Jotai: `spec/data-flow/jotai.md`
- Recoil: `spec/data-flow/recoil.md`
- XState: `spec/data-flow/xstate.md`
