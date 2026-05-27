# Apollo Client Data-Flow Spec

## Use When

- The app consumes GraphQL APIs and needs normalized cache behavior.
- Fragments, cache policies, or GraphQL mutations are the primary data-flow contract.

## Required Decisions

- Client owner and provider boundary.
- Schema operation files, generated types, and fragment ownership.
- Cache type policies, key fields, merge functions, and eviction rules.
- Mutation update strategy: refetch, cache modify, optimistic response, or field policy.
- Error policy and GraphQL/network error mapping.
- Persistence, hydration, and reset behavior for user-scoped cache.
- Sensitive fields that must not be cached, persisted, logged, or exposed to devtools.

## Rules

- Operations must use typed documents or generated types when the project supports them.
- Cache identity and merge behavior must be explicit for paginated or normalized entities.
- Mutations must define cache update or invalidation behavior.
- Optimistic responses must match the schema shape and define rollback UX.
- User-scoped cache must reset on logout and account switch.
- GraphQL variables, headers, and full payloads must not be logged when they contain sensitive data.

## Tests

- Cache policy tests for pagination, merge, eviction, and identity.
- Mutation tests for optimistic, failure, and cache update behavior.
- Integration tests for loading, partial data, GraphQL errors, network errors, offline, and reset flows.

