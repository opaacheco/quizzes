start();

async function start() {
  const data = await API.get("quizzes", {});
  renderQuizzes(data.trivia_categories);
}

function renderQuizzes(quizzes) {
  const ulConteiner = document.getElementById("quizzes");
  ulConteiner.innerHTML = "";
  for (let quizz of quizzes) {
    let buttonCategory = document.createElement("button");
    buttonCategory.innerHTML = quizz.name;
    console.log(quizz.id);
    buttonCategory.onclick = function () {
      window.location.href = `../quizPage/quizPage.html?id=${encodeURIComponent(
        quizz.id
      )}`;
    };
    ulConteiner.appendChild(buttonCategory);
  }
}
