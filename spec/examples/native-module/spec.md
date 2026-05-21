# Feature Spec: Native Module Capability Check

## User Outcome

Users only see native-module-powered controls when the device supports the required capability.

## Platforms

- iOS: required
- Android: required
- Web: not-supported

## UX States

- checking capability
- supported
- unsupported
- native error

## Navigation Impact

- No route changes

## Data Contract

- Native module method: `getCapabilityStatus()`
- Native module event: `capabilityChanged`

## Storage

- No sensitive storage
- Capability status may be cached for the session only

## Tests Required

- Unit: capability mapping
- Integration: unsupported native response
- Manual: physical device check if emulator support is incomplete

## Acceptance Criteria

- [ ] Unsupported devices show a clear fallback.
- [ ] Native errors do not crash the app.
- [ ] Platform-specific code is isolated and typed.
