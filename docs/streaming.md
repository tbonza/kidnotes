# Problem Statement

stream file from client with fetch, post to express nodejs without multer

# Solution

* [example\_client.ts](example_client.ts)
* [example\_server.ts](example_server.ts)


## Client


```ts
// Client-side (JavaScript)
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const chunkSize = 1024 * 1024; // 1MB chunks

  for (let start = 0; start < file.size; start += chunkSize) {
    const chunk = file.slice(start, start + chunkSize);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('filename', file.name);
    formData.append('totalSize', file.size);
    formData.append('currentChunk', start / chunkSize);

    await fetch('/upload', {
      method: 'POST',
      body: formData
    });
  }
});
```

## Server

```ts
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
```

# Explanation:

## Client-side:
* **Chunk the file:** The file is split into smaller chunks for efficient transfer.
* **Send chunks with Fetch:** Each chunk is sent to the server using the Fetch API as part of a FormData object.
* **Include metadata:** Information like the filename, total file size, and current chunk index is sent along with each chunk.

## Server-side:
* **Receive chunks:** The server receives the chunks and extracts the metadata.
* **Write chunks to file:** The chunks are written to a file, either creating a new file or appending to an existing one based on the chunk index.
* **Handle completion:** Once all chunks are received, the server signals that the upload is complete.


## Key points:

* **No Multer:** This approach avoids the need for the Multer library.
* **Streaming:** The file is streamed to the server, which can improve performance for large files.
* **Error handling:** Both the client and server should implement error handling to manage issues during the upload process.
