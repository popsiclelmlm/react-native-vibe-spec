# Feature Spec: MobX Portfolio Watchlist

## User Outcome

Users can manage a watchlist that refreshes in the background and highlights price changes without blocking navigation.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- refreshing
- refresh success
- refresh error
- offline

## Navigation Impact

- Adds route: `/watchlist`
- Deep link behavior: `app://watchlist`

## Data Contract

- `GET /watchlist`
- `POST /watchlist/items`
- `DELETE /watchlist/items/:symbol`

## State and Data Flow

- State framework: MobX store with observable watchlist items and computed portfolio summaries
- State ownership: the watchlist store owns observable symbols and refresh state, computed values own gain/loss derivations, and server responses remain normalized inside the store
- Mutation boundaries: all writes happen inside MobX actions; views consume observables and computed values only
- Persistence and hydration: saved symbols hydrate from approved local storage before the first background refresh; credentials never persist in the store
- Selectors and derivations: computed values expose sorted watchlist groups, stale-data flags, and day-change summaries
- Async flow and side effects: hydrate symbols -> refresh quotes in background -> update observables -> announce stale data if refresh fails
- Rollback or conflict handling: failed add/remove actions restore the prior observable list and mark the item for retry
- Logging and observability: metrics capture refresh latency and failure counts without logging quote payloads tied to user identity
- Security constraints: never persist credentials, brokerage tokens, or full quote payloads that include private account data

## Storage

- Local storage: watchlist symbols only
- Secure storage: none
- Cache invalidation: background refresh marks data stale after timeout
- Data that must never be stored: brokerage credentials, account balances, auth tokens

## Tests Required

- Unit: computed summaries and action guards
- Integration: hydration followed by background refresh
- E2E: add and remove watchlist symbols with offline recovery
- Security: ensure sensitive market/account fields stay out of logs

## Acceptance Criteria

- [ ] Background refresh never blocks watchlist navigation.
- [ ] Failed mutations restore the previous watchlist state.
- [ ] Sensitive account data is excluded from persistence and logs.
