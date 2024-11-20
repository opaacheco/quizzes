var express = require("express");
var router = express.Router();
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
const { createHash } = require("crypto");

const url = "mongodb://127.0.0.1:27017";
const dbName = "quizzes";

let db;

async function conexaoMongo() {
  const cliente = new MongoClient(url);
  try {
    await cliente.connect();
    console.log("conectado bb");
    db = cliente.db(dbName);
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

conexaoMongo();

router.get("/", async function (req, res, next) {
  try {
    const users = await db.collection("users").find().toArray();
    if (!users) {
      return res.status(404).send("Nenhum utilizador encontrado");
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
});

router.get("/perfil", async function (req, res, next) {
  console.log("oi");
});

router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const users = await db.collection("users").findOne({ _id: ObjectId(id) });
    if (!users) {
      return res.status(404).send("Utilizador encontrado");
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
});

router.get("/profile", async function (req, res, next) {
  const user = req.user;
  console.log(user.name);
});

router.post("/", async function (req, res, next) {
  const { name, email, password } = req.body;

  if (!email) {
    return res.status(400).send("Credenciais necessárias: e-mail ausente.");
  }
  if (!name) {
    return res.status(400).send("Credenciais necessárias:  nome ausente.");
  }
  if (!password) {
    return res.status(400).send("Credenciais necessárias: senha ausente.");
  }

  const hash = createHash("sha512");

  hash.update(password);

  const hashedPassword = hash.digest("hex");

  const user = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  try {
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      return res.status(400).send("E-mail já está cadastrado!!!");
    }

    await db.collection("users").insertOne(user);
    return res.status(201).send("Utilizador criado com sucesso!!!");
  } catch (error) {
    console.error("Erro ao criar Utilizador:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  await db
    .collection("users")
    .findOneAndDelete({ _id: ObjectId(id) })
    .then((user) => {
      if (!user) {
        return res.status(404).json("Utilizador não existe!!!");
      }
      return res.status(200).json("Utilizador excluido com sucesso!!!");
    })
    .catch((error) => {
      console.error("Erro ao excluir utilizador :", error);
    });
});

router.put("/:id", async function (req, res, next) {
  const id = req.params;
  const { nome, email, password } = req.body;
  const errors = {};

  if (!nome) errors.nome = "nome indefinido";
  if (!email) errors.mail = "email indefinido";
  if (!password) errors.password = "password inválida";

  if (Object.keys(errors).length > 0) {
    return res.status(422).send(errors);
  }

  const hash = createHash("sha512");

  hash.update(password);

  const hashedPassword = hash.digest("hex");

  try {
    const user = await db.collection("users").findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          name: nome,
          email: email,
          password: hashedPassword,
        },
      },
      { returnDocument: "after" }
    );
    if (!user.value) {
      return res
        .status(404)
        .send("Utilizador não encontrado ou não modificado.");
    }
    res.send(user.value);
  } catch (error) {}
});

module.exports = router;
