const fs = require('fs');

function removeDarkBlocks(code) {
  let lines = code.split('\n');
  let result = [];
  let inDarkBlock = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inDarkBlock) {
      if (line.trim().startsWith('.dark')) {
        inDarkBlock = true;
        braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        continue;
      } else {
        result.push(line);
      }
    } else {
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceCount <= 0) {
        inDarkBlock = false;
        braceCount = 0;
      }
    }
  }

  return result.join('\n');
}

const file = 'src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');
const initialLength = content.length;
content = removeDarkBlocks(content);
fs.writeFileSync(file, content);
console.log(`Removed dark blocks. Length changed from ${initialLength} to ${content.length}`);
