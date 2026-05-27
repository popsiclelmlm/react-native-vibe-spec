# Feature Spec: Jotai Checkout Draft Recovery

## User Outcome

Shoppers can leave checkout mid-flow, return later on the same device, and resume an in-progress draft without replaying sensitive payment steps.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- editing draft
- saving draft
- draft restored
- draft expired
- payment confirmation pending

## Navigation Impact

- Updates route: `/checkout`
- Redirect behavior: expired drafts return the user to cart review
- Deep link behavior: `/checkout` restores draft atoms before rendering step state

## Data Contract

- Local draft atoms plus `POST /checkout/confirm`
- Request shape: cart lines, shipping choice, payment confirmation reference
- Response shape: order id, receipt summary, final pricing
- Error shape: validation failure, inventory conflict, transient network failure

## State and Data Flow

- State library or framework: Jotai
- State ownership by layer: atom family owns step drafts and derived completion state; server cache layer owns pricing and inventory reads
- Mutation boundaries: components update checkout state through write atoms only; server payload assembly happens in a dedicated confirm atom
- Persistence policy: non-sensitive checkout draft atoms persist locally with TTL; payment entry atoms remain memory-only
- Selectors or derivations: derived atoms for `checkoutCanSubmit`, `checkoutDirtySteps`, and `checkoutDraftAge`
- Async flow and cancellation: confirmation atom serializes submit requests and discards stale pricing before retry
- Optimistic updates and rollback: submitting step advances optimistically but rolls back to the last confirmed step on server rejection
- Logging and redaction constraints: analytics logs step ids and validation result codes only
- Security constraints: persisted atoms exclude card details, auth headers, and payment provider tokens

## Storage

- Local storage: checkout step drafts, selected shipping option, draft timestamp
- Secure storage: none
- Cache invalidation: invalidate pricing quote and cart summary after successful confirmation
- Data that must never be stored: card PAN, CVV, payment tokens, auth headers

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: derived atoms and write atom guards
- Integration: draft restore, draft expiry, submit rollback
- E2E: abandon checkout, reopen app, resume draft, confirm order
- Accessibility: restored-step announcement and validation errors are announced
- Security: persisted atom whitelist excludes payment fields

## Acceptance Criteria

- [ ] Checkout draft restores the correct step and non-sensitive inputs after app restart.
- [ ] Expired drafts never auto-submit stale pricing or payment state.
- [ ] Persisted Jotai atoms exclude payment and auth secrets.
