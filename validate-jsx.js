const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const filePath = path.join(__dirname, 'VitarkaLabsWebsite.jsx');
const source = fs.readFileSync(filePath, 'utf8');

try {
  babel.transformSync(source, {
    filename: filePath,
    presets: ['@babel/preset-env', '@babel/preset-react'],
    ast: false,
    code: false,
  });
  console.log('✓ VitarkaLabsWebsite.jsx parsed successfully');
} catch (error) {
  console.error('✗ JSX validation failed:');
  console.error(error.message);
  process.exit(1);
}
