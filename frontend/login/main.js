start();

async function start() {
  document.getElementById("form").onsubmit = handleFormRequest;
}

async function handleFormRequest(evt) {
  evt.preventDefault();

  const form = new FormData(evt.target);
  await Auth.login(form);
}
