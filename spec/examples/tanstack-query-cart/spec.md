# Feature Spec: TanStack Query Cart Sync With Local Draft Reducer

## User Outcome

Users can adjust cart quantities instantly, keep local draft intent during flaky connectivity, and still reconcile with server pricing without duplicating writes.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- cart idle
- local draft dirty
- syncing cart
- sync failed
- price changed on server
- offline cart edits queued

## Navigation Impact

- Updates route: `/cart`
- Redirect behavior: checkout blocks until cart sync resolves
- Deep link behavior: product deep links merge into the current local draft before refetch

## Data Contract

- `GET /cart`
- `PATCH /cart/items/:itemId`
- Request shape: item id, desired quantity, client mutation id
- Response shape: canonical cart items, totals, applied promotions, version
- Error shape: validation failure, out-of-stock, stale version, transient network failure

## State and Data Flow

- State library or framework: TanStack Query for server cart state plus React useReducer for local draft intent
- State ownership by layer: TanStack Query owns canonical cart fetch/cache; feature reducer owns pending quantity edits and checkout guard flags; row components read selectors only
- Mutation boundaries: server writes happen through query mutations; reducer actions only stage local edits and merge confirmed results
- Persistence policy: local draft survives short app restarts only when item ids and quantities are non-sensitive; pricing snapshots are never persisted
- Selectors or derivations: `selectVisibleCartItems`, `selectPendingQuantityChanges`, `selectCheckoutBlockedReason`
- Async flow and cancellation: quantity taps collapse into the latest queued mutation per item; screen exit cancels refetches but not mutation settlement bookkeeping
- Optimistic updates and rollback: optimistic quantities render immediately and roll back per item when inventory or pricing validation fails
- Logging and redaction constraints: telemetry records cart mutation ids, result codes, and item counts only
- Security constraints: logs, persisted drafts, and query cache snapshots exclude auth headers, promo secrets, and raw pricing rule payloads

## Storage

- Local storage: optional persisted draft quantities and mutation ids
- Secure storage: none
- Cache invalidation: invalidate cart query after successful mutation settle and after checkout completion
- Data that must never be stored: auth tokens, payment instrument details, server pricing internals

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: reducer transitions and cart derivation selectors
- Integration: optimistic quantity updates, stale-version retry, offline draft restore
- E2E: adjust cart quantities offline, reconnect, and continue to checkout
- Accessibility: quantity steppers and conflict banners announce updates correctly
- Security: persisted drafts and analytics payloads exclude sensitive commerce data

## Acceptance Criteria

- [ ] Cart quantity taps feel immediate without causing duplicate server writes.
- [ ] Server-side pricing or stock conflicts return the cart to a recoverable state.
- [ ] Persisted draft data and logs exclude sensitive commerce fields.
