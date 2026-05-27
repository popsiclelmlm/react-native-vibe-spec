# Redux Toolkit Data-Flow Spec

## Use When

- State is shared across multiple features or navigation trees.
- Reducer transitions must be predictable and easy to review.
- Middleware, listener effects, offline queues, or action tracing are required.
- The team wants a single app store with explicit slices and selectors.

## Required Decisions

- Store owner and module path.
- Slice names, state shape, and initial state.
- Actions that can mutate each slice.
- Thunks, listener middleware, RTK Query endpoints, or other async boundaries.
- Selectors exposed to screens and hooks.
- Persistence whitelist, storage backend, versioning, and migrations.
- Reset behavior for logout, account switch, and corrupted persisted state.
- Devtools/logging policy for production and sensitive payloads.

## Rules

- Reducers must stay pure and serializable.
- Screens must dispatch named actions or thunks, not mutate state directly.
- Screens should read through selectors or typed hooks, not internal slice paths.
- Access tokens, refresh tokens, one-time passwords, private keys, and sensitive payloads must not be stored in Redux persistence.
- Persisted slices must define invalidation and migration behavior.
- Optimistic updates must name their rollback action and failure UX.
- Middleware must not log headers, tokens, PII, or full API payloads.
- RTK Query cache ownership must not be duplicated in another app-level store.

## Tests

- Reducer tests for core transitions.
- Selector tests for derived state.
- Async thunk or listener tests for success, failure, cancellation, and retry.
- Integration tests for user-visible loading, optimistic, rollback, offline, and reset flows.

