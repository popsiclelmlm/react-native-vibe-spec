# Feature Spec: Redux Toolkit Offline Cart

## User Outcome

Users can add items to a cart while offline and see totals stay consistent until sync completes.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- adding item
- queued for sync
- sync success
- sync error
- offline

## Navigation Impact

- Updates route: `/cart`
- Deep link behavior: `app://cart`

## Data Contract

- `POST /cart/items`
- `DELETE /cart/items/:id`
- `GET /cart`

## State and Data Flow

- State framework: Redux Toolkit slices plus RTK Query for cart sync
- State ownership: RTK Query owns server cart snapshots, the cart slice owns offline mutations, and component state owns transient quantity input
- Mutation boundaries: cart writes happen through slice actions and RTK Query mutations only
- Persistence and hydration: queued cart mutations persist locally and hydrate before first sync; payment data never persists
- Selectors and derivations: selectors derive cart badge count, subtotal, and unsynced item count
- Async flow and side effects: add item -> queue optimistic mutation -> persist queue -> sync on connectivity restore -> invalidate cart query
- Rollback or conflict handling: failed sync rolls back optimistic quantity changes and surfaces retry UI
- Logging and observability: log queue depth and sync failures with redacted product metadata only
- Security constraints: never persist payment instruments, auth headers, or full user profile data in cart state

## Storage

- Local storage: queued cart mutations
- Secure storage: none
- Cache invalidation: invalidate cart query after successful sync
- Data that must never be stored: payment details, auth headers, session secrets

## Tests Required

- Unit: cart selectors and queue reducer behavior
- Integration: offline add then online sync
- E2E: add item offline and verify eventual sync
- Security: confirm sensitive checkout data never persists

## Acceptance Criteria

- [ ] Cart totals remain correct while offline.
- [ ] Sync retries do not duplicate cart entries.
- [ ] Sensitive checkout data is never logged or persisted.
