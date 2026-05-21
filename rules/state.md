# State Rules

## Boundaries

- Server state belongs in the approved query/cache layer.
- Client UI state belongs close to the component or feature.
- Form state belongs in the approved form strategy.
- Persisted state must be listed in the feature spec.
- Sensitive state must use approved secure storage.

## Rules

- Do not persist data just because it is convenient.
- Do not store access tokens in general-purpose async storage.
- Cache invalidation rules must be documented for server state.
- State libraries must not be added without updating architecture docs.
- Optimistic updates must define rollback behavior.
