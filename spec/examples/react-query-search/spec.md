# Feature Spec: React Query Search With Local Draft State

## User Outcome

Users can type into search, see debounced results, and retry failed loads without the input field losing local draft state.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- typing draft
- loading results
- results loaded
- empty results
- request failed
- offline retry queued

## Navigation Impact

- Updates route: `/search`
- Deep link behavior: `app://search?q=` seeds the initial draft query without forcing an immediate request

## Data Contract

- `GET /search`
- Request shape: query string, cursor, locale
- Response shape: result items, next cursor, server timestamp
- Error shape: validation failure, rate limit, transient network failure

## State and Data Flow

- State library or framework: React local state for draft input plus TanStack Query for server state
- State ownership by layer: screen owns draft query and filter chip UI state; query layer owns result cache, status, retries, and pagination
- Mutation boundaries: local draft changes stay in component state; query invalidation and pagination only happen through query hooks and approved helpers
- Persistence policy: recent searches persist only if the feature spec explicitly enables them; query cache follows project cache TTL rules
- Selectors or derivations: derived debounced query, empty-state visibility, and grouped result sections
- Async flow and cancellation: input debounce cancels stale requests; pull-to-refresh preserves the current draft while refetching
- Optimistic updates and rollback: filter-chip toggles update locally first and roll back if the query contract rejects unsupported combinations
- Logging and redaction constraints: analytics record query length and filter ids, never raw search text for sensitive domains
- Security constraints: query params containing sensitive identifiers must be redacted from logs, crash reports, and copied deep links

## Storage

- Local storage: optional recent-search metadata only
- Secure storage: none
- Cache invalidation: invalidate search queries on account switch or locale change
- Data that must never be stored: raw sensitive queries, auth headers, server error payloads with personal data

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: debounced draft-state transitions and derived empty-state selectors
- Integration: stale request cancellation, offline retry, and query invalidation on account switch
- E2E: deep link into search, edit query, refresh, and recover from failure
- Accessibility: loading, empty, and retry announcements remain screen-reader readable
- Security: analytics and logs redact raw search text when the feature is marked sensitive

## Acceptance Criteria

- [ ] Typing a new query does not wipe the previous successful result list until the next request resolves.
- [ ] Stale search requests are canceled or ignored when the draft query changes.
- [ ] Sensitive query text is excluded from logs, analytics payloads, and persisted recent-search state.
