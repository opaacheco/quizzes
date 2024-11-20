const { createHash } = require("crypto");
var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");

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

router.post("/", async function (req, res, next) {
  const { email, password } = req.body;

  const hash = createHash("sha512");

  hash.update(password);

  const hashedPassword = hash.digest("hex");

  console.log(hashedPassword);
  try {
    const user = await db.collection("users").findOne({ email: email });
    if (!user || hashedPassword !== user.password) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    req.session.user = user;

    res.send({ autenticated: true });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
