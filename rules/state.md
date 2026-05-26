# State Rules

## Boundaries

- Server state belongs in the approved query/cache layer.
- Client UI state belongs close to the component or feature.
- Form state belongs in the approved form strategy.
- Persisted state must be listed in the feature spec.
- Sensitive state must use approved secure storage.
- Every feature spec must name the state library or framework in use, even when the answer is "React local state only".

## Rules

- Do not persist data just because it is convenient.
- Do not store access tokens in general-purpose async storage.
- Cache invalidation rules must be documented for server state.
- State libraries must not be added without updating architecture docs.
- Optimistic updates must define rollback behavior.
- Specs and plans must declare state ownership, mutation boundaries, persistence, selectors or derivations, async flow, logging or redaction, and security constraints.
- Redux or Redux Toolkit usage must document slice ownership, async thunk or RTK Query boundaries, middleware side effects, and selector inputs.
- Zustand usage must document store ownership, action mutation boundaries, persistence middleware scope, and subscription selector behavior.
- MobX usage must document observable ownership, action boundaries, computed values, and where reactions are allowed to trigger side effects.
