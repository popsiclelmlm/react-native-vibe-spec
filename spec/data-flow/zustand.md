# Zustand Data-Flow Spec

## Use When

- A feature or small app needs a lightweight store with explicit actions.
- Shared client state is useful, but a global Redux-style action log is not required.
- State can be owned by a small number of stores with clear selectors.

## Required Decisions

- Store owner, file path, and scope: app, feature, or screen group.
- Store shape and initial state.
- Public actions that are allowed to mutate state.
- Selectors used by screens and hooks.
- Middleware usage: `persist`, `immer`, `devtools`, or custom middleware.
- Persistence keys, storage backend, hydration state, migrations, and reset behavior.
- Async action boundaries, retry policy, cancellation, and optimistic rollback.
- Logging and devtools policy for sensitive fields.

## Rules

- Do not create stores during render.
- Mutations must go through named store actions.
- Screens should subscribe to the smallest stable selector needed for rendering.
- Persist only an explicit whitelist of safe fields.
- Sensitive values must not be persisted, logged, or exposed through devtools snapshots.
- Hydration must have a defined loading or fallback state when it affects UI.
- Store reset must be available for logout, account switch, and test isolation.
- Cross-store dependencies must be documented in the technical plan.

## Tests

- Store action tests for state transitions.
- Selector tests for derived values that affect rendering.
- Persistence tests for whitelist, migration, hydration, and reset behavior.
- Integration tests for async success, failure, retry, optimistic rollback, and offline UX.

