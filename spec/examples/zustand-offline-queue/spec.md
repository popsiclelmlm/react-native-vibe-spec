# Feature Spec: Zustand Offline Mutation Queue

## User Outcome

Users can create todos while offline and see them sync later without losing local edits or exposing sensitive payloads.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- creating offline
- queued for sync
- syncing
- sync conflict
- sync failed

## Navigation Impact

- No route changes
- Deep link behavior: not applicable

## Data Contract

- Local queue plus `POST /todos`
- Request shape: client mutation payload with local id and retry metadata
- Response shape: server id, version, updated timestamps
- Error shape: validation failure, conflict, transient network failure

## State and Data Flow

- State library or framework: Zustand
- State ownership by layer: feature store owns draft todos and sync queue; server cache layer owns remote list snapshots
- Mutation boundaries: state changes happen through exported store actions only; components never mutate queue objects directly
- Persistence policy: queue metadata persisted locally; sensitive attachment references excluded
- Selectors or derivations: `selectVisibleTodos`, `selectQueuedCount`, `selectConflictedItems`
- Async flow and cancellation: queue worker drains when connectivity returns; duplicate retries are coalesced by local id
- Optimistic updates and rollback: local optimistic todo appears immediately and rolls back to conflict state if server rejects
- Logging and redaction constraints: queue logging records local ids and result codes only
- Security constraints: persisted queue excludes auth headers, secrets, and sensitive payload fragments

## Storage

- Local storage: persisted queue metadata and optimistic todo drafts
- Secure storage: none
- Cache invalidation: refresh remote list after queue drain success
- Data that must never be stored: auth tokens, attachment secrets, raw request headers

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: store actions and derived selectors
- Integration: offline create, reconnect sync, conflict rollback
- E2E: create todo offline and observe later sync
- Accessibility: conflict banners and retry controls are announced
- Security: persistence whitelist excludes sensitive fields

## Acceptance Criteria

- [ ] Offline-created items appear immediately and survive app restart.
- [ ] Sync conflicts remain recoverable without silent data loss.
- [ ] Persisted queue data excludes sensitive request details.
