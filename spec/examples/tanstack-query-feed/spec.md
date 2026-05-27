# Feature Spec: TanStack Query Infinite Feed Refresh

## User Outcome

Users can open a personalized feed, pull to refresh, and like posts with predictable retry and rollback behavior even during flaky network conditions.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- initial loading
- paginating
- refresh pending
- mutation pending
- refresh failed
- offline stale view

## Navigation Impact

- Updates route: `/feed`
- Deep link behavior: opening a feed deep link hydrates the first page before scrolling to the requested anchor

## Data Contract

- `GET /feed`
- `POST /feed/:id/like`
- Request shape: page cursor for feed fetches; post id for like mutation
- Response shape: paginated feed items with next cursor; like mutation returns canonical engagement counts
- Error shape: unauthorized, transient network failure, rate-limit response

## State and Data Flow

- State library or framework: TanStack Query with local component state for pull-to-refresh UI
- State ownership by layer: TanStack Query cache owns paginated feed data; screen-local state owns temporary refresh affordances only
- Mutation boundaries: cache writes happen through query and mutation handlers; components read derived query state and never mutate cached records directly
- Persistence policy: feed cache may persist non-sensitive item metadata for short-lived offline reopen; auth context stays outside the cache
- Selectors or derivations: derived selectors compute visible sections, stale badge visibility, and optimistic like state from cached pages
- Async flow and cancellation: foreground refresh cancels superseded page requests; pagination pauses while refresh is active; duplicate like taps coalesce per post
- Optimistic updates and rollback: optimistic likes update cached counts immediately and roll back on mutation error
- Logging and redaction constraints: network instrumentation logs route, query key, and latency only, never auth headers or full item payloads
- Security constraints: query cache must exclude tokens, signed media URLs, and private moderation metadata from persistence

## Storage

- Local storage: optional persisted feed metadata cache with expiry
- Secure storage: none
- Cache invalidation: invalidate `feed` queries after like mutation settle and on account switch
- Data that must never be stored: auth tokens, raw headers, private moderation flags

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: derived feed selectors and optimistic like helpers
- Integration: refresh cancellation, pagination resume, like rollback
- E2E: pull to refresh and like a post during degraded network conditions
- Accessibility: refresh status and like state changes are announced
- Security: persistence allowlist excludes tokens and signed URLs

## Acceptance Criteria

- [ ] Pull-to-refresh does not duplicate page fetches or corrupt pagination state.
- [ ] Failed like mutations restore the previous engagement count.
- [ ] Persisted query data excludes sensitive account and transport metadata.
