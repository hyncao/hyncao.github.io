const fs = require('fs');

exports.coverPromise = fn => (
  new Promise((resolve) => {
    resolve(fn());
  })
);

exports.readFileData = path => (
  new Promise((resolve, reject) => {
    fs.readFile(`./src/data/${path}`, 'utf-8', async (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      const result = data.toString();
      resolve(result);
    });
  })
);
