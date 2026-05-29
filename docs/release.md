# Release

## Package Release

Initial package targets:

- `react-native-vibe-spec`
- `@react-native-vibe-spec/core`
- `@react-native-vibe-spec/eslint-config`
- `@react-native-vibe-spec/tsconfig`
- `@react-native-vibe-spec/agents`

The MCP and doctor packages are placeholders until their behavior is implemented.

## Release Checklist

- [ ] Release guidance covers version/build numbers, migration, OTA/update channels, observability or crash monitoring, rollback, and store review impact.
- [ ] Version updated consistently.
- [ ] Changelog updated.
- [ ] CLI smoke test completed.
- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] README quick start still matches CLI behavior.
