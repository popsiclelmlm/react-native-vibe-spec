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
