/**
 * Copies MathLive KaTeX fonts to public/ and generates CSS with absolute font URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontsSrc = path.join(root, "node_modules", "mathlive", "fonts");
const fontsDest = path.join(root, "public", "mathlive-fonts");
const cssSrc = path.join(root, "node_modules", "mathlive", "mathlive-fonts.css");
const cssDest = path.join(root, "src", "styles", "mathlive-katex-fonts.css");

if (!fs.existsSync(fontsSrc)) {
  console.warn(
    "[copy-mathlive-fonts] node_modules/mathlive/fonts not found — run npm install first.",
  );
  process.exit(0);
}

fs.mkdirSync(fontsDest, { recursive: true });

for (const name of fs.readdirSync(fontsSrc)) {
  if (!name.endsWith(".woff2")) continue;
  fs.copyFileSync(path.join(fontsSrc, name), path.join(fontsDest, name));
}

const css = fs.readFileSync(cssSrc, "utf8").replace(/url\(fonts\//g, "url(/mathlive-fonts/");
fs.mkdirSync(path.dirname(cssDest), { recursive: true });
fs.writeFileSync(cssDest, css, "utf8");

console.info(
  `[copy-mathlive-fonts] Copied KaTeX fonts → public/mathlive-fonts/ and wrote ${path.relative(root, cssDest)}`,
);
