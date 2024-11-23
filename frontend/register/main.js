// Inicia a execução do código chamando a função start
start();

async function start() {
  // Configura o evento de submissão do formulário, associando-o ao manipulador handleFormRegister
  document.getElementById("form").onsubmit = handleFormRegister;
}

// Função que será chamada quando o formulário for submetido
async function handleFormRegister(evt) {
  // Previne o comportamento padrão do formulário (não recarregar a página)
  evt.preventDefault();

  // Cria um objeto FormData com os dados do formulário atual
  const form = new FormData(this);

  // Exibe os dados do formulário no console para depuração
  console.log(form);

  // Chama a função de autenticação Auth.auth passando os dados do formulário e a ação "users"
  await Auth.auth("users", form);
}
