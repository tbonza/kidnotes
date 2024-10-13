
const endpoint = "http://192.168.0.19/api/media/store";
const form = document.getElementById("#userinfo") as HTMLFormElement; 

async function sendData() {
  // Associate the FormData object with the form element
  const formData = new FormData(form);

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

// Take over form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendData();
});
