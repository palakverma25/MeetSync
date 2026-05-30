/**
 * Push APP_BASE_URL, RESEND_API_KEY, and EMAIL_FROM from local .env to the linked Vercel project.
 * Run from repo root: node code/scripts/push-vercel-env-from-dotenv.mjs
 * Or from code/: node scripts/push-vercel-env-from-dotenv.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const codeRoot = path.join(__dirname, "..");

function parseEnv(content) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1).replace(/\\"/g, '"');
    }
    out[k] = v;
  }
  return out;
}

function vercelRm(name, env) {
  spawnSync("npx", ["vercel", "--non-interactive", "env", "rm", name, env, "-y"], {
    stdio: "ignore",
    cwd: codeRoot,
    shell: true,
  });
}

function vercelAdd(name, env, value, sensitive) {
  const args = [
    "vercel",
    "--non-interactive",
    "env",
    "add",
    name,
    env,
    "--value",
    value,
    "-y",
    "--force",
  ];
  if (sensitive) args.push("--sensitive");
  const r = spawnSync("npx", args, { stdio: "inherit", cwd: codeRoot, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const envPath = path.join(codeRoot, ".env");
if (!fs.existsSync(envPath)) {
  console.error("Missing code/.env — nothing to sync.");
  process.exit(1);
}

const cfg = parseEnv(fs.readFileSync(envPath, "utf8"));
const targets = ["production", "preview"];
const appUrl = "https://code-vfv.vercel.app";

for (const t of targets) {
  vercelRm("APP_BASE_URL", t);
  vercelAdd("APP_BASE_URL", t, appUrl, false);
}

if (cfg.RESEND_API_KEY) {
  for (const t of targets) {
    vercelRm("RESEND_API_KEY", t);
    vercelAdd("RESEND_API_KEY", t, cfg.RESEND_API_KEY, true);
  }
}
if (cfg.EMAIL_FROM) {
  for (const t of targets) {
    vercelRm("EMAIL_FROM", t);
    vercelAdd("EMAIL_FROM", t, cfg.EMAIL_FROM, false);
  }
}

const authVars = [
  ["JWT_SECRET", true],
  ["ADMIN_EMAIL", false],
  ["ADMIN_PASSWORD", true],
  ["ADMIN_NAME", false],
];

for (const [name, sensitive] of authVars) {
  const value = cfg[name]?.trim();
  if (!value) continue;
  for (const t of targets) {
    vercelRm(name, t);
    vercelAdd(name, t, value, sensitive);
  }
}

console.log(
  "Synced APP_BASE_URL, auth vars (+ Resend if present) to Vercel for production & preview.",
);
