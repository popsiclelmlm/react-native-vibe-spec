# Release Rules

## Required Decisions

- Version and build number strategy
- OTA/update channel policy
- Store review impact
- Migration impact
- Observability and crash monitoring
- Rollback path

## Rules

- Release guidance must cover version/build numbers, migration impact, OTA/update channels, observability or crash monitoring, rollback, and store review impact.
- Release impact must be included in the feature plan for user-facing changes.
- Native config changes must be called out because they can affect build and store review.
- OTA updates must not assume native code or asset availability that is not already shipped.
- Rollback should be documented before risky releases.
- App Store and Play Store notes must be updated when permissions, data use, or user-facing behavior changes.
