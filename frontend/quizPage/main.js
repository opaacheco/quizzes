start();

async function start() {
  const id = await getParams("id");
  console.log(id);
  const data = await API.get("quizzes/" + id);
  console.log(data.results);
  renderQuiz(data.results);
}

async function getParams(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function renderQuiz(perguntas) {
  const ulConteiner = document.getElementById("quizzes");
  ulConteiner.innerHTML = "";

  for (let pergunta of perguntas) {
    const humPergunta = document.createElement("h1");
    humPergunta.innerHTML = pergunta.question;
    ulConteiner.appendChild(humPergunta);
    renderAwnser(pergunta, ulConteiner);
  }
}

function renderAwnser(questionObject, elemento) {
  let respostas = questionObject.incorrect_answers;
  respostas.splice(
    (respostas.length + 1) * Math.random(),
    0,
    questionObject.correct_answer
  );
  for (let resposta of respostas) {
    const opcao = document.createElement("button");
    opcao.innerHTML = resposta;
    opcao.onclick = function () {
      if (opcao.innerText == questionObject.correct_answer) {
        opcao.style.backgroundColor = "green";
      } else {
        opcao.style.backgroundColor = "red";
      }
    };
    elemento.appendChild(opcao);
  }
}
