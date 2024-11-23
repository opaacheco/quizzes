const { createHash } = require("crypto");
// Importa a função `createHash` do módulo `crypto` para usar algoritmos de hash (no caso, SHA-512).

var express = require("express");
var router = express.Router();
// Importa o framework Express para gerenciar rotas HTTP e cria um roteador para lidar com as rotas relacionadas.

const { MongoClient } = require("mongodb");
// Importa o cliente MongoDB para conexão e manipulação do banco de dados.

const url = "mongodb://127.0.0.1:27017";
const dbName = "quizzes";
// Define a URL de conexão com o MongoDB e o nome do banco de dados que será usado.

let db;
// Declara a variável `db` para armazenar a instância do banco de dados conectada.

async function conexaoMongo() {
  // Função assíncrona para conectar ao MongoDB.
  const cliente = new MongoClient(url);
  // Cria uma nova instância do cliente MongoDB usando a URL configurada.
  try {
    await cliente.connect();
    // Tenta conectar ao servidor MongoDB.
    console.log("conectado bb");
    // Loga no console para indicar que a conexão foi bem-sucedida.
    db = cliente.db(dbName);
    // Armazena a instância do banco de dados na variável `db`.
  } catch (err) {
    // Caso ocorra um erro durante a conexão:
    console.error("Erro ao conectar ao MongoDB:", err);
    // Loga o erro no console para depuração.
  }
}

conexaoMongo();
// Chama a função `conexaoMongo` para iniciar a conexão com o MongoDB.

router.post("/", async function (req, res, next) {
  // Define uma rota POST na raiz ("/") que será usada para autenticação de usuários.
  const { email, password } = req.body;
  // Extrai `email` e `password` do corpo da requisição.

  const hash = createHash("sha512");
  // Cria uma instância do hash usando o algoritmo SHA-512.

  hash.update(password);
  // Alimenta o hash com a senha recebida.

  const hashedPassword = hash.digest("hex");
  // Gera o hash final no formato hexadecimal.

  console.log(hashedPassword);
  // Loga o hash da senha para depuração (não recomendado em produção, pois expõe dados sensíveis).

  try {
    const user = await db.collection("users").findOne({ email: email });
    // Tenta encontrar um usuário no banco de dados cuja propriedade `email` corresponda ao fornecido.

    if (!user || hashedPassword !== user.password) {
      // Verifica se o usuário não foi encontrado ou se a senha não corresponde:
      return res.status(401).json({ message: "Credenciais inválidas." });
      // Retorna um erro 401 (não autorizado) com uma mensagem indicando credenciais inválidas.
    }

    req.session.user = user;
    // Se as credenciais forem válidas, armazena o usuário na sessão para controle posterior.

    res.send({ autenticated: true });
    // Responde com uma mensagem de autenticação bem-sucedida.
  } catch (error) {
    // Caso ocorra algum erro na busca do usuário:
    console.error("Erro ao buscar usuário:", error);
    // Loga o erro no console.
    return res.status(500).json({ message: "Erro no servidor" });
    // Retorna um erro 500 (erro interno do servidor) com uma mensagem genérica.
  }
});

module.exports = router;
// Exporta o roteador para que possa ser usado em outros arquivos do projeto.
