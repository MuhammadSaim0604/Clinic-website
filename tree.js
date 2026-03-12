import fs from "fs";
import path from "path";

const MAX_DEPTH = 5;
const SKIP_FOLDERS = [
  "node_modules",
  ".git",
  "dist",
  ".agents",
  ".cache",
  ".local",
];

function printTree(dir, prefix = "", depth = 0) {
  if (depth > MAX_DEPTH) return;

  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    return;
  }

  files = files.filter((f) => !SKIP_FOLDERS.includes(f));

  files.forEach((file, index) => {
    const fullPath = path.join(dir, file);
    const isLast = index === files.length - 1;

    const connector = isLast ? "└── " : "├── ";
    console.log(prefix + connector + file);

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(fullPath, newPrefix, depth + 1);
    }
  });
}

const startDir = process.cwd();

console.log(path.basename(startDir));
printTree(startDir);
