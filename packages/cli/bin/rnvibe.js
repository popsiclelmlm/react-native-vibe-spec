#!/usr/bin/env node
let core;
try {
  core = await import("@react-native-vibe-spec/core");
} catch {
  core = await import("../../core/src/index.js");
}

const {
  checkProject,
  createFeature,
  generatePrChecklist,
  initProject,
  recommendations,
  renderCheckReport
} = core;

const args = process.argv.slice(2);
if (args[0] === "--") {
  args.shift();
}
const command = args[0] ?? "help";
const rest = args.slice(1);
const flags = parseFlags(rest);
const cwd = process.cwd();

try {
  if (command === "init") {
    const result = initProject(cwd, {
      agents: splitCsv(flags.agent ?? "codex"),
      force: Boolean(flags.force)
    });
    printChanges("Initialized react-native-vibe-spec", result);
  } else if (command === "new") {
    const type = flags.positionals[0];
    const name = flags.positionals.slice(1).join(" ");
    if (type !== "feature" || !name) {
      fail("Usage: rnvibe new feature <name>");
    }
    const result = createFeature(cwd, name, { force: Boolean(flags.force) });
    printChanges(`Created feature scaffold: ${result.slug}`, result);
  } else if (command === "check") {
    const result = checkProject(cwd);
    if (flags.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(renderCheckReport(result));
    }
    if (flags.strict && result.score < 100) {
      process.exitCode = 1;
    }
  } else if (command === "score") {
    console.log(checkProject(cwd).score);
  } else if (command === "doctor") {
    const result = checkProject(cwd);
    console.log(renderCheckReport(result));
    const items = recommendations(result);
    if (items.length > 0) {
      console.log("\nRecommended next actions");
      for (const item of items) {
        console.log(`- ${item.action}`);
      }
    }
  } else if (command === "generate") {
    const target = flags.positionals[0];
    if (target === "agents") {
      const result = initProject(cwd, {
        agents: splitCsv(flags.agent ?? "codex,copilot,claude,cursor"),
        force: Boolean(flags.force)
      });
      printChanges("Generated agent instructions", result);
    } else if (target === "pr-checklist") {
      const result = generatePrChecklist(cwd, { force: Boolean(flags.force) });
      printChanges("Generated PR checklist", result);
    } else {
      fail("Usage: rnvibe generate agents|pr-checklist");
    }
  } else {
    printHelp();
  }
} catch (error) {
  fail(error.message);
}

function parseFlags(values) {
  const parsed = { positionals: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) {
      parsed.positionals.push(value);
      continue;
    }
    const [rawKey, inlineValue] = value.slice(2).split("=");
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (inlineValue !== undefined) {
      parsed[key] = inlineValue;
      continue;
    }
    const next = values[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

function splitCsv(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function printChanges(title, result) {
  console.log(title);
  if (result.created.length > 0) {
    console.log("Created:");
    for (const file of result.created) {
      console.log(`- ${file}`);
    }
  }
  if (result.skipped.length > 0) {
    console.log("Skipped existing files:");
    for (const file of result.skipped) {
      console.log(`- ${file}`);
    }
  }
}

function printHelp() {
  console.log(`react-native-vibe-spec

Usage:
  rnvibe init [--agent codex,copilot,claude,cursor] [--force]
  rnvibe new feature <name> [--force]
  rnvibe check [--json] [--strict]
  rnvibe score
  rnvibe doctor
  rnvibe generate agents [--agent codex,copilot,claude,cursor] [--force]
  rnvibe generate pr-checklist [--force]
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
