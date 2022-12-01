const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pageFetcher = (url, destination) => {
  request(url, (error, response, body) => {
    console.log('error', error);
    console.log('statusCode:', response && response.statusCode);

    fs.access(destination, fs.F_OK, (err) => {
      if (err) {
        fs.writeFile(destination, body, (err) => {
          if (err) throw err;
          console.log(`Downloaded and saved to ${destination}`);
        });
        rl.close();
      } else if (!err) {
        rl.question(`${destination} already exists. Overwrite file? [Y/N] `, (answer) => {
          rl.close();
          if (answer === 'y' || answer.toLowerCase() === 'y') {
            fs.writeFile(destination, body, (err) => {
              if (err) throw err;
              console.log(`Downloaded and save to ${destination}`);
            });
          } else {
            console.log("Invalid input, Input must be [Y/N}");
          }
        });
      } else {
        rl.close();
      }
    });
  });
};

rl.question("Enter page URL to download: ",(pageUrl) => {
  rl.question("Enter destination file path ", (destPath) => {
    pageFetcher(pageUrl, destPath);
  });
});