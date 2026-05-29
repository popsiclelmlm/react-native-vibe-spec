import fs from "node:fs";
import path from "node:path";

const IGNORE_DIRS = new Set([
  ".git",
  ".expo",
  ".next",
  ".turbo",
  "android/build",
  "build",
  "coverage",
  "dist",
  "ios/Pods",
  "node_modules"
]);

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".env",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".plist",
  ".properties",
  ".ts",
  ".tsx",
  ".xml",
  ".yaml",
  ".yml"
]);

const SECRET_NAME_RE =
  /\b(?:EXPO_PUBLIC_[A-Z0-9_]*(?:SECRET|PRIVATE|TOKEN|PASSWORD)[A-Z0-9_]*|(?:API|AUTH|ACCESS|REFRESH|STRIPE|FIREBASE|SUPABASE|SENTRY)_[A-Z0-9_]*(?:SECRET|PRIVATE|TOKEN|PASSWORD)[A-Z0-9_]*)\b/g;

const CLEARTEXT_HTTP_URL_RE = /\bhttp:\/\/[^\s"'`<>{}\[\])]+/gi;
const LOCAL_CLEARTEXT_HOSTS = new Set(["localhost", "0.0.0.0", "10.0.2.2", "10.0.3.2", "::1"]);

const SECURITY_COVERAGE_REQUIREMENTS = [
  {
    id: "bundled-secrets",
    name: "bundled secrets",
    patterns: [/\bsecret/i, /\bbundl/i]
  },
  {
    id: "token-storage",
    name: "token storage",
    patterns: [/\btoken/i, /\b(?:storage|store|stored|stores)\b/i]
  },
  {
    id: "logging",
    name: "logging",
    patterns: [/\b(?:log|logs|logged|logging)\b/i]
  },
  {
    id: "permissions",
    name: "permissions",
    patterns: [/\bpermissions?\b/i]
  },
  {
    id: "network-boundaries",
    name: "network boundaries",
    patterns: [/\bnetwork\b/i, /\b(?:boundar\w*|hosts?|tls|https?|domains?)\b/i]
  }
];

const RELEASE_COVERAGE_REQUIREMENTS = [
  {
    id: "version-build",
    name: "version and build numbers",
    patterns: [/\bversion/i, /\bbuild\b/i]
  },
  {
    id: "ota-update-channels",
    name: "OTA/update channels",
    patterns: [/\b(?:ota|over-the-air|update[- ]channel|channel)\b/i]
  },
  {
    id: "migration-impact",
    name: "migration impact",
    patterns: [/\bmigration/i]
  },
  {
    id: "observability-crash-monitoring",
    name: "observability or crash monitoring",
    patterns: [/\b(?:observability|monitoring|crash)\b/i]
  },
  {
    id: "rollback-path",
    name: "rollback path",
    patterns: [/\brollback\b/i]
  },
  {
    id: "store-review",
    name: "store review impact",
    patterns: [/\b(?:app store|play store|store review)\b/i]
  }
];

const STATE_DATA_LIBRARY_DEFINITIONS = [
  {
    id: "redux-toolkit",
    name: "Redux Toolkit",
    packageNames: ["@reduxjs/toolkit"],
    terms: ["redux toolkit", "@reduxjs/toolkit", "rtk"]
  },
  {
    id: "redux",
    name: "Redux",
    packageNames: ["redux", "react-redux"],
    terms: ["redux", "react-redux"]
  },
  {
    id: "zustand",
    name: "Zustand",
    packageNames: ["zustand"],
    terms: ["zustand"]
  },
  {
    id: "mobx",
    name: "MobX",
    packageNames: ["mobx", "mobx-react", "mobx-react-lite"],
    terms: ["mobx"]
  },
  {
    id: "tanstack-query",
    name: "TanStack Query",
    packageNames: ["@tanstack/react-query", "react-query"],
    terms: ["tanstack query", "@tanstack/react-query", "react query", "react-query"]
  },
  {
    id: "apollo-client",
    name: "Apollo Client",
    packageNames: ["@apollo/client", "apollo-client"],
    terms: ["apollo", "@apollo/client"]
  },
  {
    id: "jotai",
    name: "Jotai",
    packageNames: ["jotai"],
    terms: ["jotai"]
  },
  {
    id: "recoil",
    name: "Recoil",
    packageNames: ["recoil"],
    terms: ["recoil"]
  },
  {
    id: "xstate",
    name: "XState",
    packageNames: ["xstate", "@xstate/react"],
    terms: ["xstate", "@xstate/react"]
  }
];

export const BUILTIN_TEMPLATES = {
  agents: `# AGENTS.md

## React Native Vibe Spec

Follow react-native-vibe-spec v0.1 for every AI-assisted change.

## Non-negotiables

- Use TypeScript for app and library code.
- Do not introduce a new state, navigation, networking, storage, analytics, or build library without updating docs/architecture.md.
- Do not store secrets in app code, public environment variables, source control, logs, or bundled assets.
- For new features, create a feature spec, technical plan, task list, and acceptance checklist before implementation.
- Keep platform behavior explicit: iOS, Android, and optional web behavior must be named in the spec.
- Run relevant checks before final handoff.

## Commands

- Install: pnpm install
- Typecheck: pnpm typecheck
- Lint: pnpm lint
- Test: pnpm test
- Vibe spec check: npx react-native-vibe-spec check
- Expo doctor, when using Expo: npx expo-doctor@latest

## Feature workflow

1. Specify the user outcome, platforms, data contracts, UX states, storage, permissions, and acceptance criteria.
2. Write a technical plan that names architecture impact, dependencies, risks, and test strategy.
3. Break the plan into small implementation tasks.
4. Implement the smallest coherent task first.
5. Run checks and update the acceptance checklist.
6. Summarize the diff, risks, and verification in the final response.
`,
  copilot: `# Copilot Instructions

This repository follows react-native-vibe-spec v0.1.

- Prefer project conventions over generic React Native examples.
- Ask for or create a feature spec before implementing new behavior.
- Keep mobile platform concerns explicit: iOS, Android, deep links, offline behavior, permissions, storage, and release impact.
- Do not add secrets to bundled app code or public environment variables.
- Update tests and checklists with code changes.
`,
  claude: `# Claude Code Instructions

This repository follows react-native-vibe-spec v0.1.

Before changing code, read AGENTS.md, docs/architecture.md, and the relevant feature spec. Work from spec -> plan -> tasks -> implementation -> checks.
`,
  cursor: `---
description: React Native Vibe Spec engineering rules
globs:
  - "**/*"
alwaysApply: true
---

Follow react-native-vibe-spec v0.1. New feature work starts with feature spec, technical plan, task list, and acceptance checklist. Keep React Native platform, security, testing, and release constraints explicit.
`,
  featureSpec: `# Feature Spec: {{title}}

## User Outcome

Describe the user-visible outcome in one or two sentences.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- loading
- success
- error
- offline

## Navigation Impact

- Adds route:
- Updates route:
- Redirect behavior:
- Deep link behavior:

## Data Contract

- Endpoint or local source:
- Request shape:
- Response shape:
- Error shape:

## Network Boundaries

- Allowed hosts:
- TLS required: yes
- Development-only cleartext hosts:
- Disallowed schemes or domains:

## State and Data Flow

- State owner:
- Framework:
- Mutation boundary:
- Read boundary:
- Async flow:
- Optimistic update and rollback:
- Persistence and hydration:
- Reset behavior:
- Sensitive data that must not be stored or logged:

## Storage

- Local storage:
- Secure storage:
- Cache invalidation:
- Data that must never be stored:

## Permissions

- Required permissions:
- Permission denial behavior:

## Tests Required

- Unit:
- Integration:
- E2E:
- Accessibility:
- Security:

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
`,
  technicalPlan: `# Technical Plan: {{title}}

## Architecture Impact

- Modules touched:
- New modules:
- Boundaries that must not change:

## Dependencies

- New dependencies:
- Removed dependencies:
- Native install or config changes:

## State Model

- Server state:
- Client state:
- Form state:
- Persisted state:
- State/data-flow framework:
- Mutation boundary:
- Selectors, hooks, computed values, or cache APIs:
- Persistence, hydration, migration, and reset:
- Sensitive data restrictions:

## API and Data Flow

Describe the data flow from user action to UI update.

## Platform Notes

- iOS:
- Android:
- Web:

## Risks

- Product risk:
- Technical risk:
- Security risk:
- Release risk:

## Verification Plan

- Typecheck:
- Lint:
- Unit:
- Integration:
- E2E:
- Manual platform checks:
`,
  tasks: `# Tasks: {{title}}

## Implementation

- [ ] Confirm feature spec and technical plan are complete.
- [ ] Add or update types and data contracts.
- [ ] Implement UI states.
- [ ] Implement data fetching or persistence.
- [ ] Add error, offline, and empty states.
- [ ] Add tests.
- [ ] Update docs and checklists.

## Validation

- [ ] Run typecheck.
- [ ] Run lint.
- [ ] Run tests.
- [ ] Run rnvibe check.
- [ ] Capture manual verification notes.
`,
  acceptance: `# Acceptance Checklist: {{title}}

- [ ] User outcome matches the feature spec.
- [ ] iOS behavior has been verified or explicitly scoped out.
- [ ] Android behavior has been verified or explicitly scoped out.
- [ ] Loading, error, empty, and offline states are covered.
- [ ] Accessibility labels and touch targets are reviewed.
- [ ] Network hosts use HTTPS unless explicitly scoped to local development.
- [ ] No secrets, tokens, or PII are logged or stored unsafely.
- [ ] Tests cover the changed behavior.
- [ ] Release, rollback, and observability impact are documented.
`,
  architectureDoc: `# Architecture

This project follows react-native-vibe-spec v0.1.

## Decisions

- Runtime:
- Navigation:
- State:
- Server data:
- Forms:
- Storage:
- Styling:
- Testing:
- Release:

## Rules

- Keep feature code grouped by domain when possible.
- Keep reusable UI primitives separate from product-specific screens.
- Do not add new architectural dependencies without recording the decision here.
- Platform-specific code must be named explicitly with .ios, .android, or a clear platform guard.
`,
  securityDoc: `# Security

## Rules

- Never put secrets, private keys, refresh tokens, or privileged API keys in bundled app code or assets.
- Treat public environment variables as bundled client data.
- Store sensitive user tokens only through an approved secure storage mechanism.
- Do not log PII, tokens, headers, one-time passwords, or full API payloads.
- Use TLS for production network requests and document network boundaries and allowed hosts.
- Limit cleartext HTTP to documented local development endpoints.
- Request the minimum mobile permissions needed for the feature.
- Document authentication, storage, networking, and permission changes in the feature spec.
`,
  releaseDoc: `# Release

## Release Readiness

- [ ] Version and build number are updated.
- [ ] Migration impact is documented.
- [ ] OTA/update-channel impact is documented, if applicable.
- [ ] Crash and error monitoring are checked.
- [ ] Rollback path is known.
- [ ] App Store / Play Store review notes are updated, if applicable.
- [ ] Feature flags or staged rollout settings are documented, if applicable.
`,
  prChecklist: `## React Native Vibe Spec Review

- [ ] Feature spec, plan, tasks, and acceptance checklist are present or not needed.
- [ ] Architecture, navigation, state, storage, and API changes are documented.
- [ ] iOS and Android behavior are both considered.
- [ ] Loading, error, empty, offline, and permission-denied states are handled.
- [ ] Network hosts, TLS requirements, and any development-only cleartext exceptions are documented.
- [ ] No secrets, tokens, PII, or sensitive payloads are logged or bundled.
- [ ] Unit/integration/E2E coverage matches the risk of the change.
- [ ] Release and rollback impact are documented.
`
};

export function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleize(input) {
  return String(input)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function fileExists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function readText(root, relativePath) {
  try {
    return fs.readFileSync(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

export function detectProject(root = process.cwd()) {
  const packageJson = readJson(path.join(root, "package.json"));
  const dependencies = {
    ...(packageJson?.dependencies ?? {}),
    ...(packageJson?.devDependencies ?? {})
  };
  const scripts = packageJson?.scripts ?? {};
  const hasDependency = (name) => Object.prototype.hasOwnProperty.call(dependencies, name);

  return {
    hasPackageJson: Boolean(packageJson),
    packageJson,
    packageManager: detectPackageManager(root, packageJson),
    scripts,
    hasReactNative: hasDependency("react-native"),
    hasExpo: hasDependency("expo"),
    hasTypeScript:
      hasDependency("typescript") ||
      fileExists(root, "tsconfig.json") ||
      fileExists(root, "tsconfig.base.json"),
    stateDataLibraries: detectStateDataLibraries(dependencies),
    reactNativeVersion: dependencies["react-native"] ?? null,
    expoVersion: dependencies.expo ?? null
  };
}

export function checkProject(root = process.cwd()) {
  const project = detectProject(root);
  const checks = [];
  const add = (id, title, status, details, weight = 1) => {
    checks.push({ id, title, status, details, weight });
  };

  add(
    "package-json",
    "package.json found",
    project.hasPackageJson ? "pass" : "fail",
    project.hasPackageJson ? `Package manager: ${project.packageManager}` : "No package.json was found.",
    5
  );

  add(
    "react-native",
    "React Native or Expo project detected",
    project.hasReactNative || project.hasExpo ? "pass" : "warn",
    project.hasExpo
      ? `Expo detected${project.expoVersion ? ` (${project.expoVersion})` : ""}.`
      : project.hasReactNative
        ? `React Native detected${project.reactNativeVersion ? ` (${project.reactNativeVersion})` : ""}.`
        : "No react-native or expo dependency detected. This may be a spec/tooling repository.",
    8
  );

  add(
    "typescript",
    "TypeScript configured",
    project.hasTypeScript ? "pass" : "fail",
    project.hasTypeScript ? "TypeScript config or dependency found." : "Add TypeScript and tsconfig.json.",
    8
  );

  add(
    "agents",
    "AGENTS.md found",
    fileExists(root, "AGENTS.md") ? "pass" : "fail",
    fileExists(root, "AGENTS.md") ? "Agent instructions are available." : "Run rnvibe init to create AGENTS.md.",
    8
  );

  const featureSpecs = findFeatureSpecs(root);
  add(
    "feature-specs",
    "Feature specs found",
    featureSpecs.length > 0 ? "pass" : "warn",
    featureSpecs.length > 0
      ? `Found ${featureSpecs.length} feature spec${featureSpecs.length === 1 ? "" : "s"}.`
      : "Create specs with rnvibe new feature <name>.",
    10
  );

  const missingTemplates = [
    "templates/feature-spec.md",
    "templates/technical-plan.md",
    "templates/tasks.md",
    "templates/acceptance-checklist.md",
    "templates/pr-review.md",
    "templates/release-checklist.md"
  ].filter((relativePath) => !fileExists(root, relativePath));
  add(
    "templates",
    "Spec templates available",
    missingTemplates.length === 0 ? "pass" : "warn",
    missingTemplates.length === 0
      ? "All standard templates are present."
      : `Missing: ${missingTemplates.join(", ")}`,
    8
  );

  const missingScripts = ["lint", "typecheck", "test"].filter((script) => !project.scripts[script]);
  add(
    "quality-scripts",
    "Quality scripts configured",
    missingScripts.length === 0 ? "pass" : missingScripts.length === 3 ? "fail" : "warn",
    missingScripts.length === 0 ? "lint, typecheck, and test scripts found." : `Missing scripts: ${missingScripts.join(", ")}`,
    10
  );

  const e2eScript = Object.keys(project.scripts).find((script) =>
    /(?:e2e|detox|maestro|playwright|appium)/i.test(`${script} ${project.scripts[script]}`)
  );
  add(
    "e2e",
    "E2E test command found",
    e2eScript ? "pass" : "warn",
    e2eScript ? `Found script: ${e2eScript}` : "Add an E2E command when user flows are implemented.",
    6
  );

  const architectureText = readText(root, "docs/architecture.md").toLowerCase();
  const detectedStateLibraries = project.stateDataLibraries;
  const documentedStateLibraries = detectedStateLibraries.filter((library) =>
    library.terms.some((term) => architectureText.includes(term))
  );
  add(
    "state-data-flow",
    "State/data-flow decision documented",
    detectedStateLibraries.length === 0
      ? "pass"
      : documentedStateLibraries.length === detectedStateLibraries.length
        ? "pass"
        : "warn",
    detailsForStateDataFlow(detectedStateLibraries, documentedStateLibraries, fileExists(root, "docs/architecture.md")),
    7
  );

  const securityCoverage = analyzeSecurityGuidance(root);
  add(
    "security",
    "Security guidance covers required topics",
    securityCoverage.hasGuidance && securityCoverage.missing.length === 0 ? "pass" : "warn",
    detailsForSecurityCoverage(securityCoverage),
    8
  );

  const releaseCoverage = analyzeReleaseGuidance(root);
  add(
    "release",
    "Release guidance covers required topics",
    releaseCoverage.hasGuidance && releaseCoverage.missing.length === 0 ? "pass" : "warn",
    detailsForReleaseCoverage(releaseCoverage),
    8
  );

  const secretHits = scanForSecretNames(root);
  add(
    "secrets",
    "No obvious secret names detected",
    secretHits.length === 0 ? "pass" : "fail",
    secretHits.length === 0
      ? "No obvious secret-like variable names were found."
      : secretHits.slice(0, 5).map((hit) => `${hit.file}:${hit.line} ${hit.name}`).join("; "),
    12
  );

  const cleartextNetworkHits = scanForCleartextNetworkUrls(root);
  add(
    "network-boundaries",
    "No non-local cleartext HTTP endpoints detected",
    cleartextNetworkHits.length === 0 ? "pass" : "fail",
    cleartextNetworkHits.length === 0
      ? "No non-local http:// endpoints were found in app code or config."
      : cleartextNetworkHits.slice(0, 5).map((hit) => `${hit.file}:${hit.line} ${hit.url}`).join("; "),
    8
  );

  add(
    "copilot-instructions",
    "Copilot instructions found",
    fileExists(root, ".github/copilot-instructions.md") ? "pass" : "warn",
    fileExists(root, ".github/copilot-instructions.md")
      ? "GitHub Copilot repository instructions are available."
      : "Optional: run rnvibe generate agents --agent copilot.",
    4
  );

  return {
    root,
    project,
    checks,
    score: calculateScore(checks),
    featureSpecs,
    securityCoverage,
    releaseCoverage,
    secretHits,
    cleartextNetworkHits
  };
}

export function renderCheckReport(result) {
  const lines = ["React Native Vibe Spec Check"];
  for (const check of result.checks) {
    lines.push(`${symbolFor(check.status)} ${check.title}`);
    if (check.details) {
      lines.push(`  ${check.details}`);
    }
  }
  lines.push(`Score: ${result.score}/100`);
  return lines.join("\n");
}

export function recommendations(result) {
  return result.checks
    .filter((check) => check.status !== "pass")
    .map((check) => ({
      id: check.id,
      title: check.title,
      action: actionFor(check.id)
    }));
}

export function initProject(root = process.cwd(), options = {}) {
  const agents = new Set(options.agents ?? ["codex"]);
  const force = Boolean(options.force);
  const created = [];
  const skipped = [];
  const write = (relativePath, content) => {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (fs.existsSync(destination) && !force) {
      skipped.push(relativePath);
      return;
    }
    fs.writeFileSync(destination, content);
    created.push(relativePath);
  };

  write("AGENTS.md", BUILTIN_TEMPLATES.agents);
  write(".github/PULL_REQUEST_TEMPLATE.md", BUILTIN_TEMPLATES.prChecklist);
  write("docs/architecture.md", BUILTIN_TEMPLATES.architectureDoc);
  write("docs/security.md", BUILTIN_TEMPLATES.securityDoc);
  write("docs/release.md", BUILTIN_TEMPLATES.releaseDoc);
  write("templates/feature-spec.md", BUILTIN_TEMPLATES.featureSpec.replaceAll("{{title}}", "<feature-name>"));
  write("templates/technical-plan.md", BUILTIN_TEMPLATES.technicalPlan.replaceAll("{{title}}", "<feature-name>"));
  write("templates/tasks.md", BUILTIN_TEMPLATES.tasks.replaceAll("{{title}}", "<feature-name>"));
  write("templates/acceptance-checklist.md", BUILTIN_TEMPLATES.acceptance.replaceAll("{{title}}", "<feature-name>"));
  write("templates/pr-review.md", BUILTIN_TEMPLATES.prChecklist);
  write("templates/release-checklist.md", BUILTIN_TEMPLATES.releaseDoc);

  if (agents.has("copilot")) {
    write(".github/copilot-instructions.md", BUILTIN_TEMPLATES.copilot);
  }
  if (agents.has("claude")) {
    write("CLAUDE.md", BUILTIN_TEMPLATES.claude);
  }
  if (agents.has("cursor")) {
    write(".cursor/rules/rnvibe.mdc", BUILTIN_TEMPLATES.cursor);
  }

  fs.mkdirSync(path.join(root, "features"), { recursive: true });
  const keepPath = path.join(root, "features/.gitkeep");
  if (!fs.existsSync(keepPath)) {
    fs.writeFileSync(keepPath, "");
    created.push("features/.gitkeep");
  }

  return { created, skipped };
}

export function createFeature(root = process.cwd(), featureName, options = {}) {
  const slug = slugify(featureName);
  if (!slug) {
    throw new Error("Feature name must contain at least one letter or number.");
  }

  const title = titleize(featureName);
  const baseDir = path.join(root, "features", slug);
  const force = Boolean(options.force);
  const created = [];
  const skipped = [];
  const write = (fileName, template) => {
    const destination = path.join(baseDir, fileName);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (fs.existsSync(destination) && !force) {
      skipped.push(path.relative(root, destination));
      return;
    }
    fs.writeFileSync(destination, template.replaceAll("{{title}}", title));
    created.push(path.relative(root, destination));
  };

  write("spec.md", BUILTIN_TEMPLATES.featureSpec);
  write("plan.md", BUILTIN_TEMPLATES.technicalPlan);
  write("tasks.md", BUILTIN_TEMPLATES.tasks);
  write("acceptance.md", BUILTIN_TEMPLATES.acceptance);

  return { slug, title, created, skipped };
}

export function generatePrChecklist(root = process.cwd(), options = {}) {
  const destination = path.join(root, ".github/PULL_REQUEST_TEMPLATE.md");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination) && !options.force) {
    return { created: [], skipped: [".github/PULL_REQUEST_TEMPLATE.md"] };
  }
  fs.writeFileSync(destination, BUILTIN_TEMPLATES.prChecklist);
  return { created: [".github/PULL_REQUEST_TEMPLATE.md"], skipped: [] };
}

function detectPackageManager(root, packageJson) {
  if (packageJson?.packageManager) {
    return packageJson.packageManager.split("@")[0];
  }
  if (fileExists(root, "pnpm-lock.yaml")) return "pnpm";
  if (fileExists(root, "yarn.lock")) return "yarn";
  if (fileExists(root, "package-lock.json")) return "npm";
  return "unknown";
}

function detectStateDataLibraries(dependencies) {
  const hasPackage = (name) => Object.prototype.hasOwnProperty.call(dependencies, name);
  return STATE_DATA_LIBRARY_DEFINITIONS.filter((definition) => {
    if (definition.id === "redux" && hasPackage("@reduxjs/toolkit")) {
      return false;
    }
    return definition.packageNames.some(hasPackage);
  }).map((definition) => ({
    id: definition.id,
    name: definition.name,
    packageNames: definition.packageNames.filter(hasPackage),
    terms: definition.terms
  }));
}

function detailsForStateDataFlow(detected, documented, hasArchitectureDoc) {
  if (detected.length === 0) {
    return "No common state/data-flow libraries detected.";
  }

  const detectedNames = detected.map((library) => library.name).join(", ");
  if (!hasArchitectureDoc) {
    return `Detected ${detectedNames}. Add docs/architecture.md and document the state/data-flow decision.`;
  }

  if (documented.length === detected.length) {
    return `Detected and documented: ${detectedNames}.`;
  }

  const documentedIds = new Set(documented.map((library) => library.id));
  const missing = detected.filter((library) => !documentedIds.has(library.id)).map((library) => library.name);
  return `Detected ${detectedNames}. Document in docs/architecture.md: ${missing.join(", ")}.`;
}

function analyzeSecurityGuidance(root) {
  const files = ["SECURITY.md", "docs/security.md", "rules/security.md"].filter((relativePath) =>
    fileExists(root, relativePath)
  );
  const text = files.map((relativePath) => readText(root, relativePath)).join("\n");
  const missing = SECURITY_COVERAGE_REQUIREMENTS.filter((requirement) =>
    !requirement.patterns.every((pattern) => pattern.test(text))
  ).map((requirement) => requirement.name);

  return {
    files,
    hasGuidance: files.length > 0,
    missing
  };
}

function detailsForSecurityCoverage(coverage) {
  if (!coverage.hasGuidance) {
    return "Add SECURITY.md, docs/security.md, or rules/security.md with bundled secrets, token storage, logging, permissions, and network boundaries.";
  }

  if (coverage.missing.length === 0) {
    return `Covered by ${coverage.files.join(", ")}.`;
  }

  return `Missing coverage: ${coverage.missing.join(", ")}.`;
}

function analyzeReleaseGuidance(root) {
  const files = ["docs/release.md", "rules/release.md", "templates/release-checklist.md"].filter((relativePath) =>
    fileExists(root, relativePath)
  );
  const text = files.map((relativePath) => readText(root, relativePath)).join("\n");
  const missing = RELEASE_COVERAGE_REQUIREMENTS.filter((requirement) =>
    !requirement.patterns.every((pattern) => pattern.test(text))
  ).map((requirement) => requirement.name);

  return {
    files,
    hasGuidance: files.length > 0,
    missing
  };
}

function detailsForReleaseCoverage(coverage) {
  if (!coverage.hasGuidance) {
    return "Add docs/release.md, rules/release.md, or templates/release-checklist.md with version/build, OTA/update channels, migration, monitoring, rollback, and store review coverage.";
  }

  if (coverage.missing.length === 0) {
    return `Covered by ${coverage.files.join(", ")}.`;
  }

  return `Missing coverage: ${coverage.missing.join(", ")}.`;
}

function findFeatureSpecs(root) {
  return walkFiles(root, (relativePath) => {
    const normalized = relativePath.split(path.sep).join("/");
    return (
      normalized.endsWith("/spec.md") &&
      (normalized.startsWith("features/") ||
        normalized.startsWith("spec/examples/") ||
        normalized.startsWith("examples/"))
    );
  });
}

function scanForSecretNames(root) {
  const hits = [];
  const files = walkFiles(root, (relativePath) => TEXT_EXTENSIONS.has(path.extname(relativePath)));
  for (const relativePath of files) {
    if (shouldIgnoreFileForSecrets(relativePath)) continue;
    const absolutePath = path.join(root, relativePath);
    let text = "";
    try {
      const stat = fs.statSync(absolutePath);
      if (stat.size > 512_000) continue;
      text = fs.readFileSync(absolutePath, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      for (const match of lines[index].matchAll(SECRET_NAME_RE)) {
        hits.push({ file: relativePath, line: index + 1, name: match[0] });
      }
    }
  }
  return hits;
}

function scanForCleartextNetworkUrls(root) {
  const hits = [];
  const files = walkFiles(root, (relativePath) => TEXT_EXTENSIONS.has(path.extname(relativePath)));
  for (const relativePath of files) {
    if (shouldIgnoreFileForSecrets(relativePath)) continue;
    const absolutePath = path.join(root, relativePath);
    let text = "";
    try {
      const stat = fs.statSync(absolutePath);
      if (stat.size > 512_000) continue;
      text = fs.readFileSync(absolutePath, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      for (const match of lines[index].matchAll(CLEARTEXT_HTTP_URL_RE)) {
        const url = normalizeMatchedUrl(match[0]);
        if (!isAllowedLocalCleartextUrl(url)) {
          hits.push({ file: relativePath, line: index + 1, url });
        }
      }
    }
  }
  return hits;
}

function normalizeMatchedUrl(url) {
  return url.replace(/[),.;!?]+$/g, "");
}

function isAllowedLocalCleartextUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    return LOCAL_CLEARTEXT_HOSTS.has(hostname) || hostname.startsWith("127.");
  } catch {
    return false;
  }
}

function shouldIgnoreFileForSecrets(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  return (
    normalized.includes("/test/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/__fixtures__/") ||
    normalized.includes(".test.") ||
    normalized.includes(".spec.")
  );
}

function walkFiles(root, predicate, options = {}) {
  const results = [];
  const limit = options.limit ?? 5000;
  const visit = (absoluteDir) => {
    if (results.length >= limit) return;
    let entries = [];
    try {
      entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (results.length >= limit) return;
      const absolutePath = path.join(absoluteDir, entry.name);
      const relativePath = path.relative(root, absolutePath);
      const normalized = relativePath.split(path.sep).join("/");
      if (entry.isDirectory()) {
        if (shouldIgnoreDir(normalized)) continue;
        visit(absolutePath);
        continue;
      }
      if (entry.isFile() && predicate(relativePath)) {
        results.push(relativePath);
      }
    }
  };
  visit(root);
  return results.sort();
}

function shouldIgnoreDir(relativePath) {
  if (IGNORE_DIRS.has(relativePath)) return true;
  return [...IGNORE_DIRS].some((ignored) => relativePath === ignored || relativePath.endsWith(`/${ignored}`));
}

function calculateScore(checks) {
  const max = checks.reduce((sum, check) => sum + check.weight, 0);
  const actual = checks.reduce((sum, check) => {
    if (check.status === "pass") return sum + check.weight;
    if (check.status === "warn") return sum + check.weight * 0.5;
    return sum;
  }, 0);
  return Math.round((actual / max) * 100);
}

function symbolFor(status) {
  if (status === "pass") return "✓";
  if (status === "warn") return "△";
  return "✗";
}

function actionFor(id) {
  const actions = {
    "package-json": "Initialize a package.json for the project.",
    "react-native": "Install or document the target React Native or Expo runtime.",
    typescript: "Add TypeScript and a strict tsconfig.json.",
    agents: "Run rnvibe init to create AGENTS.md.",
    "feature-specs": "Run rnvibe new feature <name> before implementing new features.",
    templates: "Run rnvibe init to restore standard templates.",
    "quality-scripts": "Add lint, typecheck, and test scripts to package.json.",
    e2e: "Add a Detox, Maestro, Playwright, or Appium E2E command for critical flows.",
    "state-data-flow": "Document detected state/data-flow libraries in docs/architecture.md and the relevant feature spec.",
    security: "Add security guidance that covers bundled secrets, token storage, logging, permissions, and network boundaries.",
    release: "Add release guidance that covers version/build numbers, OTA/update channels, migration, monitoring, rollback, and store review impact.",
    secrets: "Move secret-like values out of bundled code and public env names.",
    "network-boundaries": "Replace non-local http:// endpoints with HTTPS or document a local-only development boundary.",
    "copilot-instructions": "Run rnvibe generate agents --agent copilot."
  };
  return actions[id] ?? "Review this check and update the project.";
}
