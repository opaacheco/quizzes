start();
async function start() {
  const data = await API.get("users", {});
  renderUsers(data.json());
}

async function renderUsers(params) {
  const ulConteiner = document.getElementById("users");
  for (let i = 0; i < params.length; i++) {}
}
