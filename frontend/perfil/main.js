start();
async function start() {
  const data = await API.get("users", {});
  console.log(data);
  renderUsers(data);
}

async function renderUsers(users) {
  const ulConteiner = document.getElementById("users");
  ulConteiner.innerHTML = "";
  for (let user of users) {
    let liElementEmail = document.createElement("li");
    liElementEmail.innerHTML = user.email;

    let liElementNome = document.createElement("li");
    liElementNome.innerHTML = user.name;

    let buttonEdit = document.createElement("button");
    buttonEdit.innerText = "editar";
    buttonEdit.dataset.id = user.id;

    let buttonDelete = document.createElement("button");
    buttonDelete.innerText = "deletar";
    buttonDelete.dataset.id = user.id;

    let buttonJogar = document.createElement("button");
    buttonJogar.innerText = "jogar";

    ulConteiner.appendChild(liElementNome);
    ulConteiner.appendChild(liElementEmail);
    ulConteiner.appendChild(buttonEdit);
    ulConteiner.appendChild(buttonDelete);
    ulConteiner.appendChild(buttonJogar);
  }
}
