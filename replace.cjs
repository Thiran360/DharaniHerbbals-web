const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walkDir('c:/Users/manoj/Downloads/DharaniHerbbalsweb (3)/DharaniHerbbalsweb/DharaniHerbbalsweb/DharaniHerbbals/src', function(filePath) {
  if (filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('text-align: center')) {
      // replace all variations of text-align: center;
      let newContent = content.replace(/text-align:\s*center;?/g, 'text-align: left;');
      fs.writeFileSync(filePath, newContent, 'utf8');
      count++;
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log(`Finished updating ${count} files.`);
