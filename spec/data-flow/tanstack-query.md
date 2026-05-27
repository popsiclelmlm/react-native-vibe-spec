# TanStack Query Data-Flow Spec

## Use When

- Remote server data needs caching, refetching, pagination, mutations, retries, or offline-aware invalidation.
- The server owns the data and the client should not duplicate it in an app-level store.

## Required Decisions

- Query keys and key factories.
- Query functions and network boundary.
- Mutation functions, optimistic updates, rollback, and invalidation.
- Cache time, stale time, retry, cancellation, and refetch policy.
- Persistence or offline cache strategy, when used.
- Error mapping and loading/empty/offline UI states.
- Sensitive data that must not be cached, logged, or exposed to devtools.

## Rules

- Query keys must be deterministic and include all inputs that affect the result.
- Server state must not be copied into Redux, Zustand, MobX, or local state without a documented reason.
- Mutations must define invalidated or updated queries.
- Optimistic updates must define rollback behavior.
- Cache persistence must use an explicit whitelist and reset on logout/account switch when user-scoped.
- Query and mutation logging must not include tokens, headers, PII, or sensitive payloads.

## Tests

- Query key tests for parameterized data.
- Mutation tests for success, failure, retry, invalidation, and rollback.
- Integration tests for loading, empty, error, offline, refetch, and cache hydration behavior.

