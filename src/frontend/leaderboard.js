import config from './env.js';
async function getData() {
  const url = config.MY_URL+"login";
  const formData = new FormData();
  formData.append("username", config.MY_USER);
  formData.append("password", config.MY_PASS);
  try {
    const response = await fetch(url, {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
    
}
getData().then((result) => {
    console.log(result.access_token);
});
