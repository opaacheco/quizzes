// Função principal que inicia o processo.
start();

async function start() {
  // Faz uma requisição GET à API para obter os quizzes disponíveis.
  // O método `API.get` é chamado com o endpoint "quizzes" e parâmetros vazios.
  const data = await API.get("quizzes", {});

  // Passa a lista de categorias de quizzes (assumindo que estão em `data.trivia_categories`)
  // para a função que renderiza os botões na interface.
  renderQuizzes(data.trivia_categories);
}

function renderQuizzes(quizzes) {
  // Seleciona o elemento HTML com o ID "quizzes", onde os botões serão inseridos.
  const ulConteiner = document.getElementById("quizzes");

  // Limpa o conteúdo atual do contêiner para evitar duplicações ao renderizar.
  ulConteiner.innerHTML = "";

  // Itera sobre a lista de quizzes recebida.
  for (let quizz of quizzes) {
    // Cria um botão HTML para cada categoria de quiz.
    let buttonCategory = document.createElement("button");

    // Define o texto do botão como o nome da categoria.
    buttonCategory.innerHTML = quizz.name;

    // Exibe o ID da categoria no console (para depuração).
    console.log(quizz.id);

    // Adiciona um evento `onclick` ao botão, que redireciona o usuário para uma nova página.
    // A URL inclui o ID da categoria como parâmetro de query (codificado para segurança).
    buttonCategory.onclick = function () {
      window.location.href = `../quizPage/quizPage.html?id=${encodeURIComponent(
        quizz.id // Codifica o ID para garantir que caracteres especiais não quebrem a URL.
      )}`;
    };

    // Adiciona o botão criado como filho do contêiner.
    ulConteiner.appendChild(buttonCategory);
  }
}
