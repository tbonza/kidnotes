// Server-side (Node.js & Express)
const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/upload', (req, res) => {
  const { filename, totalSize, currentChunk } = req.body;

  const chunk = req.files.chunk;

  const filePath = `./uploads/${filename}`;

  // Create file if it doesn't exist, or append to it
  const writeStream = fs.createWriteStream(filePath, { flags: currentChunk === 0 ? 'w' : 'a' });
  chunk.pipe(writeStream);

  writeStream.on('finish', () => {
    if (req.body.totalSize === (parseInt(currentChunk) + 1) * chunkSize) {
      console.log('File upload complete:', filename);
    }
    res.sendStatus(200);
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.sendStatus(500);
  });
});

app.listen(3000);