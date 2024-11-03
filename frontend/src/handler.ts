
const endpoint = "http://192.168.0.19/api/media/store";

async function sendData(form: HTMLFormElement) {
  // Associate the FormData object with the form element
  const formData = new FormData(form);
  console.log(`form data ${formData}`);

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


window.onload=function(){
  const form = document.querySelector("#userinfo") as HTMLFormElement;

  // Take over form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendData(form);
  });
}
