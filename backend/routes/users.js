var express = require("express");
var router = express.Router();
// Importa o Express e cria uma instância de roteador para definir rotas relacionadas a "users".

const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
// Importa o cliente do MongoDB, incluindo as funções para manipulação de IDs e retorno de documentos.

const { createHash } = require("crypto");
// Importa a função `createHash` para hashear senhas com o algoritmo SHA-512.

const url = "mongodb://127.0.0.1:27017";
const dbName = "quizzes";
// Define as configurações de conexão com o MongoDB (URL do servidor e nome do banco de dados).

let db;
// Variável global para armazenar a conexão com o banco de dados.

async function conexaoMongo() {
  // Função assíncrona para conectar ao MongoDB.
  const cliente = new MongoClient(url);
  try {
    await cliente.connect();
    // Conecta ao servidor MongoDB.
    console.log("conectado bb");
    db = cliente.db(dbName);
    // Armazena a instância do banco de dados conectado.
  } catch (err) {
    // Loga qualquer erro que ocorra ao conectar.
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

conexaoMongo();
// Chama a função de conexão assim que o servidor é iniciado.

function ensureAuth(req, res, next) {
  // Middleware para garantir que o usuário esteja autenticado.
  if (req.session.user) {
    return next();
    // Se o usuário está na sessão, avança para a próxima etapa.
  }
  return res.sendStatus(401);
  // Caso contrário, retorna 401 (não autorizado).
}

// ** ROTA GET - LISTAR TODOS OS USUÁRIOS **
router.get("/", ensureAuth, async function (req, res, next) {
  try {
    const users = await db.collection("users").find().toArray();
    // Busca todos os usuários na coleção "users".
    if (!users) {
      return res.status(404).send("Nenhum utilizador encontrado");
      // Retorna 404 se não encontrar nenhum usuário.
    }
    return res.status(200).json(users);
    // Retorna os usuários encontrados com status 200.
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    return res.status(500).json({ message: "Erro no servidor" });
    // Retorna erro 500 em caso de problemas no servidor.
  }
});

// ** ROTA GET - BUSCAR USUÁRIO POR ID **
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  // Extrai o ID dos parâmetros da URL.
  try {
    const users = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    // Busca o usuário correspondente ao ID.
    if (!users) {
      return res.status(404).send("Utilizador encontrado");
      // Retorna 404 se o usuário não existir.
    }
    return res.status(200).json(users);
    // Retorna o usuário encontrado.
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    return res.status(500).json({ message: "Erro no servidor" });
    // Retorna erro 500 em caso de problemas no servidor.
  }
});

// ** ROTA GET - PERFIL DO USUÁRIO (INCOMPLETO) **
router.get("/profile", async function (req, res, next) {
  const user = req.user;
  console.log(user.name);
  // Essa rota parece incompleta, pois não retorna nada ao cliente.
});

// ** ROTA POST - CRIAR NOVO USUÁRIO **
router.post("/", async function (req, res, next) {
  const { name, email, password } = req.body;
  // Extrai os dados do corpo da requisição.

  // Verifica a presença dos campos obrigatórios:
  if (!email) {
    return res.status(400).send("Credenciais necessárias: e-mail ausente.");
  }
  if (!name) {
    return res.status(400).send("Credenciais necessárias: nome ausente.");
  }
  if (!password) {
    return res.status(400).send("Credenciais necessárias: senha ausente.");
  }

  const hash = createHash("sha512");
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  // Hasheia a senha com SHA-512.

  const user = {
    name: name,
    email: email,
    password: hashedPassword,
  };
  // Cria o objeto do usuário com as informações fornecidas.

  try {
    const existingUser = await db.collection("users").findOne({ email: email });
    // Verifica se o e-mail já está cadastrado.
    if (existingUser) {
      return res.status(400).send("E-mail já está cadastrado!!!");
    }

    await db.collection("users").insertOne(user);
    // Insere o novo usuário no banco de dados.
    return res.status(201).send("Utilizador criado com sucesso!!!");
    // Retorna 201 indicando que o usuário foi criado.
  } catch (error) {
    console.error("Erro ao criar Utilizador:", error);
    return res.status(500).json({ message: "Erro no servidor" });
    // Retorna erro 500 em caso de problemas no servidor.
  }
});

// ** ROTA DELETE - REMOVER USUÁRIO POR ID **
router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  // Extrai o ID dos parâmetros da URL.
  try {
    const result = await db
      .collection("users")
      .findOneAndDelete({ _id: new ObjectId(id) });
    // Remove o usuário correspondente ao ID.
    if (!result.value) {
      return res.status(404).json("Utilizador não existe!!!");
      // Retorna 404 se o usuário não existir.
    }
    return res.status(200).json("Utilizador excluído com sucesso!!!");
    // Retorna sucesso se o usuário for excluído.
  } catch (error) {
    console.error("Erro ao excluir utilizador:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// ** ROTA PUT - ATUALIZAR USUÁRIO POR ID **
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  // Extrai os dados do corpo da requisição e o ID dos parâmetros.

  const errors = {};
  if (!name) errors.nome = "nome indefinido";
  if (!email) errors.mail = "email indefinido";
  if (!password) errors.password = "password inválida";

  if (Object.keys(errors).length > 0) {
    return res.status(422).send(errors);
    // Retorna erro 422 se houver campos inválidos.
  }

  const hash = createHash("sha512");
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  // Hasheia a nova senha.

  try {
    const user = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, email, password: hashedPassword } },
        { returnDocument: "after" }
      );
    // Atualiza os dados do usuário.

    if (!user.value) {
      return res
        .status(404)
        .send("Utilizador não encontrado ou não modificado.");
    }
    return res.status(200).json(user.value);
    // Retorna os dados do usuário atualizado.
  } catch (error) {
    console.error("Erro ao atualizar utilizador:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
// Exporta o roteador para ser usado em outros arquivos.
