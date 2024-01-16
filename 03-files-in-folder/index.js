const fs = require('fs');
const path = require('path');

const sfPath = path.join(__dirname, 'secret-folder');


fs.readdir(sfPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(sfPath, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        
        if (stats.isFile()) {
          const ext = path.extname(filePath).slice(1);
          const size = stats.size;
          console.log(`${file.slice(0, -ext.length-1)}-${ext}-${(size/ 1024).toFixed(3)} kb`);
        }
      });
    });
  });