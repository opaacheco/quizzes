start();

let requestType = "";

let userEditId = "";

async function start() {
  const data = await API.get("users", {});
  console.log(data);
  document.getElementById("form").onsubmit = formHandleRequest;
  renderUsers(data);
}

async function renderUsers(users) {
  const ulConteiner = document.getElementById("users");
  ulConteiner.innerHTML = "";
  for (let user of users) {
    let inputElementEmail = document.createElement("input");
    inputElementEmail.disabled = true;
    inputElementEmail.value = user.email;

    let inputElementNome = document.createElement("input");
    inputElementNome.disabled = true;
    inputElementNome.value = user.name;

    let buttonEdit = document.createElement("button");
    buttonEdit.innerText = "editar";
    buttonEdit.dataset.id = user._id;
    buttonEdit.onclick = handleEdit;

    let buttonDelete = document.createElement("button");
    buttonDelete.innerText = "deletar";
    buttonDelete.dataset.id = user._id;
    buttonDelete.onclick = handleDelete;

    let buttonJogar = document.createElement("button");
    buttonJogar.innerText = "jogar";

    ulConteiner.appendChild(inputElementEmail);
    ulConteiner.appendChild(inputElementNome);
    ulConteiner.appendChild(buttonEdit);
    ulConteiner.appendChild(buttonDelete);
    ulConteiner.appendChild(buttonJogar);
  }
}

async function handleEdit(evt) {
  userEditId = this.dataset.id;
  requestType = "edit";
  let nameElement = document.getElementById("name");

  let emailElement = document.getElementById("email");

  const user = await API.get("users/" + userEditId);

  nameElement.value = user.name;

  emailElement.value = user.email;
}

async function handleDelete(evt) {
  userDeleteId = this.dataset.id;
  console.log(userDeleteId);
  await API.delete("users/" + userDeleteId);

  start();
}

async function formHandleRequest(evt) {
  evt.preventDefault();

  const form = new FormData(this);

  if (requestType == "edit") {
    await API.put("users/" + userEditId, form);
    userEditId = "";
    requestType = "criar";
  } else {
    await API.post("users", form);
  }

  let nameEl = document.getElementById("name");

  nameEl.value = "";

  document.getElementById("email").value = "";

  document.getElementById("password").value = "";

  start();
}
