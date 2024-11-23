var express = require("express");
var router = express.Router();
// Importa o framework Express e cria uma instância de um roteador para definir rotas específicas.

const { MongoClient } = require("mongodb");
// Importa o cliente MongoDB para interagir com o banco de dados.

const url = "mongodb://127.0.0.1:27017";
const dbName = "quizzes";
// Define a URL de conexão com o servidor MongoDB e o nome do banco de dados a ser utilizado.

let db;
// Declara a variável `db` que será usada para armazenar a conexão com o banco de dados.

async function connectMongo() {
  // Função assíncrona para conectar ao MongoDB.
  const client = new MongoClient(url);
  // Cria uma instância do cliente MongoDB usando a URL configurada.
  try {
    await client.connect();
    // Tenta conectar ao servidor MongoDB.
    console.log("cheguei");
    // Loga no console para indicar que a conexão foi bem-sucedida.
    db = client.db(dbName);
    // Armazena a instância do banco de dados na variável `db`.
  } catch (error) {
    // Caso ocorra um erro durante a conexão:
    console.error("Erro ao conectar ao MongoDB:", error);
    // Loga o erro no console para depuração.
  }
}

connectMongo();
// Chama a função `connectMongo` para estabelecer a conexão com o banco de dados na inicialização do servidor.

function ensureAuth(req, res, next) {
  // Middleware para garantir que o usuário esteja autenticado.
  if (req.session.user) {
    // Verifica se há um usuário armazenado na sessão.
    return next();
    // Se o usuário estiver autenticado, prossegue para o próximo middleware ou rota.
  }
  return res.sendStatus(401);
  // Caso contrário, retorna um status 401 (não autorizado).
}

router.get("/", ensureAuth, async function (req, res, next) {
  // Define uma rota GET na raiz ("/") que requer autenticação (usando o middleware `ensureAuth`).
  let response = await fetch("https://opentdb.com/api_category.php");
  // Faz uma requisição para a API externa Open Trivia Database para obter categorias de quizzes.
  return res.send(await response.json());
  // Retorna a resposta da API externa no formato JSON para o cliente.
});

router.get("/:id", ensureAuth, async function (req, res, next) {
  // Define uma rota GET dinâmica que recebe um parâmetro `id` na URL ("/:id").
  const { id } = req.params;
  // Extrai o parâmetro `id` da URL.
  console.log(id);
  // Loga o `id` para depuração.

  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=medium`
  );
  // Faz uma requisição para a API externa Open Trivia Database para obter 10 perguntas de uma categoria específica.
  return res.send(await response.json());
  // Retorna a resposta da API externa no formato JSON para o cliente.
});

module.exports = router;
// Exporta o roteador para que ele possa ser usado em outros arquivos do projeto.
