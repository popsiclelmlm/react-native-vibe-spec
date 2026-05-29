import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkProject, createFeature, initProject, slugify } from "../src/index.js";

test("slugify creates file-safe feature names", () => {
  assert.equal(slugify("Auth Login Flow"), "auth-login-flow");
  assert.equal(slugify("  OTP: Verify! "), "otp-verify");
});

test("initProject creates agent and template files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" } })
  );

  const result = initProject(root, { agents: ["codex", "copilot"] });

  assert.ok(result.created.includes("AGENTS.md"));
  assert.ok(fs.existsSync(path.join(root, ".github/copilot-instructions.md")));
  assert.ok(fs.existsSync(path.join(root, "templates/feature-spec.md")));
  assert.match(fs.readFileSync(path.join(root, "templates/feature-spec.md"), "utf8"), /## State and Data Flow/);
  assert.match(fs.readFileSync(path.join(root, "templates/feature-spec.md"), "utf8"), /## Network Boundaries/);
  assert.match(fs.readFileSync(path.join(root, "templates/tasks.md"), "utf8"), /Confirm state ownership/);
});

test("createFeature writes spec, plan, tasks, and acceptance files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  const result = createFeature(root, "Auth Login");

  assert.equal(result.slug, "auth-login");
  assert.ok(fs.existsSync(path.join(root, "features/auth-login/spec.md")));
  assert.ok(fs.existsSync(path.join(root, "features/auth-login/plan.md")));
  assert.ok(fs.existsSync(path.join(root, "features/auth-login/tasks.md")));
  assert.ok(fs.existsSync(path.join(root, "features/auth-login/acceptance.md")));
});

test("checkProject warns when AGENTS.md misses required guidance", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents\n\nUse TypeScript.");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");

  const result = checkProject(root);
  const agentsCheck = result.checks.find((check) => check.id === "agents");

  assert.equal(agentsCheck.status, "warn");
  assert.ok(result.agentGuidance.missing.includes("spec-first workflow"));
  assert.match(agentsCheck.details, /spec-first workflow/);
});

test("checkProject passes when AGENTS.md covers required guidance", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  initProject(root, { force: true });
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");

  const result = checkProject(root);
  const agentsCheck = result.checks.find((check) => check.id === "agents");

  assert.equal(agentsCheck.status, "pass");
  assert.deepEqual(result.agentGuidance.missing, []);
});

test("checkProject warns when feature specs miss required sections", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Feature Spec: Auth Login\n\n## User Outcome\n\nLogin.");

  const result = checkProject(root);
  const featureSpecCheck = result.checks.find((check) => check.id === "feature-specs");

  assert.equal(featureSpecCheck.status, "warn");
  assert.equal(result.featureSpecCoverage.missingCoverage[0].file, "features/auth-login/spec.md");
  assert.ok(result.featureSpecCoverage.missingCoverage[0].missing.includes("Platforms"));
  assert.match(featureSpecCheck.details, /Platforms/);
});

test("checkProject passes when feature specs cover required sections", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  const result = createFeature(root, "Auth Login");

  assert.equal(result.slug, "auth-login");
  const checkResult = checkProject(root);
  const featureSpecCheck = checkResult.checks.find((check) => check.id === "feature-specs");

  assert.equal(featureSpecCheck.status, "pass");
  assert.deepEqual(checkResult.featureSpecCoverage.missingCoverage, []);
});

test("checkProject reports obvious secret-like public names", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.writeFileSync(path.join(root, "app.config.js"), "const EXPO_PUBLIC_STRIPE_SECRET_KEY = 'bad';");

  const result = checkProject(root);
  const secretCheck = result.checks.find((check) => check.id === "secrets");

  assert.equal(secretCheck.status, "fail");
  assert.equal(result.secretHits[0].name, "EXPO_PUBLIC_STRIPE_SECRET_KEY");
});

test("checkProject warns when a template misses required coverage", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  initProject(root, { force: true });
  fs.writeFileSync(
    path.join(root, "templates/feature-spec.md"),
    fs.readFileSync(path.join(root, "templates/feature-spec.md"), "utf8").replace(/\n## Network Boundaries[\s\S]*?\n## State and Data Flow/, "\n## State and Data Flow")
  );

  const result = checkProject(root);
  const templateCheck = result.checks.find((check) => check.id === "templates");

  assert.equal(templateCheck.status, "warn");
  assert.deepEqual(result.templateCoverage.missingFiles, []);
  assert.equal(result.templateCoverage.missingCoverage[0].file, "templates/feature-spec.md");
  assert.ok(result.templateCoverage.missingCoverage[0].missing.includes("Network Boundaries"));
  assert.match(templateCheck.details, /Network Boundaries/);
});

test("checkProject passes when templates cover required sections", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  initProject(root, { force: true });

  const result = checkProject(root);
  const templateCheck = result.checks.find((check) => check.id === "templates");

  assert.equal(templateCheck.status, "pass");
  assert.deepEqual(result.templateCoverage.missingFiles, []);
  assert.deepEqual(result.templateCoverage.missingCoverage, []);
});

test("checkProject warns when no rnvibe check script is configured", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test", check: "echo generic-check" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");

  const result = checkProject(root);
  const vibeCheck = result.checks.find((check) => check.id === "vibe-check-script");

  assert.equal(vibeCheck.status, "warn");
  assert.equal(result.vibeCheckScript, null);
  assert.match(vibeCheck.details, /rnvibe check/);
});

test("checkProject passes when rnvibe check script is configured", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: {
        lint: "echo lint",
        typecheck: "echo typecheck",
        test: "echo test",
        check: "node packages/cli/bin/rnvibe.js check"
      }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");

  const result = checkProject(root);
  const vibeCheck = result.checks.find((check) => check.id === "vibe-check-script");

  assert.equal(vibeCheck.status, "pass");
  assert.equal(result.vibeCheckScript, "check");
});

test("checkProject warns when CI workflow misses required checks", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: {
        lint: "echo lint",
        typecheck: "echo typecheck",
        test: "echo test",
        check: "node packages/cli/bin/rnvibe.js check"
      }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, ".github/workflows"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".github/workflows/ci.yml"),
    "name: CI\njobs:\n  test:\n    steps:\n      - run: pnpm lint\n      - run: pnpm test\n"
  );

  const result = checkProject(root);
  const ciCheck = result.checks.find((check) => check.id === "ci-workflow");

  assert.equal(ciCheck.status, "warn");
  assert.deepEqual(result.ciCoverage.files, [".github/workflows/ci.yml"]);
  assert.ok(result.ciCoverage.missing.includes("frozen install"));
  assert.ok(result.ciCoverage.missing.includes("typecheck"));
  assert.ok(result.ciCoverage.missing.includes("rnvibe check"));
  assert.match(ciCheck.details, /frozen install/);
});

test("checkProject passes when CI workflow runs required checks", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: {
        lint: "echo lint",
        typecheck: "echo typecheck",
        test: "echo test",
        check: "node packages/cli/bin/rnvibe.js check"
      }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, ".github/workflows"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".github/workflows/ci.yml"),
    [
      "name: CI",
      "jobs:",
      "  test:",
      "    steps:",
      "      - run: pnpm install --frozen-lockfile",
      "      - run: pnpm lint",
      "      - run: pnpm typecheck",
      "      - run: pnpm test",
      "      - run: pnpm check"
    ].join("\n")
  );

  const result = checkProject(root);
  const ciCheck = result.checks.find((check) => check.id === "ci-workflow");

  assert.equal(ciCheck.status, "pass");
  assert.deepEqual(result.ciCoverage.missing, []);
});

test("checkProject warns when security guidance misses required coverage", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.writeFileSync(path.join(root, "SECURITY.md"), "# Security\n\nDo not bundle secrets in the app.");

  const result = checkProject(root);
  const securityCheck = result.checks.find((check) => check.id === "security");

  assert.equal(securityCheck.status, "warn");
  assert.deepEqual(result.securityCoverage.files, ["SECURITY.md"]);
  assert.ok(result.securityCoverage.missing.includes("token storage"));
  assert.match(securityCheck.details, /token storage/);
});

test("checkProject passes when security guidance covers required topics", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.writeFileSync(
    path.join(root, "SECURITY.md"),
    [
      "# Security",
      "Do not bundle secrets in app code or assets.",
      "Store token values only in approved secure storage.",
      "Do not log PII, tokens, or payloads.",
      "Document mobile permissions and denial behavior.",
      "Document network boundaries, allowed hosts, and TLS requirements."
    ].join("\n")
  );

  const result = checkProject(root);
  const securityCheck = result.checks.find((check) => check.id === "security");

  assert.equal(securityCheck.status, "pass");
  assert.deepEqual(result.securityCoverage.missing, []);
});

test("checkProject warns when release guidance misses required coverage", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "templates"), { recursive: true });
  fs.writeFileSync(path.join(root, "templates/release-checklist.md"), "# Release\n\n- [ ] Version and build number updated.");

  const result = checkProject(root);
  const releaseCheck = result.checks.find((check) => check.id === "release");

  assert.equal(releaseCheck.status, "warn");
  assert.deepEqual(result.releaseCoverage.files, ["templates/release-checklist.md"]);
  assert.ok(result.releaseCoverage.missing.includes("rollback path"));
  assert.match(releaseCheck.details, /rollback path/);
});

test("checkProject passes when release guidance covers required topics", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "docs/release.md"),
    [
      "# Release",
      "Version and build numbers are updated before release.",
      "OTA update channel impact is documented.",
      "Migration impact is documented.",
      "Crash monitoring and observability checks are completed.",
      "Rollback path is known.",
      "App Store and Play Store review notes are updated."
    ].join("\n")
  );

  const result = checkProject(root);
  const releaseCheck = result.checks.find((check) => check.id === "release");

  assert.equal(releaseCheck.status, "pass");
  assert.deepEqual(result.releaseCoverage.missing, []);
});

test("checkProject reports non-local cleartext HTTP endpoints", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "src"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/api.ts"), 'export const baseUrl = "http://api.example.com/v1";');

  const result = checkProject(root);
  const networkCheck = result.checks.find((check) => check.id === "network-boundaries");

  assert.equal(networkCheck.status, "fail");
  assert.equal(result.cleartextNetworkHits[0].url, "http://api.example.com/v1");
});

test("checkProject allows local cleartext development endpoints", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "src"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "src/api.ts"),
    'export const urls = ["http://localhost:3000", "http://127.0.0.1:8081", "http://10.0.2.2:3000"];'
  );

  const result = checkProject(root);
  const networkCheck = result.checks.find((check) => check.id === "network-boundaries");

  assert.equal(networkCheck.status, "pass");
  assert.deepEqual(result.cleartextNetworkHits, []);
});

test("checkProject warns when detected state library is not documented", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest", zustand: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/profile"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/profile/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/architecture.md"), "# Architecture\n\n- State: \n");

  const result = checkProject(root);
  const stateCheck = result.checks.find((check) => check.id === "state-data-flow");

  assert.equal(stateCheck.status, "warn");
  assert.match(stateCheck.details, /Zustand/);
});

test("checkProject passes when detected state library is documented", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { expo: "latest", typescript: "latest", "@reduxjs/toolkit": "latest", "react-redux": "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "features/profile"), { recursive: true });
  fs.writeFileSync(path.join(root, "features/profile/spec.md"), "# Spec");
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/architecture.md"), "# Architecture\n\n- State: Redux Toolkit owns client app state.\n");

  const result = checkProject(root);
  const stateCheck = result.checks.find((check) => check.id === "state-data-flow");

  assert.equal(stateCheck.status, "pass");
  assert.deepEqual(
    result.project.stateDataLibraries.map((library) => library.name),
    ["Redux Toolkit"]
  );
});
