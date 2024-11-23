// Função inicial que será executada ao iniciar o script
start();

async function start() {
  // Configura o evento de submissão do formulário com um manipulador personalizado
  document.getElementById("form").onsubmit = handleFormRequest;
}

async function handleFormRequest(evt) {
  // Previne o comportamento padrão do formulário (recarregar a página ao enviar)
  evt.preventDefault();

  // Cria uma nova instância de FormData a partir do formulário que disparou o evento
  // 'this' refere-se ao elemento do formulário atual
  const form = new FormData(this);

  // Exibe o conteúdo do objeto FormData no console para depuração
  console.log(form);

  // Chama a função de autenticação 'auth' no objeto 'Auth', passando os dados do formulário
  // 'login' é provavelmente a ação de autenticação desejada
  await Auth.auth("login", form);
}
