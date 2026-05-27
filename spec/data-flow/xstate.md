# XState Data-Flow Spec

## Use When

- The feature has explicit states, events, guards, and transitions.
- Complex async workflows need a visible statechart rather than scattered booleans.

## Required Decisions

- Machine owner, module path, and actor lifecycle.
- States, events, guards, actions, services, and invoked actors.
- Context shape and which values may be persisted.
- Error, retry, cancellation, timeout, and rollback transitions.
- Integration boundary with React components and navigation.
- Logging, inspection, and production devtools policy.
- Reset behavior for logout, account switch, app restart, and failed hydration.

## Rules

- States and events must be named in user or domain language.
- Side effects must live in actions, services, or actors, not in render.
- Guards must be deterministic and testable.
- Persisted context must use an explicit whitelist and migration rule.
- Sensitive context values must not be persisted, logged, or exposed to inspectors.
- Machines that drive navigation must document route transitions and back behavior.

## Tests

- Transition tests for states, events, guards, and actions.
- Actor/service tests for success, failure, retry, cancellation, and timeout.
- Integration tests for UI states, navigation effects, persistence, hydration, reset, and rollback behavior.

