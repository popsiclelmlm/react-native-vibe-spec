# Feature Spec: TanStack Query Inbox Pagination

## User Outcome

Users can browse their inbox with responsive pull-to-refresh and pagination while keeping local filter state separate from cached server data.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- refreshing
- paginating
- empty inbox
- request failed
- offline cached view

## Navigation Impact

- Adds route: `/inbox`
- Deep link behavior: direct links restore the inbox screen and refetch the first page when connectivity is available

## Data Contract

- `GET /inbox/messages`
- Request shape: cursor, page size, unread filter
- Response shape: message summaries, next cursor, unread count
- Error shape: unauthorized, rate limited, transient network failure

## State and Data Flow

- State library or framework: TanStack Query plus local component state
- State ownership by layer: TanStack Query owns paginated server snapshots; screen state owns unread filter sheet visibility and selected tabs
- Mutation boundaries: query cache changes happen through query client invalidation and mutation callbacks only; local UI state changes stay inside screen actions
- Persistence policy: optional persisted query cache stores message summaries only; filter UI state does not persist across sign-out
- Selectors or derivations: `selectUnreadMessages`, `selectCanLoadMore`, and grouped date sections derive from cached pages
- Async flow and cancellation: pull-to-refresh cancels stale page requests before refetch; leaving the screen aborts in-flight pagination observers
- Optimistic updates and rollback: optimistic read-state markers revert if mark-as-read mutation fails
- Logging and redaction constraints: analytics logs page size, cursor presence, and result counts only
- Security constraints: cached inbox pages exclude auth headers, decrypted message bodies, and attachment secrets

## Storage

- Local storage: optional persisted query cache metadata and message summaries
- Secure storage: none
- Cache invalidation: invalidate inbox queries after mark-as-read, archive, or sign-out
- Data that must never be stored: auth tokens, raw headers, decrypted attachments

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: query selectors and section derivation logic
- Integration: refresh cancellation, pagination merge, optimistic read rollback
- E2E: open inbox, paginate, go offline, and refresh on reconnect
- Accessibility: refresh control and pagination announcements remain screen-reader visible
- Security: persisted query cache whitelist excludes sensitive message content

## Acceptance Criteria

- [ ] Pull-to-refresh does not duplicate pages or stale cursors.
- [ ] Offline inbox view uses cached summaries without exposing sensitive payloads.
- [ ] Failed read-state mutations roll back cached unread counts consistently.
