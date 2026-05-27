# State and Data Flow

`react-native-vibe-spec` does not require one state library. It requires every feature to make state decisions explicit enough for an agent and reviewer to verify.

## Every Feature Spec Must Declare

- State framework or no-framework choice
- State ownership for server, client UI, form, and persisted state
- Mutation boundaries
- Persistence and hydration rules
- Selectors and derivations
- Async flow and side effects
- Rollback or conflict handling
- Logging and observability
- Security constraints

## Framework Coverage

### Redux Toolkit / RTK Query

- Name the slice or API ownership.
- Define which mutations may write to state.
- Document cache invalidation, selectors, and optimistic rollback.

### Zustand

- Name each store and what it owns.
- Keep write APIs explicit and limited.
- Document which slices persist and how hydration affects startup.

### MobX

- Name observable boundaries.
- Restrict writes to actions.
- Document computed values, async actions, and hydration timing.

### Other Frameworks

If the project uses Jotai, XState, Recoil, or a custom pattern, document the same ownership, mutation, persistence, derivation, async, rollback, logging, and security concerns.
