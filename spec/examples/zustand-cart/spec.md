# Feature Spec: Zustand Offline Cart

## User Outcome

Users can add items to a cart offline, see derived totals immediately, and retry checkout sync when connectivity returns.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- editing-cart
- sync-pending
- sync-failed
- synced
- offline

## Navigation Impact

- Adds route: `/cart`
- Updates route: checkout summary now reads from shared cart store
- Redirect behavior: successful checkout clears cart and routes to `/orders/latest`
- Deep link behavior: cart deep links open the local cart snapshot before sync reconciliation

## Data Contract

- Endpoint or local source: local persisted cart store plus `POST /checkout/sync`
- Request shape: item IDs, quantities, coupon code, and client mutation IDs
- Response shape: canonical cart totals, checkout eligibility, conflict annotations
- Error shape: conflict, inventory changed, unauthorized, offline

## State and Data Flow

- Primary framework: Zustand with persist middleware
- Server state owner: checkout sync service owns remote cart reconciliation results
- Client state owner: `cartStore` owns line items, pending mutations, coupon intent, and sync banners
- Form state owner: coupon entry field owns transient text and validation
- Mutation boundaries: only named store actions may mutate cart state; components must not mutate arrays or totals directly
- Selectors or derivations: `useCartTotals`, `useCartBadgeCount`, and `useCheckoutBlockedReason` derive all computed UI values
- Async flow: local add or remove writes immediately, queues mutation IDs, persists snapshot, then background sync reconciles with server state
- Optimistic updates and rollback: optimistic quantity changes roll back per mutation ID if checkout sync reports inventory conflict
- Logging and security constraints: log mutation IDs and item counts only; never log payment tokens, full addresses, or raw checkout payloads

## Storage

- Local storage: cart snapshot, pending mutation IDs, last sync timestamp
- Secure storage: none
- Cache invalidation: clear pending queue after successful sync or explicit sign-out
- Data that must never be stored: payment tokens, CVV, full bearer tokens

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: store actions, selectors, and rollback handlers
- Integration: hydration, offline persistence, and sync conflict resolution
- E2E: add-to-cart offline then recover online
- Accessibility: totals and sync status are announced correctly
- Security: persisted snapshot excludes payment and auth secrets

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
