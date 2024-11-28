
const form = document.querySelector("#userinfo") as HTMLFormElement;
const endpoint = "http://192.168.0.19/api/media/store";
const chunkSize = 1024 * 1024; // 1MB chunks

async function chunkData(fileItem: File) {

  const nChunks = Math.ceil(fileItem.size / chunkSize);
  let start = 0;
  for (let current = 0; current < nChunks; current++) {
    const chunk = fileItem.slice(start, start + chunkSize);
    start += chunkSize;

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append("fileName", fileItem.name);
    formData.append("fileType", fileItem.type);
    formData.append("fileSize", fileItem.size.toString()); 
    formData.append("chunkIndex", current);
    formData.append("totalChunks", nChunks);
    formData.append("fileLastModified", fileItem.lastModified.toString());

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        // Set the FormData instance as the request body
        body: formData,
      });
      console.log(await response.json());
    } catch (e) {
      console.error(e);
    }

  }
}

async function logEvent(msg: String) {
  const timeStr = new Date().toLocaleTimeString();

  const logElem = document.querySelector("#fileUploadStatus");
  if (logElem) {
    logElem.innerHTML += `${timeStr}: ${msg}<br/>`;
  }
}

async function sendData() {
  // Associate the FormData object with the form element

  const fileInput = form.querySelector('input[type="file"][multiple]') as HTMLInputElement;

  if (fileInput && fileInput.files) {
    for (let i = 0; i < fileInput.files.length; i++) {

      const fileItem = fileInput.files[i];
      await chunkData(fileItem);
      await logEvent(`Uploaded "${fileItem.name}"`);

    }
  }
}

// Take over form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  sendData();
});
