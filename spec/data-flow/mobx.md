# MobX Data-Flow Spec

## Use When

- The app intentionally models domain state as observable objects.
- Derived values are central to the feature and should be expressed as computed state.
- The team accepts MobX action boundaries and reaction lifecycle management as architecture rules.

## Required Decisions

- Store/model owner, lifecycle, and injection path.
- Observable fields, computed values, and actions.
- Which async flows live in actions, flows, services, or repositories.
- How React components observe state.
- Persistence keys, storage backend, hydration, migrations, and reset behavior.
- Reaction, autorun, and subscription disposal rules.
- Logging, inspection, and production devtools policy.

## Rules

- State changes must happen through named actions or approved flows.
- Computed values must be deterministic and side-effect free.
- Reactions and subscriptions must be disposed when their owner unmounts or is reset.
- UI components should not encode domain mutation logic inline.
- Persist only explicit safe fields, never tokens, one-time passwords, private keys, or sensitive payloads.
- Hydration must not trigger duplicate network calls or stale writes.
- Observable state must not cross network, logging, or analytics boundaries without explicit serialization.

## Tests

- Action tests for state transitions.
- Computed value tests for derived behavior.
- Reaction lifecycle tests when reactions trigger side effects.
- Integration tests for hydration, reset, async failure, optimistic rollback, and offline behavior.

