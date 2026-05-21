#!/usr/bin/env node

const tools = [
  "read-rn-vibe-spec",
  "validate-feature-spec",
  "create-technical-plan",
  "check-release-readiness"
];

console.log(
  JSON.stringify(
    {
      name: "@react-native-vibe-spec/mcp-server",
      status: "planned",
      message: "MCP server implementation is planned for v0.3.",
      tools
    },
    null,
    2
  )
);
