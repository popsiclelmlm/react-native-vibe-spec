# Recoil Data-Flow Spec

## Use When

- The project already uses Recoil and needs atom/selector boundaries documented.
- The team accepts Recoil's project maturity and React Native compatibility constraints.

## Required Decisions

- Atom and selector ownership.
- Key naming convention.
- Provider boundary and reset behavior.
- Async selector loading, error, retry, and cancellation behavior.
- Persistence keys, hydration, migrations, and reset behavior.
- Sensitive state that must not be persisted, logged, or exposed to devtools.

## Rules

- Atom keys must be stable and unique.
- Selectors must be deterministic and side-effect free unless explicitly documented as async selectors.
- Writes must go through documented setters or transaction helpers.
- User-scoped persisted state must reset on logout and account switch.
- Sensitive values must not be persisted or logged.
- New Recoil adoption should be justified in `docs/architecture.md`.

## Tests

- Atom and selector tests for state transitions and derived values.
- Async selector tests for loading, success, failure, retry, and cancellation.
- Integration tests for provider scope, persistence, hydration, reset, and offline behavior.

