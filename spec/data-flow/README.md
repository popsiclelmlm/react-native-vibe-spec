# React Native Data-Flow Specs

React Native apps often mix server state, client UI state, form state, persisted state, and native capability state. AI agents must not choose or modify a data-flow framework implicitly.

Use these specs when a project uses or adds a state/data-flow dependency:

- [Redux Toolkit](./redux-toolkit.md)
- [Zustand](./zustand.md)
- [MobX](./mobx.md)
- [TanStack Query](./tanstack-query.md)
- [Apollo Client](./apollo-client.md)
- [Jotai](./jotai.md)
- [Recoil](./recoil.md)
- [XState](./xstate.md)

## Common Contract

Every feature spec or technical plan that touches shared state must declare:

- State owner: server cache, feature store, app store, form controller, or native module.
- Framework: Redux Toolkit, Zustand, MobX, TanStack Query, Apollo, local React state, or custom.
- Mutation boundary: which functions/actions/events are allowed to change state.
- Async flow: where network calls, retries, cancellation, and optimistic updates live.
- Selectors or derivations: how screens read state without coupling to internal shape.
- Persistence: exact keys, storage backend, hydration behavior, and invalidation rules.
- Sensitive data: values that must never be persisted, logged, snapshotted, or exposed to devtools.
- Reset behavior: logout, account switch, app reinstall, cache clear, and corrupted storage.
- Tests: unit coverage for transitions and integration coverage for user-visible flows.

## Framework Selection

- Use server-state tools for remote data ownership, cache invalidation, pagination, and refetching.
- Use local React state for component-only UI state.
- Use form libraries for validation-heavy form state.
- Use Redux Toolkit when cross-feature state, strict action logs, middleware, or predictable reducers are required.
- Use Zustand when a small app or feature store needs minimal ceremony and explicit actions.
- Use MobX when observable domain models and derived values are a deliberate architecture decision.
- Use Jotai or Recoil only when atom/selector ownership is explicit and provider scope is documented.
- Use XState when states, events, guards, and transitions are the clearest workflow contract.

Adding a new state/data-flow library requires updating `docs/architecture.md`, the feature spec, the technical plan, and relevant tests.
