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

test("checkProject validates state/data-flow template and feature coverage", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rnvibe-"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      dependencies: { typescript: "latest" },
      scripts: { lint: "echo lint", typecheck: "echo typecheck", test: "echo test" }
    })
  );
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Agents");
  fs.mkdirSync(path.join(root, "templates"), { recursive: true });
  fs.mkdirSync(path.join(root, "features/auth-login"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "templates/feature-spec.md"),
    `# Feature Spec

## State and Data Flow

- State library or framework:
- State ownership by layer:
- Mutation boundaries:
- Persistence policy:
- Selectors or derivations:
- Async flow and cancellation:
- Optimistic updates and rollback:
- Logging and redaction constraints:
- Security constraints:
`
  );
  fs.writeFileSync(
    path.join(root, "templates/technical-plan.md"),
    `# Technical Plan

## State Model

- State library or framework:
- Ownership boundaries:
- Mutation boundaries:
- Selectors or derivations:
- Async flow, retries, and cancellation:
- Optimistic updates and rollback:
- Logging, analytics, and redaction:
- Security constraints:
`
  );
  fs.writeFileSync(path.join(root, "templates/tasks.md"), "# Tasks");
  fs.writeFileSync(path.join(root, "templates/acceptance-checklist.md"), "# Acceptance");
  fs.writeFileSync(path.join(root, "templates/pr-review.md"), "# PR");
  fs.writeFileSync(path.join(root, "templates/release-checklist.md"), "# Release");
  fs.writeFileSync(
    path.join(root, "features/auth-login/spec.md"),
    fs.readFileSync(path.join(root, "templates/feature-spec.md"), "utf8")
  );
  fs.writeFileSync(
    path.join(root, "features/auth-login/plan.md"),
    fs.readFileSync(path.join(root, "templates/technical-plan.md"), "utf8")
  );

  const passing = checkProject(root);
  assert.equal(passing.checks.find((check) => check.id === "state-template-coverage").status, "pass");
  assert.equal(passing.checks.find((check) => check.id === "state-spec-coverage").status, "pass");

  fs.writeFileSync(path.join(root, "features/auth-login/spec.md"), "# Feature Spec");

  const failing = checkProject(root);
  assert.equal(failing.checks.find((check) => check.id === "state-spec-coverage").status, "warn");
});
