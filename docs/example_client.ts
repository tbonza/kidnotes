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