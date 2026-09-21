/**
 * Copies public/ and .next/static into .next/standalone for production.
 * Required when output: "standalone" is set in next.config.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standaloneDir = path.join(root, ".next", "standalone");

if (!fs.existsSync(standaloneDir)) {
  console.warn(
    "[prepare-standalone] .next/standalone not found — run `npm run build` first.",
  );
  process.exit(0);
}

const publicSrc = path.join(root, "public");
const publicDest = path.join(standaloneDir, "public");
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");

if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
  console.info("[prepare-standalone] Copied public/ → standalone/public/");
}

if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
  console.info("[prepare-standalone] Copied .next/static → standalone/.next/static/");
}

console.info("[prepare-standalone] Done. Start with: node .next/standalone/server.js");
