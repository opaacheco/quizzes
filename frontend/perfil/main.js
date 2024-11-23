// Inicializa o script
start();

// Variáveis globais para controle do tipo de requisição e ID do usuário em edição
let requestType = ""; // Tipo de operação (edit ou criar)
let userEditId = ""; // ID do usuário que está sendo editado

// Função principal executada ao carregar o script
async function start() {
  // Busca a lista de usuários da API
  const data = await API.get("users", {});
  console.log(data);

  // Configura o evento de submissão do formulário
  document.getElementById("form").onsubmit = formHandleRequest;

  // Renderiza os usuários no DOM
  renderUsers(data);
}

// Renderiza a lista de usuários na tela
async function renderUsers(users) {
  const ulConteiner = document.getElementById("users"); // Contêiner da lista de usuários
  ulConteiner.innerHTML = ""; // Limpa a lista para evitar duplicações

  // Para cada usuário, cria os elementos correspondentes
  for (let user of users) {
    // Campo de e-mail do usuário (desabilitado para edição)
    let inputElementEmail = document.createElement("input");
    inputElementEmail.disabled = true;
    inputElementEmail.value = user.email;

    // Campo de nome do usuário (desabilitado para edição)
    let inputElementNome = document.createElement("input");
    inputElementNome.disabled = true;
    inputElementNome.value = user.name;

    // Botão para editar o usuário
    let buttonEdit = document.createElement("button");
    buttonEdit.innerText = "editar";
    buttonEdit.dataset.id = user._id; // Atribui o ID do usuário ao botão
    buttonEdit.onclick = handleEdit; // Configura o evento de clique

    // Botão para deletar o usuário
    let buttonDelete = document.createElement("button");
    buttonDelete.innerText = "deletar";
    buttonDelete.dataset.id = user._id; // Atribui o ID do usuário ao botão
    buttonDelete.onclick = handleDelete; // Configura o evento de clique

    // Botão extra (jogar) - sem funcionalidade definida
    let buttonJogar = document.createElement("button");
    buttonJogar.innerText = "jogar";

    // Adiciona os elementos criados ao contêiner da lista
    ulConteiner.appendChild(inputElementEmail);
    ulConteiner.appendChild(inputElementNome);
    ulConteiner.appendChild(buttonEdit);
    ulConteiner.appendChild(buttonDelete);
    ulConteiner.appendChild(buttonJogar);
  }
}

// Função para manipular a edição de um usuário
async function handleEdit(evt) {
  // Define o ID do usuário a ser editado e altera o tipo de requisição
  userEditId = this.dataset.id;
  requestType = "edit";

  // Busca os campos de formulário para preenchimento
  let nameElement = document.getElementById("name");
  let emailElement = document.getElementById("email");

  // Faz uma requisição para obter os dados do usuário selecionado
  const user = await API.get("users/" + userEditId);

  // Preenche os campos de nome e e-mail com os dados do usuário
  nameElement.value = user.name;
  emailElement.value = user.email;
}

// Função para manipular a exclusão de um usuário
async function handleDelete(evt) {
  // Obtém o ID do usuário a ser deletado
  let userDeleteId = this.dataset.id;
  console.log(userDeleteId);

  // Envia uma requisição DELETE para a API
  await API.delete("users/" + userDeleteId);

  // Recarrega a lista de usuários
  start();
}

// Função para manipular o envio do formulário
async function formHandleRequest(evt) {
  evt.preventDefault(); // Previne o comportamento padrão do formulário

  const form = new FormData(this); // Coleta os dados do formulário

  if (requestType == "edit") {
    // Caso seja uma edição, envia uma requisição PUT para atualizar os dados
    await API.put("users/" + userEditId, form);
    userEditId = ""; // Limpa o ID do usuário editado
    requestType = "criar"; // Reseta o tipo de requisição para "criar"
  } else {
    // Caso contrário, cria um novo usuário com uma requisição POST
    await API.post("users", form);
  }

  // Limpa os campos do formulário
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  // Recarrega a lista de usuários
  start();
}
