# Feature Spec: Bare React Native Push Permission Gate

## User Outcome

Users are asked for push notification permission at the right moment and can continue if they deny permission.

## Platforms

- iOS: required
- Android: required
- Web: not-supported

## UX States

- idle
- explaining permission value
- requesting permission
- permission granted
- permission denied
- unavailable

## Navigation Impact

- Updates route: `/settings/notifications`
- No deep-link changes

## Data Contract

- Local permission API only
- Optional device registration endpoint after permission is granted

## Storage

- Permission prompt history: local storage
- Push token: secure or approved app storage according to project policy

## Tests Required

- Unit: permission state mapping
- Integration: denied permission keeps settings page usable
- Manual: iOS simulator and Android emulator permission flows

## Acceptance Criteria

- [ ] Denying permission does not block core app usage.
- [ ] Platform permission copy is accurate.
- [ ] Native configuration changes are documented.
