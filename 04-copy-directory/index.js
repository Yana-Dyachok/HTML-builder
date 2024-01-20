const path = require('path');
const fs = require('fs');

const finalPath = __dirname;
const originFilesDir = path.join(__dirname, 'files');

function copyDir(from, dir, dirName) {
  const pathFilesCopy = path.join(dir, dirName);

  fs.mkdir(pathFilesCopy, {recursive: true}, (err) => {if (err) throw err;});

  fs.readdir(pathFilesCopy, {withFileTypes: true}, (err, file) => {
    if (err) throw err;
    for (let f of file) {
      if (f.isFile()) {
        fs.unlink(path.join(pathFilesCopy, f.name), err => {if (err) throw err;});
      }
    }
  });

  fs.readdir(from, {withFileTypes: true}, (err, file) => {
    if (err) throw err;
    for (let f of file) {
      if (f.isFile()) {
        fs.copyFile(path.join(from, f.name), path.join(pathFilesCopy, f.name), err => {if (err) throw err;});
      }
    }
  });
}

copyDir(originFilesDir, finalPath, 'files-copy');