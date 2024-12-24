/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../resources');
const outputFile = path.join(outputDir, 'plantuml.jar');

const url = 'https://github.com/plantuml/plantuml/releases/download/v1.2024.8/plantuml-mit-1.2024.8.jar';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, dest, callback) {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(callback);
        console.log('Downloaded:', dest);
      });
    } else if (res.statusCode === 302 || res.statusCode === 301) {
      console.log('Redirecting to:', res.headers.location);
      downloadFile(res.headers.location, dest, callback);
    } else {
      console.error(`Failed to download file. Status: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
}

downloadFile(url, outputFile, () => {
  console.log('Download complete!');
});
