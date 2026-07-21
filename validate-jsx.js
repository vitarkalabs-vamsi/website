const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function collectJsxFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectJsxFiles(full, out);
    else if (entry.name.endsWith('.jsx')) out.push(full);
  }
  return out;
}

const files = collectJsxFiles(path.join(__dirname, 'src'));
let failed = false;

for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8');
  try {
    babel.transformSync(source, {
      filename: filePath,
      presets: ['@babel/preset-env', '@babel/preset-react'],
      ast: false,
      code: false,
    });
    console.log(`✓ ${path.relative(__dirname, filePath)} parsed successfully`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${path.relative(__dirname, filePath)} failed to parse:`);
    console.error(error.message);
  }
}

if (failed) process.exit(1);
