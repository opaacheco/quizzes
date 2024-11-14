start();

async function start() {
  const data = await API.get("quizzes", {});
  renderQuizzes(data);
}

function renderQuizzes(quizzes) {
  const ulConteiner = document.getElementById("quizzes");
  ulConteiner.innerHTML = "";
  for (let quizz of quizzes) {
    let liElementEmail = document.createElement("li");
    liElementEmail.innerHTML = quizz.quiz;
    ulConteiner.appendChild(liElementEmail);
  }
}
