const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');
let data = '';

fs.writeFile(pathToFile, '', err => {if (err) throw err;});

fs.readdir(pathToStyles, {withFileTypes: true}, (err, file) => {
  if (err) throw err;
  for (let f of file) {
    let pathToCss = path.join(pathToStyles, f.name);
    let fileType = path.extname(pathToCss);
    if (f.isFile() && fileType === '.css') {
      const readableStream = fs.createReadStream(pathToCss, 'utf-8');
      readableStream.on('data', chunk => data += chunk);
      readableStream.on('end', () => fs.writeFile(pathToFile, data, err => {if (err) throw err;}));
    }
  }
});