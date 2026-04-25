/**
 * Fail if any JSON under src/data starts with a UTF-8 BOM.
 * Turbopack treats BOM-prefixed JSON as invalid ("Unable to make a module from invalid JSON").
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src", "data");

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(p));
    else if (name.isFile() && p.endsWith(".json")) out.push(p);
  }
  return out;
}

const files = walk(root);
const bad = [];
for (const file of files) {
  const buf = fs.readFileSync(file);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    bad.push(path.relative(process.cwd(), file));
  }
}

if (bad.length) {
  console.error("UTF-8 BOM found at start of JSON (breaks Turbopack). Fix or re-save without BOM:");
  for (const f of bad) console.error("  ", f);
  process.exit(1);
}

console.log(`check-no-bom-json: OK (${files.length} files under src/data)`);
