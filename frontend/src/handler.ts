
const form = document.querySelector("#userinfo") as HTMLFormElement;
const endpoint = "http://192.168.0.19/api/media/store";

async function sendData() {
  // Associate the FormData object with the form element

  const formData = new FormData(form);
  const fileInput = form.querySelector('input[type="file"][multiple]') as HTMLInputElement;
  if (fileInput && fileInput.files) {
    for (let i = 0; i < fileInput.files.length; i++) {
      console.log(fileInput.files[i]);
    }
  }
  
  
  //console.log(formData.get('file'));
  //
  //

  if (fileInput && fileInput.files) {
    for (let i = 0; i < fileInput.files.length; i++) {

      const formData = new FormData();
      const fileItem = fileInput.files[i];

      formData.append("name", fileItem.name);
      formData.append("type", fileItem.type);
      formData.append("size", fileItem.size.toString()); 
      formData.append("lastModified", fileItem.lastModified.toString());

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

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
  
}

// Take over form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  sendData();
});
