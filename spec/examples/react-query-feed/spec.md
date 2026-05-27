# Feature Spec: React Query Feed With Local UI State

## User Outcome

Users can browse a personalized feed, pull to refresh, and change local sort and filter controls without mixing ephemeral UI state into the server cache.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- initial loading
- refreshing
- paginating
- empty
- error
- offline stale data

## Navigation Impact

- Updates route: `/feed`
- Deep link behavior: feed deep links restore query params and local filter defaults before first fetch

## Data Contract

- `GET /feed`
- Request shape: cursor, sort key, and filter query params
- Response shape: items, next cursor, server timestamp
- Error shape: unauthorized, rate-limited, transient network failure

## State and Data Flow

- State library or framework: React local state for filters and pull-to-refresh UI plus TanStack Query for server data
- State ownership by layer: screen component owns selected sort, transient filter chips, and refresh affordances; TanStack Query owns feed pages and fetch status
- Mutation boundaries: UI state changes happen through component state setters only; feed writes happen through query invalidation and mutation handlers only
- Persistence policy: feed cache may persist under approved query persistence rules; local filter state resets on app restart unless product requirements change
- Selectors or derivations: derived visible items come from query data plus local sort and filter state; empty-state messaging derives from query status and item count
- Async flow and cancellation: query key changes cancel stale requests; pull-to-refresh invalidates the active query once; pagination ignores duplicate end-reached events while a page is loading
- Optimistic updates and rollback: optimistic reaction toggles stay scoped to mutation handlers and roll back on failure without corrupting feed cache
- Logging and redaction constraints: analytics log filter keys and pagination events only, never raw item payloads or auth headers
- Security constraints: query persistence excludes tokens, headers, and personalized payload fragments that are not approved for local storage

## Storage

- Local storage: optional persisted query cache metadata only
- Secure storage: none
- Cache invalidation: invalidate feed query on manual refresh, auth change, or successful reaction mutation
- Data that must never be stored: auth headers, access tokens, unredacted personalized payloads

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: local filter derivations and query-key builder
- Integration: query-key changes cancel stale requests and refresh preserves visible loading state
- E2E: open feed, pull to refresh, change filter, paginate
- Accessibility: refresh control, empty state, and retry actions are announced
- Security: persisted query cache and analytics payloads exclude sensitive fields

## Acceptance Criteria

- [ ] Local filter state stays screen-scoped and does not leak into unrelated routes.
- [ ] Query invalidation and pagination do not create duplicate feed requests.
- [ ] Persisted cache and analytics output exclude sensitive personalized payload data.
